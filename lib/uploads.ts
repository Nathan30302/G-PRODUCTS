import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { persistentUploadsRoot } from "@/lib/persist-data";

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

type ImageKind = "jpg" | "png" | "webp" | "gif";

const MIME_TO_KIND: Record<string, ImageKind> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

const EXT_TO_KIND: Record<string, ImageKind> = {
  ".jpg": "jpg",
  ".jpeg": "jpg",
  ".jpe": "jpg",
  ".png": "png",
  ".webp": "webp",
  ".gif": "gif"
};

/**
 * Prefer a real persistent volume. Fall back to a writable runtime folder
 * outside `public/` — Next production often won't pick up files added to
 * `public/` after `next start` has already booted.
 */
export function uploadsRoot(): string {
  return persistentUploadsRoot();
}

export function ensureUploadsDir(...segments: string[]): string {
  const dir = path.join(uploadsRoot(), ...segments);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Public URL stored in DB and used by next/image + <img>. */
export function publicUploadUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "");
  return `/api/media/${clean}`;
}

export function resolveUploadPath(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "").replace(/\.\./g, "");
  return path.join(uploadsRoot(), clean);
}

function sniffImageKind(buf: Buffer): ImageKind | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "jpg";
  }
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return "png";
  }
  if (
    buf.length >= 6 &&
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38
  ) {
    return "gif";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

function isHeicLike(buf: Buffer, mime: string, filename: string): boolean {
  const lowerMime = mime.toLowerCase();
  const lowerName = filename.toLowerCase();
  if (
    lowerMime.includes("heic") ||
    lowerMime.includes("heif") ||
    lowerName.endsWith(".heic") ||
    lowerName.endsWith(".heif")
  ) {
    return true;
  }
  // ISO BMFF "ftyp" box used by HEIC/HEIF
  if (buf.length >= 12 && buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12).toLowerCase();
    return (
      brand.startsWith("heic") ||
      brand.startsWith("heif") ||
      brand.startsWith("mif1") ||
      brand.startsWith("msf1")
    );
  }
  return false;
}

function resolveImageKind(
  buf: Buffer,
  mime: string,
  filename: string
): ImageKind {
  if (isHeicLike(buf, mime, filename)) {
    throw new Error(
      "iPhone HEIC photos aren’t supported. In Photos, tap the image → Share → Options → Most Compatible (JPG), then upload again."
    );
  }

  const sniffed = sniffImageKind(buf);
  if (sniffed) return sniffed;

  const fromMime = MIME_TO_KIND[mime.toLowerCase()];
  if (fromMime) return fromMime;

  const ext = path.extname(filename).toLowerCase();
  const fromExt = EXT_TO_KIND[ext];
  if (fromExt) return fromExt;

  throw new Error("Use a JPG, PNG, WebP or GIF photo.");
}

function diskFullMessage(err: unknown): string | null {
  const code =
    err && typeof err === "object" && "code" in err
      ? String((err as { code?: string }).code)
      : "";
  if (code === "ENOSPC") {
    return "Storage is full on the server. Expand the Railway /data volume (at least 5 GB), then try again.";
  }
  if (code === "EACCES" || code === "EPERM") {
    return "Could not write the photo to storage. Check that the /data volume is mounted and writable.";
  }
  return null;
}

export type UploadFolder = "products" | "services" | "service-pages" | "misc";

async function assertDiskSpace(dir: string, neededBytes: number): Promise<void> {
  try {
    const { statfs } = await import("node:fs/promises");
    const info = await statfs(dir);
    const free = Number(info.bavail) * Number(info.bsize);
    // Keep a small cushion so SQLite WAL / DB writes still succeed.
    if (free < neededBytes + 2 * 1024 * 1024) {
      throw new Error(
        "Storage is full on the server. Expand the Railway /data volume (at least 5 GB), then try again."
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Storage is full")) {
      throw err;
    }
    // statfs unavailable — writeFile will surface ENOSPC if needed.
  }
}

export async function saveImageUpload(
  file: Blob & { name?: string; type?: string },
  folder: UploadFolder = "misc"
): Promise<{ url: string; relativePath: string }> {
  if (!file || file.size === 0) {
    throw new Error("No file received.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Photo is too large (max 15MB).");
  }

  const filename = (file.name || "photo.jpg").trim() || "photo.jpg";
  const mime = (file.type || "").trim().toLowerCase();
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    throw new Error("No file received.");
  }

  const kind = resolveImageKind(buf, mime, filename);
  const dir = ensureUploadsDir(folder);
  await assertDiskSpace(dir, buf.length);
  const outName = `${Date.now()}-${randomBytes(4).toString("hex")}.${kind}`;
  const absolute = path.join(dir, outName);

  try {
    await writeFile(absolute, buf);
  } catch (err) {
    const diskMsg = diskFullMessage(err);
    if (diskMsg) throw new Error(diskMsg);
    throw err;
  }

  const relativePath = `${folder}/${outName}`;
  return { url: publicUploadUrl(relativePath), relativePath };
}

export function isUploadUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith("/api/media/") || url.startsWith("/uploads/");
}

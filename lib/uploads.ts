import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif"
]);

/**
 * Prefer Railway volume (/data). Fall back to a writable runtime folder
 * outside `public/` — Next production often won't pick up files added to
 * `public/` after `next start` has already booted.
 */
export function uploadsRoot(): string {
  if (existsSync("/data")) return path.join("/data", "uploads");
  return path.join(process.cwd(), ".uploads");
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

export async function saveImageUpload(
  file: File,
  folder: "products" | "services" | "misc" = "misc"
): Promise<{ url: string; relativePath: string }> {
  if (!file || file.size === 0) {
    throw new Error("No file received.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Photo is too large (max 15MB).");
  }
  const type = (file.type || "").toLowerCase();
  if (!ALLOWED.has(type)) {
    throw new Error("Use a JPG, PNG, WebP or GIF photo.");
  }

  const ext =
    type === "image/png"
      ? "png"
      : type === "image/webp"
        ? "webp"
        : type === "image/gif"
          ? "gif"
          : "jpg";

  const dir = ensureUploadsDir(folder);
  const filename = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buf);

  const relativePath = `${folder}/${filename}`;
  return { url: publicUploadUrl(relativePath), relativePath };
}

export function isUploadUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith("/api/media/") || url.startsWith("/uploads/");
}

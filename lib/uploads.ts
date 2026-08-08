import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif"
]);

/** Persist under Railway volume when present so photos survive redeploys. */
export function uploadsRoot(): string {
  if (existsSync("/data")) return path.join("/data", "uploads");
  return path.join(process.cwd(), "public", "uploads");
}

export function ensureUploadsDir(...segments: string[]): string {
  const dir = path.join(uploadsRoot(), ...segments);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Public URL used in <Image src> and stored in the DB. */
export function publicUploadUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "");
  // /data is outside public/ — serve through the media API
  if (uploadsRoot().startsWith("/data")) {
    return `/api/media/${clean}`;
  }
  return `/uploads/${clean}`;
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
    throw new Error("Photo is too large (max 8MB).");
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

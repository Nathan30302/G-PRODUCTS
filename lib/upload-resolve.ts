/**
 * Resolve an uploaded file across current and legacy storage locations.
 * Railway redeploys and older builds used different folders — check them all.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { resolveUploadPath, uploadsRoot } from "@/lib/uploads";

export function legacyUploadRoots(): string[] {
  const cwd = process.cwd();
  const roots = [
    uploadsRoot(),
    path.join(cwd, ".uploads"),
    path.join("/data", "uploads"),
    path.join(cwd, "public", "uploads")
  ];
  return [...new Set(roots)];
}

export function resolveUploadFile(relativePath: string): string | null {
  const clean = relativePath.replace(/^\/+/, "").replace(/\.\./g, "");

  for (const root of legacyUploadRoots()) {
    const absolute = path.join(root, clean);
    if (!absolute.startsWith(root)) continue;
    if (existsSync(absolute)) return absolute;
  }

  // Primary resolver (may not exist yet — still validate traversal)
  const primary = resolveUploadPath(clean);
  const primaryRoot = uploadsRoot();
  if (primary.startsWith(primaryRoot) && existsSync(primary)) {
    return primary;
  }

  return null;
}

/** Accept /api/media/products/x.jpg and legacy /uploads/products/x.jpg */
export function uploadRelativeFromPublicUrl(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.startsWith("/api/media/")) {
    return trimmed.slice("/api/media/".length);
  }
  if (trimmed.startsWith("/uploads/")) {
    return trimmed.slice("/uploads/".length);
  }
  return null;
}

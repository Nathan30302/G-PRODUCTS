/** Helpers for service upload URLs (printing docs, loan NRC, etc.). */

export type ServiceFileKind = "image" | "pdf" | "doc" | "other";

export type ServiceFileInfo = {
  url: string;
  filename: string;
  kind: ServiceFileKind;
  /** Forced-download URL preserving original bytes */
  downloadUrl: string;
};

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;
const PDF_EXT = /\.pdf$/i;
const DOC_EXT = /\.(docx?|rtf)$/i;

/** Stored names look like `1734…-a1b2c3-original_name.pdf` */
export function displayFilenameFromUrl(url: string): string {
  const base = (url.split("?")[0] ?? "").split("/").pop() ?? "file";
  const match = base.match(/^\d+-[a-f0-9]+-(.+)$/i);
  return match?.[1] ?? base;
}

export function kindFromFilename(name: string): ServiceFileKind {
  if (IMAGE_EXT.test(name)) return "image";
  if (PDF_EXT.test(name)) return "pdf";
  if (DOC_EXT.test(name)) return "doc";
  return "other";
}

/** Public media URL with Content-Disposition attachment (original quality). */
export function mediaDownloadUrl(url: string, filename?: string): string {
  const path = url.split("?")[0] ?? url;
  const name = filename ?? displayFilenameFromUrl(path);
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}download=1&name=${encodeURIComponent(name)}`;
}

export function parseServiceFileUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === "string" && u.length > 0);
  } catch {
    return [];
  }
}

export function describeServiceFiles(
  raw: string | null | undefined
): ServiceFileInfo[] {
  return parseServiceFileUrls(raw).map((url) => {
    const filename = displayFilenameFromUrl(url);
    return {
      url,
      filename,
      kind: kindFromFilename(filename),
      downloadUrl: mediaDownloadUrl(url, filename)
    };
  });
}

export function attachmentContentDisposition(filename: string): string {
  const ascii =
    filename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "") || "download";
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

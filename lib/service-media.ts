/** Curated service cover under /public/services — one photo by default. */
export const SERVICE_COVERS: Record<string, string> = {
  "key-cutting": "/services/key-cutting-cover.jpg",
  printing: "/services/printing-cover.jpg",
  "g-loans": "/services/g-loans-cover.jpg"
};

/** @deprecated use SERVICE_COVERS — kept as single-item galleries for callers. */
export const SERVICE_GALLERIES: Record<string, string[]> = {
  "key-cutting": [SERVICE_COVERS["key-cutting"]],
  printing: [SERVICE_COVERS.printing],
  "g-loans": [SERVICE_COVERS["g-loans"]]
};

/** Old flyer / Unsplash covers we replace with the curated cover when alone in DB. */
const LEGACY_COVERS = new Set([
  "/services/key-cutting.png",
  "/services/g-loans.png",
  "/services/printing-menu.jpg",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80"
]);

export function parseServiceImageUrls(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function serializeServiceImageUrls(urls: string[]): string {
  return urls.map((u) => u.trim()).filter(Boolean).join("\n");
}

function isLegacyCover(url: string): boolean {
  if (LEGACY_COVERS.has(url)) return true;
  if (url.includes("images.unsplash.com")) return true;
  // Old multi-shot gallery paths — treat as legacy so we fall back to cover-only
  if (/\/services\/(key-cutting|printing|g-loans)\//.test(url)) return true;
  return false;
}

/**
 * Resolve images for a service offer.
 * Default: one cover photo. Gift can upload more via Admin → Service pages.
 */
export function resolveServiceImages(
  slug: string,
  imageUrl: string | null | undefined
): string[] {
  const cover =
    SERVICE_COVERS[slug] ??
    (imageUrl ? parseServiceImageUrls(imageUrl)[0] : "") ??
    "";
  const fromDb = parseServiceImageUrls(imageUrl).filter((u) => !isLegacyCover(u));

  if (fromDb.length > 0) return fromDb;
  return cover ? [cover] : [];
}

export function coverFromImages(images: string[]): string {
  return images[0] ?? "";
}

/** Admin editor: show Gift's uploads, or the single cover when still on defaults. */
export function adminInitialServiceImages(
  slug: string,
  imageUrl: string | null | undefined
): string[] {
  const fromDb = parseServiceImageUrls(imageUrl).filter((u) => !isLegacyCover(u));
  if (fromDb.length > 0) return fromDb;
  const cover = SERVICE_COVERS[slug];
  return cover ? [cover] : [];
}

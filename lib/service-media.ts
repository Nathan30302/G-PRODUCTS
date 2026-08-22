/** Curated HD galleries under /public/services — first item is the default cover. */
export const SERVICE_GALLERIES: Record<string, string[]> = {
  "key-cutting": [
    "/services/key-cutting/03-car-key-cut.jpg",
    "/services/key-cutting/01-machine.jpg",
    "/services/key-cutting/04-bq-cutter.jpg",
    "/services/key-cutting/02-duplicator.jpg",
    "/services/key-cutting/06-transponder.jpg",
    "/services/key-cutting/05-ford-fob.jpg"
  ],
  printing: [
    "/services/printing/01-photocopier.jpg",
    "/services/printing/03-lexmark.jpg",
    "/services/printing/08-uganda-copier.jpg",
    "/services/printing/04-inkjet.jpg",
    "/services/printing/02-sharp-copier.jpg",
    "/services/printing/05-documents.jpg",
    "/services/printing/06-imagerunner.jpg",
    "/services/printing/07-menu.jpg"
  ],
  "g-loans": [
    "/services/g-loans/01-kwacha.jpg",
    "/services/g-loans/02-mobile-money.jpg",
    "/services/g-loans/03-check.jpg",
    "/services/g-loans/04-brand.jpg"
  ]
};

/** Old flyer / Unsplash covers we replace with the curated gallery when alone in DB. */
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
  return false;
}

/**
 * Resolve gallery for a service offer.
 * - Multiple DB urls (newline-separated imageUrl) win — Gift's cover picker.
 * - Single custom upload stays cover, curated shots fill the rest.
 * - Legacy flyer / Unsplash alone → full curated gallery.
 */
export function resolveServiceImages(
  slug: string,
  imageUrl: string | null | undefined
): string[] {
  const defaults =
    SERVICE_GALLERIES[slug] ??
    (imageUrl ? parseServiceImageUrls(imageUrl) : []);
  const fromDb = parseServiceImageUrls(imageUrl);

  if (fromDb.length > 1) return fromDb;

  if (fromDb.length === 1) {
    const cover = fromDb[0];
    if (isLegacyCover(cover) || defaults.includes(cover)) {
      return defaults.length ? defaults : [cover];
    }
    return [cover, ...defaults.filter((u) => u !== cover)];
  }

  return defaults;
}

export function coverFromImages(images: string[]): string {
  return images[0] ?? "";
}

/** Admin editor: seed uploader with DB urls, or curated gallery when still on legacy. */
export function adminInitialServiceImages(
  slug: string,
  imageUrl: string | null | undefined
): string[] {
  const fromDb = parseServiceImageUrls(imageUrl);
  if (fromDb.length > 1) return fromDb;
  if (fromDb.length === 1 && !isLegacyCover(fromDb[0])) {
    const defaults = SERVICE_GALLERIES[slug] ?? [];
    return [fromDb[0], ...defaults.filter((u) => u !== fromDb[0])];
  }
  return SERVICE_GALLERIES[slug] ?? fromDb;
}

/** Extra required pickers (e.g. iPhone model for silicone pouches). */

export type FitmentConfig = {
  label: string;
  options: string[];
};

/**
 * Distinct silicone-case camera layouts.
 * Each iPhone model maps to one layout so gallery cutouts match that phone.
 */
export type CameraFamily =
  | "single"
  | "plus"
  | "x"
  | "xr"
  | "11pro"
  | "12dual"
  | "12pro"
  | "14pro"
  | "15dual"
  | "15pro"
  | "17dual"
  | "17pro"
  /** Legacy catalog tags still on disk */
  | "notch"
  | "island";

export const CAMERA_FAMILIES: CameraFamily[] = [
  "single",
  "plus",
  "x",
  "xr",
  "11pro",
  "12dual",
  "12pro",
  "14pro",
  "15dual",
  "15pro",
  "17dual",
  "17pro"
];

/** Layouts we generate / store as catalog files (not legacy aliases). */
export const POUCH_LAYOUTS = CAMERA_FAMILIES;

const IPHONE_MODELS = [
  "iPhone 6",
  "iPhone 6 Plus",
  "iPhone 6s",
  "iPhone 6s Plus",
  "iPhone 7",
  "iPhone 7 Plus",
  "iPhone 8",
  "iPhone 8 Plus",
  "iPhone X",
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
  "iPhone 13",
  "iPhone 13 mini",
  "iPhone 13 Pro",
  "iPhone 13 Pro Max",
  "iPhone 14",
  "iPhone 14 Plus",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 15",
  "iPhone 15 Plus",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 16",
  "iPhone 16 Plus",
  "iPhone 16 Pro",
  "iPhone 16 Pro Max",
  "iPhone 17",
  "iPhone 17 Air",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max"
];

export const FITMENT_BY_SLUG: Record<string, FitmentConfig> = {
  "phone-pouch": {
    label: "iPhone model",
    options: IPHONE_MODELS
  }
};

export function fitmentForSlug(slug: string): FitmentConfig | null {
  return FITMENT_BY_SLUG[slug] ?? null;
}

/** `iPhone 15 Pro Max` → `iphone-15-pro-max` */
export function modelSlug(model: string | null | undefined): string | null {
  if (!model) return null;
  const slug = model
    .trim()
    .toLowerCase()
    .replace(/^iphone\s+/i, "iphone-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return slug || null;
}

/** Map a chosen iPhone model to its pouch camera layout. */
export function cameraFamilyForModel(
  model: string | null | undefined
): CameraFamily | null {
  if (!model) return null;
  const m = model.trim();

  if (/iPhone 17\s+Pro/i.test(m)) return "17pro";
  if (/iPhone 17/i.test(m)) return "17dual";

  if (/iPhone 1[56]\s+Pro/i.test(m)) return "15pro";
  if (/iPhone 1[56]\b/i.test(m)) return "15dual";

  if (/iPhone 14\s+Pro/i.test(m)) return "14pro";

  if (/iPhone (12|13)\s+Pro/i.test(m)) return "12pro";
  if (/iPhone (12|13|14)\b/i.test(m)) return "12dual";

  if (/iPhone 11\s+Pro/i.test(m)) return "11pro";
  if (/iPhone (XR|11)\b/i.test(m)) return "xr";
  if (/iPhone (X|XS)\b/i.test(m)) return "x";

  if (/iPhone (6|6s|7|8)\s+Plus/i.test(m)) return "plus";
  if (/iPhone (6|6s|7|8)\b/i.test(m)) return "single";

  return null;
}

/** Legacy 4-family fallback when a finer layout file is missing. */
export function legacyFamilyForLayout(layout: CameraFamily): "single" | "plus" | "notch" | "island" {
  if (layout === "single") return "single";
  if (layout === "plus") return "plus";
  if (layout === "x" || layout === "xr" || layout === "11pro" || layout === "notch") {
    return "notch";
  }
  return "island";
}

export function modelFromUrl(url: string): string | null {
  const m = url.match(/-(iphone-[a-z0-9-]+?)(?:-\d+)?\.(?:jpe?g|png|webp)/i);
  if (!m) return null;
  const slug = m[1].toLowerCase();
  return IPHONE_MODELS.find((opt) => modelSlug(opt) === slug) ?? null;
}

export function cameraFamilyFromUrl(url: string): CameraFamily | null {
  const fromModel = modelFromUrl(url);
  if (fromModel) return cameraFamilyForModel(fromModel);

  const m = url.match(
    /-(single|plus|x|xr|11pro|12dual|12pro|14pro|15dual|15pro|17dual|17pro|notch|island)(?:-\d+)?\.(?:jpe?g|png|webp)$/i
  );
  return (m?.[1]?.toLowerCase() as CameraFamily) ?? null;
}

export function shortModelLabel(model: string): string {
  return model.replace(/^iPhone\s+/i, "");
}

/** Extra required pickers (e.g. iPhone model for silicone pouches). */

export type FitmentConfig = {
  label: string;
  options: string[];
};

/** Camera cutout families for silicone pouches (matches catalog filenames). */
export type CameraFamily = "single" | "plus" | "notch" | "island";

export const CAMERA_FAMILIES: CameraFamily[] = [
  "single",
  "plus",
  "notch",
  "island"
];

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
  "iPhone 16 Pro Max"
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

/** Map a chosen iPhone model to the pouch camera-cutout family. */
export function cameraFamilyForModel(model: string | null | undefined): CameraFamily | null {
  if (!model) return null;
  const m = model.trim();

  // Dual-camera Plus (home-button era)
  if (/iPhone (6|6s|7|8)\s+Plus/i.test(m)) return "plus";

  // Single rear camera (home-button era)
  if (/iPhone (6|6s|7|8)\b/i.test(m) && !/Plus/i.test(m)) return "single";

  // Notch / dual–triple camera X–11 era
  if (/iPhone (X|XR|XS|11)/i.test(m)) return "notch";

  // Dynamic Island / square module 12–16
  if (/iPhone 1[2-6]/i.test(m)) return "island";

  return null;
}

export function cameraFamilyFromUrl(url: string): CameraFamily | null {
  const m = url.match(/-(single|plus|notch|island)(?:-\d+)?\.(?:jpe?g|png|webp)/i);
  return (m?.[1]?.toLowerCase() as CameraFamily) ?? null;
}

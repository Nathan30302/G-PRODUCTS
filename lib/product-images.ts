import { Product, ProductImage, ProductVariant } from "@/lib/types";
import {
  cameraFamilyForModel,
  cameraFamilyFromUrl,
  legacyFamilyForLayout,
  modelFromUrl,
  type CameraFamily
} from "@/lib/fitment";

function scoreImage(
  url: string,
  family: CameraFamily,
  fitmentModel: string | null | undefined
): number {
  const modelHit = fitmentModel && modelFromUrl(url) === fitmentModel;
  if (modelHit) return 100;

  const fromUrl = cameraFamilyFromUrl(url);
  if (!fromUrl) return 0;
  if (fromUrl === family) return 80;

  const legacy = legacyFamilyForLayout(family);
  if (fromUrl === legacy) return 40;
  // Old "notch"/"island" buckets also match when URL still uses those tags
  if (
    (family === "x" || family === "xr" || family === "11pro") &&
    fromUrl === "notch"
  ) {
    return 40;
  }
  if (
    (family === "12dual" ||
      family === "12pro" ||
      family === "14pro" ||
      family === "15dual" ||
      family === "15pro" ||
      family === "17dual" ||
      family === "17pro") &&
    fromUrl === "island"
  ) {
    return 40;
  }
  return 0;
}

/** Images for a colour: variant-specific first, then shared (no variantId). */
export function imagesForVariant(
  images: ProductImage[],
  variantId?: string | null,
  opts?: { cameraFamily?: CameraFamily | null; fitmentModel?: string | null }
): ProductImage[] {
  const family =
    opts?.cameraFamily ?? cameraFamilyForModel(opts?.fitmentModel ?? null);

  const shared = images.filter((i) => !i.variantId);
  let pool: ProductImage[];
  if (variantId) {
    const forVariant = images.filter((i) => i.variantId === variantId);
    pool =
      forVariant.length > 0
        ? [...forVariant, ...shared]
        : shared.length > 0
          ? shared
          : images;
  } else if (shared.length > 0) {
    pool = shared;
  } else {
    pool = images;
  }

  if (!family) {
    // Listing / pre-fitment: prefer modern Pro / island cutouts when present
    const modern = pool.filter((i) => {
      const f = cameraFamilyFromUrl(i.url);
      return (
        f === "15pro" ||
        f === "15dual" ||
        f === "17pro" ||
        f === "island" ||
        f === "14pro"
      );
    });
    if (modern.length > 0) return modern;
    return pool;
  }

  const ranked = pool
    .map((img) => ({
      img,
      score: scoreImage(img.url, family, opts?.fitmentModel)
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    const best = ranked[0].score;
    return ranked.filter((x) => x.score === best).map((x) => x.img);
  }

  // Fall back to untagged colour shots (legacy catalog) rather than wrong cutout
  const untagged = pool.filter((i) => cameraFamilyFromUrl(i.url) === null);
  return untagged.length > 0 ? untagged : pool;
}

export function coverImageForProduct(
  product: Product,
  variant?: ProductVariant | null,
  fitmentModel?: string | null
): string {
  const list = imagesForVariant(product.images, variant?.id, {
    fitmentModel
  });
  return list[0]?.url ?? product.images[0]?.url ?? "";
}

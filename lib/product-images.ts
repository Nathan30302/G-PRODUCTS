import { Product, ProductImage, ProductVariant } from "@/lib/types";
import {
  cameraFamilyForModel,
  cameraFamilyFromUrl,
  type CameraFamily
} from "@/lib/fitment";

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
    pool = forVariant.length > 0 ? [...forVariant, ...shared] : shared.length > 0 ? shared : images;
  } else if (shared.length > 0) {
    pool = shared;
  } else {
    pool = images;
  }

  if (!family) return pool;

  const matched = pool.filter((i) => cameraFamilyFromUrl(i.url) === family);
  if (matched.length > 0) return matched;

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

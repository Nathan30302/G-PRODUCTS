import { Product, ProductImage, ProductVariant } from "@/lib/types";

/** Images for a colour: variant-specific first, then shared (no variantId). */
export function imagesForVariant(
  images: ProductImage[],
  variantId?: string | null
): ProductImage[] {
  if (variantId) {
    const forVariant = images.filter((i) => i.variantId === variantId);
    if (forVariant.length > 0) return forVariant;
  }
  const shared = images.filter((i) => !i.variantId);
  if (shared.length > 0) return shared;
  return images;
}

export function coverImageForProduct(
  product: Product,
  variant?: ProductVariant | null
): string {
  const list = imagesForVariant(product.images, variant?.id);
  return list[0]?.url ?? product.images[0]?.url ?? "";
}

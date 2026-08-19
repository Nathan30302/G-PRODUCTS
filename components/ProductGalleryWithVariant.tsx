"use client";

import { ProductGallery } from "@/components/ProductGallery";
import { useProductVariant } from "@/components/ProductVariantContext";

export function ProductGalleryWithVariant({
  name,
  badge
}: {
  name: string;
  badge?: string | null;
}) {
  const { galleryImages, selectedId } = useProductVariant();
  return (
    <ProductGallery
      key={selectedId ?? "default"}
      images={galleryImages}
      name={name}
      badge={badge}
    />
  );
}

"use client";

import { ProductGallery, VariantColorPicker } from "@/components/ProductGallery";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductVariant } from "@/lib/types";

export function ProductGalleryWithVariant({
  name,
  badge,
  variants
}: {
  name: string;
  badge?: string | null;
  variants: ProductVariant[];
}) {
  const { galleryImages, selectedId, setSelectedId } = useProductVariant();

  return (
    <div>
      <ProductGallery
        key={selectedId ?? "default"}
        images={galleryImages}
        name={name}
        badge={badge}
      />
      <VariantColorPicker
        variants={variants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}

"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { Product, ProductImage, ProductVariant } from "@/lib/types";
import { imagesForVariant } from "@/lib/product-images";

type VariantContextValue = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selected: ProductVariant | null;
  galleryImages: ProductImage[];
};

const ProductVariantContext = createContext<VariantContextValue | null>(null);

export function ProductVariantProvider({
  product,
  children
}: {
  product: Product;
  children: ReactNode;
}) {
  const firstAvailable =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(
    firstAvailable?.id ?? null
  );

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedId) ?? null,
    [product.variants, selectedId]
  );

  const galleryImages = useMemo(
    () => imagesForVariant(product.images, selectedId),
    [product.images, selectedId]
  );

  return (
    <ProductVariantContext.Provider
      value={{ selectedId, setSelectedId, selected, galleryImages }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  const ctx = useContext(ProductVariantContext);
  if (!ctx) {
    throw new Error("useProductVariant must be used within ProductVariantProvider");
  }
  return ctx;
}

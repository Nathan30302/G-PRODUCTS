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
import { fitmentForSlug, type FitmentConfig } from "@/lib/fitment";

type VariantContextValue = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selected: ProductVariant | null;
  galleryImages: ProductImage[];
  fitment: FitmentConfig | null;
  fitmentValue: string | null;
  setFitmentValue: (value: string | null) => void;
  fitmentReady: boolean;
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
  const fitment = fitmentForSlug(product.slug);
  const [fitmentValue, setFitmentValue] = useState<string | null>(null);

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedId) ?? null,
    [product.variants, selectedId]
  );

  const galleryImages = useMemo(
    () =>
      imagesForVariant(product.images, selectedId, {
        fitmentModel: fitmentValue
      }),
    [product.images, selectedId, fitmentValue]
  );

  const fitmentReady = !fitment || Boolean(fitmentValue);

  return (
    <ProductVariantContext.Provider
      value={{
        selectedId,
        setSelectedId,
        selected,
        galleryImages,
        fitment,
        fitmentValue,
        setFitmentValue,
        fitmentReady
      }}
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

"use client";

import { Product } from "@/lib/types";
import { ProductActions } from "@/components/ProductActions";
import { useProductVariant } from "@/components/ProductVariantContext";

export function ProductDetailInfo({ product }: { product: Product }) {
  const { selected } = useProductVariant();

  return (
    <div className="lg:py-1">
      {product.brand && (
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
          {product.brand}
        </p>
      )}

      <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
        {product.name}
      </h1>

      {selected && product.variants.length > 1 && (
        <p className="mt-1 text-sm text-white/45 lg:hidden">{selected.name}</p>
      )}

      <p className="mt-5 text-sm leading-relaxed text-white/60 sm:text-base">
        {product.description}
      </p>

      <div className="mt-8 max-w-md">
        <ProductActions product={product} />
      </div>
    </div>
  );
}

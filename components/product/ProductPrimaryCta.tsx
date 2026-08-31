"use client";

import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useProductVariant } from "@/components/ProductVariantContext";
import { siteConfig } from "@/config/site";

export function ProductPrimaryCta({ product }: { product: Product }) {
  const { selected, fitment, fitmentValue, fitmentReady } = useProductVariant();

  return (
    <div className="mt-6">
      <AddToCartButton
        product={product}
        variant={selected}
        fitment={fitmentValue}
        requireFitment={Boolean(fitment)}
      />
      {!fitmentReady && fitment ? (
        <p className="mt-2 text-center text-xs text-gp-text-muted">
          Select your {fitment.label.toLowerCase()} above to add to cart
        </p>
      ) : null}
      <p className="mt-3 text-center text-sm text-gp-text-muted">
        {siteConfig.deliveryNote}
      </p>
    </div>
  );
}

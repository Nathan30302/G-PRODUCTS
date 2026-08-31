"use client";

import { Product, hasPricedOptions, unitPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useProductVariant } from "@/components/ProductVariantContext";
import { Icon } from "@/components/Icons";
import { productStockLabel } from "@/lib/product-stock";

export function ProductPriceBlock({
  product,
  compareOff,
  saved,
  avgRating,
  reviewCount
}: {
  product: Product;
  compareOff?: number | null;
  saved?: number;
  avgRating?: number | null;
  reviewCount?: number;
}) {
  const { selected } = useProductVariant();
  const pricedOptions = hasPricedOptions(product);
  const multi = product.variants.length > 1;
  const displayPrice = unitPrice(product, selected);
  const compareAt =
    product.compareAtPrice && product.compareAtPrice > displayPrice
      ? product.compareAtPrice
      : null;
  const showFrom = pricedOptions && multi && !selected;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {showFrom ? (
          <span className="text-sm font-medium text-gp-text-muted">From</span>
        ) : null}
        <span className="text-[1.75rem] font-extrabold tabular-nums tracking-tight text-gp-text">
          {formatPrice(displayPrice)}
        </span>
        {compareAt && !pricedOptions ? (
          <span className="text-sm font-normal tabular-nums text-gp-text-subtle line-through">
            {formatPrice(compareAt)}
          </span>
        ) : null}
        {compareOff ? (
          <span className="rounded-pill bg-brand px-2.5 py-0.5 text-xs font-bold text-ink-950">
            Save {compareOff}%
          </span>
        ) : null}
      </div>

      <p className="mt-1.5 text-xs text-gp-text-muted">
        Pay with{" "}
        <span className="font-semibold text-accent">Mobile Money</span>
        {" · "}MTN · Airtel · Zamtel
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        {avgRating != null && reviewCount != null && reviewCount > 0 ? (
          <>
            <Icon name="star" className="h-4 w-4 text-accent" />
            <span className="font-semibold tabular-nums text-gp-text">
              {avgRating}
            </span>
            <span className="text-gp-text-subtle">|</span>
            <span className="text-gp-text-muted">
              {reviewCount} Review{reviewCount === 1 ? "" : "s"}
            </span>
          </>
        ) : (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            <span className="font-medium text-gp-text-muted">
              {productStockLabel(product)}
            </span>
          </>
        )}
      </div>

      {compareOff && saved && !pricedOptions ? (
        <p className="mt-1 text-xs font-medium text-accent">
          You save {formatPrice(saved)} on this item
        </p>
      ) : null}
    </div>
  );
}

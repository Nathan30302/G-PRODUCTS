"use client";

import { useState } from "react";
import { Product, unitPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { useProductVariant } from "@/components/ProductVariantContext";

export function ProductActions({ product }: { product: Product }) {
  const { selected, fitment, fitmentValue, fitmentReady } = useProductVariant();
  const [qty, setQty] = useState(1);

  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined,
    selected ?? undefined,
    fitmentValue ?? undefined
  );

  const unavailable = selected
    ? !selected.available
    : product.stock === "sold_out";

  const linePrice = unitPrice(product, selected);
  const lineTotal = linePrice * qty;

  return (
    <div id="buy" className="scroll-mt-[calc(var(--chrome-h)+1rem)] space-y-3">
      {unavailable ? (
        <NotifyMeForm
          productId={product.id}
          variantId={selected?.id}
          variantName={selected?.name}
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gp-border bg-gp-muted/50 px-3.5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-gp-text-muted">
              Quantity
            </span>
            <div className="flex items-center gap-1 rounded-pill border border-gp-border bg-white p-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-9 w-9 place-items-center rounded-full text-gp-text transition-colors hover:bg-gp-muted hover:text-ink-700"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <span className="min-w-[2ch] text-center text-base font-bold tabular-nums text-gp-text">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="grid h-9 w-9 place-items-center rounded-full text-gp-text transition-colors hover:bg-gp-muted hover:text-ink-700"
              >
                <Icon name="plus" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {(qty > 1 || hasPricedOptions(product)) && (
            <p className="text-center text-xs text-gp-text-muted">
              {formatPrice(linePrice)} × {qty} ={" "}
              <span className="font-semibold text-gp-text">
                {formatPrice(lineTotal)}
              </span>
            </p>
          )}

          <AddToCartButton
            product={product}
            variant={selected}
            qty={qty}
            fitment={fitmentValue}
            requireFitment={Boolean(fitment)}
          />
          {fitment && !fitmentReady ? (
            <p className="text-center text-xs text-accent">
              Select your {fitment.label.toLowerCase()} above
            </p>
          ) : null}
        </>
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-pill border border-gp-border bg-white px-4 py-3 text-sm font-semibold text-gp-text transition-colors hover:border-accent/30 hover:text-accent"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Enquire on WhatsApp
      </a>
    </div>
  );
}

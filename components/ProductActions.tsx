"use client";

import { useMemo } from "react";
import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";
import { useProductVariant } from "@/components/ProductVariantContext";
import { swatchStyle } from "@/lib/swatch";

export function ProductActions({ product }: { product: Product }) {
  const { selectedId, setSelectedId, selected } = useProductVariant();

  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined,
    selected ?? undefined
  );

  const showVariants = product.variants.length > 0;
  const unavailable = selected
    ? !selected.available
    : product.stock === "sold_out";

  const selectionLabel = useMemo(() => {
    if (!selected) return null;
    return selected.available
      ? selected.name
      : `${selected.name} · Out of stock`;
  }, [selected]);

  return (
    <div id="buy" className="scroll-mt-28 space-y-4">
      {showVariants && (
        <div>
          <p className="text-sm font-semibold text-white">
            Choose colour
            {selectionLabel && (
              <span className="ml-2 font-normal text-white/50">
                · {selectionLabel}
              </span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const active = v.id === selectedId;
              const out = !v.available;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  title={out ? `${v.name} — out of stock` : v.name}
                  className={`relative flex items-center gap-2 rounded-pill border px-3 py-2 text-sm font-medium transition-colors ${
                    out
                      ? "cursor-pointer border-white/10 bg-white/[0.03] text-white/35"
                      : active
                        ? "border-brand bg-brand/15 text-white"
                        : "border-ink-700 bg-ink-900 text-white/70 hover:border-ink-600"
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full ring-1 ring-white/20 ${
                      out ? "opacity-40 grayscale" : ""
                    }`}
                    style={swatchStyle(v.colorHex, v.name)}
                  />
                  <span
                    className={out ? "line-through decoration-white/30" : ""}
                  >
                    {v.name}
                  </span>
                  {out && (
                    <span className="absolute inset-0 rounded-pill bg-ink-950/40" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selected && selected.available && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-white/70">
          <span className="font-semibold text-white">Your selection:</span>{" "}
          {product.name} · {selected.name}
        </div>
      )}

      {unavailable ? (
        <NotifyMeForm
          productId={product.id}
          variantId={selected?.id}
          variantName={selected?.name}
        />
      ) : (
        <AddToCartButton product={product} variant={selected} />
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-3 font-semibold text-accent hover:bg-accent/20"
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  );
}

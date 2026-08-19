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
          <p className="text-sm font-semibold text-white">Choose colour</p>
          {selectionLabel && (
            <p className="mt-1 text-sm text-white/50">{selectionLabel}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {product.variants.map((v) => {
              const active = v.id === selectedId;
              const out = !v.available;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  title={out ? `${v.name} — out of stock` : v.name}
                  aria-label={v.name}
                  aria-pressed={active}
                  className={`group relative flex flex-col items-center gap-2 transition-transform active:scale-95 ${
                    out ? "opacity-50" : ""
                  }`}
                >
                  <span
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full ring-2 transition-all ${
                      active
                        ? "ring-brand ring-offset-2 ring-offset-ink-950 scale-110"
                        : "ring-white/20 hover:ring-white/40"
                    } ${out ? "grayscale" : ""}`}
                    style={swatchStyle(v.colorHex, v.name)}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-brand/60" />
                    )}
                    {out && (
                      <span className="absolute inset-0 rounded-full bg-ink-950/45" />
                    )}
                  </span>
                  <span
                    className={`max-w-[4.5rem] truncate text-center text-[11px] font-medium ${
                      active ? "text-white" : "text-white/50"
                    } ${out ? "line-through decoration-white/30" : ""}`}
                  >
                    {v.name}
                  </span>
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

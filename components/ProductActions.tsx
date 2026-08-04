"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";

function swatchStyle(hex?: string, name?: string): CSSProperties {
  if (hex) return { backgroundColor: hex };
  // fallback: hash name to a grey tone
  const n = (name ?? "x").toLowerCase();
  if (n.includes("white") || n.includes("ivory")) return { backgroundColor: "#f5f5f5" };
  if (n.includes("black") || n.includes("midnight")) return { backgroundColor: "#111111" };
  if (n.includes("blue")) return { backgroundColor: "#2563eb" };
  if (n.includes("red")) return { backgroundColor: "#dc2626" };
  if (n.includes("green")) return { backgroundColor: "#16a34a" };
  if (n.includes("gold") || n.includes("yellow")) return { backgroundColor: "#eab308" };
  if (n.includes("silver") || n.includes("grey") || n.includes("gray"))
    return { backgroundColor: "#9ca3af" };
  if (n.includes("pink")) return { backgroundColor: "#ec4899" };
  return { backgroundColor: "#6b7280" };
}

export function ProductActions({ product }: { product: Product }) {
  const firstAvailable =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(
    firstAvailable?.id ?? null
  );

  const selected = useMemo(
    () => product.variants.find((v) => v.id === selectedId) ?? null,
    [product.variants, selectedId]
  );

  const waLink = productWhatsAppLink(
    product,
    typeof window !== "undefined" ? window.location.href : undefined
  );

  const showVariants = product.variants.length > 0;
  const unavailable = selected ? !selected.available : product.stock === "sold_out";

  return (
    <div id="buy" className="scroll-mt-28 space-y-4">
      {showVariants && (
        <div>
          <p className="text-sm font-semibold text-ink-950">
            Colour
            {selected && (
              <span className="ml-2 font-normal text-ink-950/45">
                {selected.name}
                {selected.available
                  ? ` · ${selected.quantity} in stock`
                  : " · Out of stock"}
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
                  title={
                    out
                      ? `${v.name} — out of stock`
                      : `${v.name} (${v.quantity} available)`
                  }
                  className={`relative flex items-center gap-2 rounded-pill border px-3 py-2 text-sm font-medium transition-colors ${
                    out
                      ? "cursor-pointer border-ink-950/10 bg-ink-950/5 text-ink-950/30"
                      : active
                        ? "border-brand bg-brand/15 text-ink-950"
                        : "border-ink-700 bg-white text-ink-950/70 hover:border-ink-600"
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full ring-1 ring-white/20 ${
                      out ? "opacity-40 grayscale" : ""
                    }`}
                    style={swatchStyle(v.colorHex, v.name)}
                  />
                  <span className={out ? "line-through decoration-white/30" : ""}>
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

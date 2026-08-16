"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Product } from "@/lib/types";
import { AddToCartButton } from "@/components/AddToCartButton";
import { NotifyMeForm } from "@/components/NotifyMeForm";
import { productWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "@/components/Icons";

function swatchStyle(hex?: string, name?: string): CSSProperties {
  if (hex) return { backgroundColor: hex };
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

function looksLikeStorage(name: string) {
  return /\b\d+\s?(gb|tb|mb)\b/i.test(name);
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
  const storageStyle =
    showVariants &&
    product.variants.length > 1 &&
    product.variants.every((v) => looksLikeStorage(v.name));
  const colorStyle = showVariants && !storageStyle;
  // Hide useless single "Standard" colour row
  const meaningfulVariants =
    showVariants &&
    !(
      product.variants.length === 1 &&
      product.variants[0]!.name.toLowerCase() === "standard"
    );

  return (
    <div id="buy" className="scroll-mt-28 space-y-5">
      {meaningfulVariants && colorStyle ? (
        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Choose your colour
          </h2>
          <p className="mt-1 text-sm text-white/45">
            A finish that matches your style.
          </p>
          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
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
                  className={`relative flex items-center gap-2.5 rounded-pill border px-3 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                    out
                      ? "cursor-pointer border-white/10 bg-white/[0.03] text-white/35"
                      : active
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/12 bg-ink-900/80 text-white/75 hover:border-white/25"
                  }`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full ring-1 ring-white/25 ${
                      out ? "opacity-40 grayscale" : ""
                    }`}
                    style={swatchStyle(v.colorHex, v.name)}
                  />
                  <span
                    className={`min-w-0 truncate ${
                      out ? "line-through decoration-white/30" : ""
                    }`}
                  >
                    {v.name}
                  </span>
                  {out ? (
                    <span className="absolute inset-0 rounded-pill bg-ink-950/35" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {meaningfulVariants && storageStyle ? (
        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Choose your size
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Pick a size that fits your everyday needs.
          </p>
          <div className="mt-3.5 space-y-2">
            {product.variants.map((v) => {
              const active = v.id === selectedId;
              const out = !v.available;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors ${
                    out
                      ? "border-white/10 bg-white/[0.02] text-white/35"
                      : active
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/12 bg-ink-900/80 text-white/80 hover:border-white/25"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={out ? "line-through" : ""}>{v.name}</span>
                    {out ? (
                      <span className="rounded-pill bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/45">
                        Sold out
                      </span>
                    ) : null}
                  </span>
                  <span className={out ? "line-through text-white/30" : "text-white/55"}>
                    {v.available ? `${v.quantity} left` : "—"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

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

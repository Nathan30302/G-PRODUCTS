"use client";

import { Product, ProductVariant } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { swatchStyle } from "@/lib/swatch";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductGallery } from "@/components/ProductGallery";

function CircularSwatches({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (variants.length <= 1) return null;

  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2.5">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              aria-label={v.name}
              aria-pressed={active}
              title={out ? `${v.name} — out of stock` : v.name}
              className={`relative rounded-full transition-transform active:scale-95 ${
                active
                  ? "ring-2 ring-brand ring-offset-2 ring-offset-ink-950"
                  : "ring-1 ring-white/20 hover:ring-white/40"
              } ${out ? "opacity-45" : ""}`}
            >
              <span
                className={`block h-8 w-8 rounded-full ${out ? "grayscale" : ""}`}
                style={swatchStyle(v.colorHex, v.name)}
              />
              {out && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-ink-950/40" />
              )}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mt-2 text-xs text-white/50">
          {selected.name}
          {!selected.available ? " · Out of stock" : ""}
        </p>
      )}
    </div>
  );
}

export function ProductPurchasePanel({
  product,
  badge,
  compareOff,
  saved
}: {
  product: Product;
  badge?: string | null;
  compareOff?: number | null;
  saved?: number;
}) {
  const { galleryImages, selectedId, setSelectedId, selected } =
    useProductVariant();

  const inStock = selected
    ? selected.available
    : product.stock !== "sold_out";

  return (
    <div className="lg:sticky lg:top-24">
      <ProductGallery
        key={selectedId ?? "default"}
        images={galleryImages}
        name={product.name}
        badge={badge}
        showingLabel={
          product.variants.length > 1 ? selected?.name ?? null : null
        }
      />

      <CircularSwatches
        variants={product.variants}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          <span className="text-2xl font-extrabold tabular-nums tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-white/35 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={
              inStock
                ? product.stock === "low_stock"
                  ? "font-medium text-brand"
                  : "font-medium text-accent"
                : "font-medium text-white/40"
            }
          >
            {inStock
              ? product.stock === "low_stock"
                ? "Low stock"
                : "In stock"
              : "Out of stock"}
          </span>
          {compareOff && saved ? (
            <span className="rounded-pill bg-accent/10 px-2 py-0.5 font-semibold text-accent">
              Save {formatPrice(saved)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

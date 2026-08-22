"use client";

import { Product, ProductVariant, hasPricedOptions, unitPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { swatchStyle } from "@/lib/swatch";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductGallery } from "@/components/ProductGallery";

function ColourSwatches({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
        Colour
      </p>
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

function OptionChips({
  product,
  variants,
  selectedId,
  onSelect
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">
        Choose option
      </p>
      <div className="flex flex-col gap-2">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          const price = unitPrice(product, v);
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              aria-pressed={active}
              disabled={out}
              className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3.5 py-3.5 text-left text-sm transition-all duration-300 ease-out-expo ${
                active
                  ? "border-brand/50 bg-brand/10 text-white shadow-[0_0_0_1px_rgba(246,212,0,0.15)]"
                  : out
                    ? "cursor-not-allowed border-white/[0.06] bg-white/[0.02] text-white/35"
                    : "border-white/10 bg-white/[0.03] text-white/80 hover:-translate-y-0.5 hover:border-white/25"
              }`}
            >
              <span className="font-semibold">
                {v.name}
                {out ? " · Out of stock" : ""}
              </span>
              <span className="shrink-0 font-bold tabular-nums text-brand">
                {formatPrice(price)}
              </span>
            </button>
          );
        })}
      </div>
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
  const { galleryImages, selectedId, setSelectedId, selected, fitment, fitmentValue, setFitmentValue } =
    useProductVariant();

  const pricedOptions = hasPricedOptions(product);
  const multi = product.variants.length > 1;
  const displayPrice = unitPrice(product, selected);
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
        showingLabel={multi ? selected?.name ?? null : null}
      />

      {multi &&
        (pricedOptions || !product.variants.some((v) => v.colorHex) ? (
          <OptionChips
            product={product}
            variants={product.variants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <ColourSwatches
            variants={product.variants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ))}

      {fitment ? (
        <div className="mt-4">
          <label
            htmlFor="fitment-select"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/40"
          >
            {fitment.label}
          </label>
          <select
            id="fitment-select"
            value={fitmentValue ?? ""}
            onChange={(e) =>
              setFitmentValue(e.target.value ? e.target.value : null)
            }
            className="w-full rounded-xl border border-white/10 bg-ink-900 px-3.5 py-3 text-sm font-semibold text-white outline-none focus:border-brand/50"
          >
            <option value="">Select your {fitment.label.toLowerCase()}…</option>
            {fitment.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
          {pricedOptions && multi ? (
            <span className="text-xs font-medium text-white/45">
              {selected ? "Selected" : "From"}
            </span>
          ) : null}
          <span className="text-2xl font-extrabold tabular-nums tracking-tight text-white">
            {formatPrice(displayPrice)}
          </span>
          {product.compareAtPrice &&
            product.compareAtPrice > displayPrice &&
            !pricedOptions && (
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
          {compareOff && saved && !pricedOptions ? (
            <span className="rounded-pill bg-accent/10 px-2 py-0.5 font-semibold text-accent">
              Save {formatPrice(saved)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

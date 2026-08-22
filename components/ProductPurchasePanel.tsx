"use client";

import { Product, hasPricedOptions, unitPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductGallery } from "@/components/ProductGallery";
import {
  ColourPicker,
  ExtensionPicker,
  FitmentPicker,
  PricedOptionGrid
} from "@/components/ProductOptionPickers";

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
  const {
    galleryImages,
    selectedId,
    setSelectedId,
    selected,
    fitment,
    fitmentValue,
    setFitmentValue
  } = useProductVariant();

  const pricedOptions = hasPricedOptions(product);
  const multi = product.variants.length > 1;
  const displayPrice = unitPrice(product, selected);
  const inStock = selected
    ? selected.available
    : product.stock !== "sold_out";
  const isExtension = product.slug === "extension-cable";
  const isColourProduct =
    multi &&
    !pricedOptions &&
    product.variants.some((v) => Boolean(v.colorHex));

  return (
    <div className="lg:sticky lg:top-24">
      <ProductGallery
        key={selectedId ?? "default"}
        images={galleryImages}
        name={product.name}
        badge={badge}
        showingLabel={multi ? selected?.name ?? null : null}
      />

      {/* Pouches: model first, then colour (cutout depends on model). */}
      {fitment && product.slug === "phone-pouch" ? (
        <FitmentPicker
          fitment={fitment}
          value={fitmentValue}
          onChange={setFitmentValue}
        />
      ) : null}

      {multi &&
        (isExtension ? (
          <ExtensionPicker
            product={product}
            variants={product.variants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : isColourProduct || product.slug === "phone-pouch" ? (
          <ColourPicker
            product={product}
            variants={product.variants}
            selectedId={selectedId}
            onSelect={setSelectedId}
            locked={!fitmentValue && product.slug === "phone-pouch"}
            lockHint="Choose your iPhone model first"
            fitmentModel={fitmentValue}
          />
        ) : (
          <PricedOptionGrid
            product={product}
            variants={product.variants}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ))}

      {fitment && product.slug !== "phone-pouch" ? (
        <FitmentPicker
          fitment={fitment}
          value={fitmentValue}
          onChange={setFitmentValue}
        />
      ) : null}

      <div className="mt-5 border-t border-white/[0.06] pt-4">
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

"use client";

import { Product, hasPricedOptions, unitPrice } from "@/lib/types";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPriceBlock } from "@/components/product/ProductPriceBlock";
import { ProductTrustStrip } from "@/components/product/ProductTrustStrip";
import { ProductPrimaryCta } from "@/components/product/ProductPrimaryCta";
import {
  ColourPicker,
  ExtensionPicker,
  FitmentPicker,
  PricedOptionGrid
} from "@/components/ProductOptionPickers";

export function ProductPurchasePanel({
  product,
  compareOff,
  saved,
  avgRating,
  reviewCount,
  onSale
}: {
  product: Product;
  compareOff?: number | null;
  saved?: number;
  avgRating?: number | null;
  reviewCount?: number;
  onSale?: boolean;
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
  const isExtension = product.slug === "extension-cable";
  const isColourProduct =
    multi &&
    !pricedOptions &&
    product.variants.some((v) => Boolean(v.colorHex));

  return (
    <>
      <div className="px-4 sm:px-0">
        {onSale ? (
          <span className="inline-block rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950">
            Sale
          </span>
        ) : null}

        <h1 className="mt-2 text-xl font-bold leading-snug text-gp-text">
          {product.name}
        </h1>

        {selected && multi ? (
          <span className="mt-2 inline-flex rounded-full border border-gp-border px-3 py-1 text-xs font-bold uppercase tracking-wide text-gp-text">
            {selected.name}
          </span>
        ) : null}

        <ProductPriceBlock
          product={product}
          compareOff={compareOff}
          saved={saved}
          avgRating={avgRating}
          reviewCount={reviewCount}
        />
      </div>

      <div className="mt-5">
        <ProductGallery
          key={`${selectedId ?? "default"}-${fitmentValue ?? "nofit"}`}
          images={galleryImages}
          name={product.name}
          variant="plug"
        />
      </div>

      <div className="mt-6 px-4 sm:px-0">
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
              swatchesOnly={product.slug === "phone-pouch"}
              variant="plug"
            />
          ) : (
            <PricedOptionGrid
              product={product}
              variants={product.variants}
              selectedId={selectedId}
              onSelect={setSelectedId}
              variant="plug"
            />
          ))}

        {fitment && product.slug !== "phone-pouch" ? (
          <FitmentPicker
            fitment={fitment}
            value={fitmentValue}
            onChange={setFitmentValue}
          />
        ) : null}

        <ProductTrustStrip />
        <ProductPrimaryCta product={product} />
      </div>
    </>
  );
}

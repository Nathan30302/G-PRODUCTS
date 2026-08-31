"use client";

import { Product, hasPricedOptions, unitPrice } from "@/lib/types";
import { useProductVariant } from "@/components/ProductVariantContext";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPriceBlock } from "@/components/product/ProductPriceBlock";
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
  reviewCount
}: {
  product: Product;
  badge?: string | null;
  compareOff?: number | null;
  saved?: number;
  avgRating?: number | null;
  reviewCount?: number;
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
    <div className="mx-auto w-full max-w-lg lg:max-w-none">
      <h1 className="text-lg font-bold leading-snug text-gp-text sm:text-xl">
        {product.name}
      </h1>

      <ProductPriceBlock
        product={product}
        compareOff={compareOff}
        saved={saved}
        avgRating={avgRating}
        reviewCount={reviewCount}
      />

      <div className="mt-5">
        <ProductGallery
          key={`${selectedId ?? "default"}-${fitmentValue ?? "nofit"}`}
          images={galleryImages}
          name={product.name}
          variant="plug"
          showingLabel={
            multi
              ? [selected?.name, fitmentValue].filter(Boolean).join(" · ") ||
                null
              : null
          }
        />
      </div>

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
    </div>
  );
}

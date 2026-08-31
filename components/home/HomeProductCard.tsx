import Link from "next/link";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";
import { productDealBadgeLabel } from "@/lib/product-deals";
import { productStockLabel } from "@/lib/product-stock";

export function HomeProductCard({
  product,
  width = "rail",
  showDealBadge = false,
  showDealCta = false,
  variant = "default"
}: {
  product: Product;
  width?: "rail" | "grid" | "wide";
  showDealBadge?: boolean;
  /** Full-width deal button at card bottom (featured deals). */
  showDealCta?: boolean;
  /** plug = reference handpicked card styling */
  variant?: "default" | "plug";
}) {
  const variantOption =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const image = coverImageForProduct(product, variantOption);
  const priced = hasPricedOptions(product);
  const price = priced ? fromPrice(product) : product.price;
  const compare =
    !priced && product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const stockLabel = productStockLabel(product);
  const dealLabel = showDealBadge ? productDealBadgeLabel(product) : null;
  const dealCta = showDealCta ? productDealBadgeLabel(product) : null;

  const widthClass =
    width === "wide" || variant === "plug"
      ? "w-[12.75rem] shrink-0 sm:w-[13.5rem]"
      : width === "rail"
        ? "w-[11rem] shrink-0 sm:w-[12rem]"
        : "w-full";

  const isPlug = variant === "plug";

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`snap-item flex ${widthClass} flex-col overflow-hidden rounded-2xl border border-gp-border/60 bg-white shadow-[0_1px_8px_rgba(26,35,33,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,35,33,0.1)] ${
        isPlug ? "" : "shadow-card hover:shadow-card-hover"
      }`}
    >
      <div
        className={`relative bg-white ${isPlug ? "aspect-[1/1.05] px-2 pt-3" : "aspect-[4/5] bg-gp-muted/50"}`}
      >
        {image ? (
          <SafeImage
            src={image}
            alt={product.name}
            fill
            sizes={
              isPlug ? "216px" : width === "rail" ? "192px" : "(max-width: 640px) 46vw, 22vw"
            }
            className={`object-contain ${isPlug ? "p-2" : "p-3"}`}
          />
        ) : null}
        {dealLabel && !showDealCta ? (
          <span className="pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-pill bg-brand px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950 shadow-sm">
            {dealLabel}
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col ${isPlug ? "px-3.5 pb-3.5 pt-2" : "p-3"}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs font-normal text-gp-text-subtle">
            {product.brand?.trim() || "G-Products"}
          </span>
          <span className="shrink-0 text-[11px] font-medium tabular-nums text-gp-text-muted">
            <span className="text-accent">●</span> {stockLabel}
          </span>
        </div>

        <p
          className={`mt-1.5 line-clamp-2 leading-snug text-gp-text ${
            isPlug ? "text-[0.8125rem] font-bold" : "text-sm font-bold"
          }`}
        >
          {product.name}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-2.5">
          <span className="text-xs font-normal text-gp-text-subtle">From</span>
          <span className="text-[0.8125rem] font-bold tabular-nums text-gp-text">
            {formatPrice(price)}
          </span>
          {compare ? (
            <span className="text-xs font-normal tabular-nums text-gp-text-subtle line-through">
              {formatPrice(compare)}
            </span>
          ) : null}
        </div>

        {dealCta ? (
          <span className="mt-3 block w-full rounded-pill bg-brand py-2 text-center text-[11px] font-extrabold text-ink-950">
            {dealCta}
          </span>
        ) : (
          variantSwatches(product, isPlug)
        )}
      </div>
    </Link>
  );
}

function variantSwatches(product: Product, plug: boolean) {
  const colors = product.variants
    .filter((v) => v.colorHex)
    .slice(0, 5)
    .map((v) => v.colorHex as string);
  if (colors.length === 0) return null;
  return (
    <div className={`flex gap-1.5 ${plug ? "mt-3" : "mt-2"}`}>
      {colors.map((hex, i) => (
        <span
          key={`${hex}-${i}`}
          className={`rounded-full border border-black/10 ${plug ? "h-3.5 w-3.5" : "h-3 w-3"}`}
          style={{ backgroundColor: hex }}
        />
      ))}
    </div>
  );
}

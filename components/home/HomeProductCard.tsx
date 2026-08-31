import Link from "next/link";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";

export function HomeProductCard({
  product,
  ratingLabel,
  width = "rail"
}: {
  product: Product;
  ratingLabel?: string | null;
  /** rail = horizontal scroll width; grid = full column width */
  width?: "rail" | "grid";
}) {
  const variant =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const image = coverImageForProduct(product, variant);
  const priced = hasPricedOptions(product);
  const price = priced ? fromPrice(product) : product.price;
  const compare =
    !priced && product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  const badge = productBadge(product);
  const widthClass =
    width === "rail"
      ? "w-[11rem] shrink-0 sm:w-[12rem]"
      : "w-full";

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`snap-item flex ${widthClass} flex-col overflow-hidden rounded-[1.25rem] border border-gp-border/70 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover`}
    >
      <div className="relative aspect-[4/5] bg-gp-muted/50">
        {image ? (
          <SafeImage
            src={image}
            alt={product.name}
            fill
            sizes={width === "rail" ? "192px" : "(max-width: 640px) 46vw, 22vw"}
            className="object-contain p-3"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        {badge ? (
          <span className="mb-2 w-fit rounded-md bg-brand/20 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-ink-800">
            {badge}
          </span>
        ) : null}
        <div className="flex items-center justify-between gap-1">
          {product.brand ? (
            <span className="truncate text-[10px] font-medium text-gp-text-subtle">
              {product.brand}
            </span>
          ) : (
            <span className="text-[10px] text-gp-text-subtle">G-Products</span>
          )}
          {ratingLabel ? (
            <span className="shrink-0 text-[10px] font-semibold text-gp-text-muted">
              <span className="text-brand-dark">★</span> {ratingLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-gp-text">
          {product.name}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-2">
          <span className="text-sm font-bold tabular-nums text-gp-text">
            {priced ? "From " : ""}
            {formatPrice(price)}
          </span>
          {compare ? (
            <span className="text-[11px] tabular-nums text-gp-text-subtle line-through">
              {formatPrice(compare)}
            </span>
          ) : null}
        </div>
        {variantSwatches(product)}
      </div>
    </Link>
  );
}

function productBadge(product: Product): string | null {
  if (product.hotDeal) return "Hot deal";
  if (product.featured) return "Campus pick";
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    const off = discountPercent(product.price, product.compareAtPrice);
    if (off) return `Save ${off}%`;
  }
  return null;
}

function variantSwatches(product: Product) {
  const colors = product.variants
    .filter((v) => v.colorHex)
    .slice(0, 5)
    .map((v) => v.colorHex as string);
  if (colors.length === 0) return null;
  return (
    <div className="mt-2 flex gap-1">
      {colors.map((hex, i) => (
        <span
          key={`${hex}-${i}`}
          className="h-3 w-3 rounded-full border border-black/10"
          style={{ backgroundColor: hex }}
        />
      ))}
    </div>
  );
}

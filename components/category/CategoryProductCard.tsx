import Link from "next/link";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";
import { Icon } from "@/components/Icons";
import type { ReviewSummary } from "@/lib/reviews";

/** Plug-style category grid card — large image, brand, rating, From pricing. */
export function CategoryProductCard({
  product,
  review,
  priority = false
}: {
  product: Product;
  review?: ReviewSummary;
  priority?: boolean;
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

  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-gp-border/70 bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(26,35,33,0.08)]"
    >
      <div className="relative aspect-square bg-white px-2 pt-3">
        {image ? (
          <SafeImage
            src={image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 46vw, 280px"
            className="object-contain p-2"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3.5 pt-2">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gp-text-subtle">
            {product.brand?.trim() || "G-Products"}
          </span>
          {review ? (
            <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-medium tabular-nums text-gp-text-muted">
              <Icon name="star" className="h-3.5 w-3.5 text-accent" />
              {review.avg}{" "}
              <span className="text-gp-text-subtle">({review.count})</span>
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 line-clamp-2 text-[0.8125rem] font-bold leading-snug text-gp-text">
          {product.name}
        </p>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-2.5">
          <span className="text-xs text-gp-text-subtle">From</span>
          <span className="text-[0.8125rem] font-bold tabular-nums text-gp-text">
            {formatPrice(price)}
          </span>
          {compare ? (
            <span className="text-xs tabular-nums text-gp-text-subtle line-through">
              {formatPrice(compare)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

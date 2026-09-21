import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";
import { coverImageForProduct } from "@/lib/product-images";

export function AdminProductCard({
  product
}: {
  product: Product & { categoryName: string; slug: string };
}) {
  const thumb = coverImageForProduct(
    product,
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null
  );
  const totalStock = product.variants.reduce((n, v) => n + v.quantity, 0);
  const inStock = totalStock > 0;
  const lowStock = inStock && totalStock <= 5;
  const editHref = `/admin/products/${product.id}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-gp-border/70 bg-gp-surface shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink-700/25 hover:shadow-card-hover active:translate-y-0 active:scale-[0.995]">
      {/* Whole card opens the editor — Edit button is no longer required */}
      <Link
        href={editHref}
        className="absolute inset-0 z-[1]"
        aria-label={`Edit ${product.name}`}
      />

      <div className="media-well relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={thumb}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          className="object-contain bg-[#f4f6f3] p-2 transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
          fallbackClassName="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-wide text-gp-text-subtle"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/12 via-transparent to-transparent" />

        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.featured && (
            <span className="rounded-pill bg-brand/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950">
              Featured
            </span>
          )}
          {product.hotDeal && (
            <span className="rounded-pill bg-accent/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-950">
              Deal
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span
            className={`rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
              !inStock
                ? "bg-white text-gp-text-muted ring-1 ring-gp-border"
                : lowStock
                  ? "bg-brand text-ink-950"
                  : "bg-white text-accent-ink ring-1 ring-accent/40"
            }`}
          >
            {!inStock ? "Out of stock" : lowStock ? "Low stock" : "In stock"}
          </span>
          {product.variants.length > 0 && (
            <div className="flex -space-x-1">
              {product.variants.slice(0, 4).map((v) => (
                <span
                  key={v.id}
                  title={v.name}
                  className={`h-5 w-5 rounded-full ring-2 ring-white ${
                    v.available ? "" : "opacity-40 grayscale"
                  }`}
                  style={{ backgroundColor: v.colorHex || "#6b7280" }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[9px] font-bold text-gp-text-muted ring-2 ring-white">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-[2] flex flex-1 flex-col p-4 pointer-events-none">
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gp-text-subtle">
            {product.brand}
          </p>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-gp-text transition-colors group-hover:text-accent-ink sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-gp-text-muted">{product.categoryName}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-gp-text">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-gp-text-subtle line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.variants.length > 0 && (
          <p className="mt-2 text-xs text-gp-text-subtle">
            {product.variants.length} colour
            {product.variants.length === 1 ? "" : "s"} · {totalStock} units
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="pointer-events-none inline-flex items-center gap-1.5 rounded-pill bg-ink-850 px-3 py-1.5 text-xs font-bold text-white">
            <Icon name="edit" className="h-3.5 w-3.5" />
            Edit
          </span>
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative z-[3] inline-flex items-center justify-center rounded-pill border border-gp-border bg-white px-3 py-2 text-gp-text-muted shadow-sm transition-colors hover:border-ink-700/25 hover:text-ink-850"
            aria-label="View on live shop"
            title="View on live shop"
          >
            <Icon name="external" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

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
  const stockLabel = !inStock ? "Out of stock" : lowStock ? "Low stock" : "In stock";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-gp-border/80 bg-gp-surface shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink-700/20 hover:shadow-card-hover">
      <Link
        href={editHref}
        className="absolute inset-0 z-[1]"
        aria-label={`Edit ${product.name}`}
      />

      <div className="relative aspect-[5/4] overflow-hidden bg-[#f4f6f3]">
        <SafeImage
          src={thumb}
          alt={product.name}
          fill
          sizes="(max-width: 720px) 100vw, 360px"
          className="object-contain p-6 transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
          fallbackClassName="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-wide text-gp-text-subtle"
        />
      </div>

      <div className="pointer-events-none relative z-[2] flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gp-text-subtle">
          {product.categoryName}
          {product.brand ? ` · ${product.brand}` : ""}
        </p>
        <h3 className="mt-1.5 line-clamp-2 min-h-[2.6rem] text-base font-bold leading-snug text-gp-text sm:text-[1.05rem]">
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black tracking-tight text-gp-text">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price ? (
            <span className="text-sm text-gp-text-subtle line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gp-text">
            <span
              className={`h-2 w-2 rounded-full ${
                !inStock ? "bg-red-500" : lowStock ? "bg-brand" : "bg-accent"
              }`}
              aria-hidden
            />
            {stockLabel}
          </span>
          <span className="text-gp-text-muted">
            {totalStock} unit{totalStock === 1 ? "" : "s"}
          </span>
          {product.featured ? (
            <span className="font-semibold text-ink-850">Featured</span>
          ) : null}
          {product.hotDeal ? (
            <span className="font-semibold text-ink-850">Deal</span>
          ) : null}
        </div>

        {product.variants.length > 0 ? (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex -space-x-1">
              {product.variants.slice(0, 5).map((v) => (
                <span
                  key={v.id}
                  title={v.name}
                  className={`h-4 w-4 rounded-full ring-2 ring-white ${
                    v.available ? "" : "opacity-40 grayscale"
                  }`}
                  style={{ backgroundColor: v.colorHex || "#94a3b8" }}
                />
              ))}
            </div>
            <span className="text-xs text-gp-text-subtle">
              {product.variants.length} option
              {product.variants.length === 1 ? "" : "s"}
            </span>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gp-border/70 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-850">
            <Icon name="edit" className="h-3.5 w-3.5" />
            Edit
          </span>
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative z-[3] text-xs font-semibold text-gp-text-muted underline-offset-2 hover:text-ink-850 hover:underline"
          >
            View on shop
          </Link>
        </div>
      </div>
    </article>
  );
}

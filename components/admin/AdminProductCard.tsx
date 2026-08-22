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
    <article className="group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-b from-ink-850/80 to-ink-900/90 shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
      {/* Whole card opens the editor — Edit button is no longer required */}
      <Link
        href={editHref}
        className="absolute inset-0 z-[1]"
        aria-label={`Edit ${product.name}`}
      />

      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_70%)]">
        <SafeImage
          src={thumb}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 280px"
          className="object-contain p-2 bg-white transition-transform duration-500 ease-out-expo group-hover:scale-[1.04]"
          fallbackClassName="grid h-full w-full place-items-center text-[10px] font-bold uppercase tracking-wide text-white/20"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />

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
            className={`rounded-pill px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              !inStock
                ? "bg-white/10 text-white/50"
                : lowStock
                  ? "bg-brand/20 text-brand ring-1 ring-brand/30"
                  : "bg-accent/20 text-accent ring-1 ring-accent/30"
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
                  className={`h-5 w-5 rounded-full ring-2 ring-ink-950 ${
                    v.available ? "" : "opacity-40 grayscale"
                  }`}
                  style={{ backgroundColor: v.colorHex || "#6b7280" }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[9px] font-bold text-white/60 ring-2 ring-ink-950">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-[2] flex flex-1 flex-col p-4 pointer-events-none">
        {product.brand && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
            {product.brand}
          </p>
        )}
        <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand sm:text-base">
          {product.name}
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-black tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-white/35 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.variants.length > 0 && (
          <p className="mt-2 text-xs text-white/40">
            {product.variants.length} colour
            {product.variants.length === 1 ? "" : "s"} · {totalStock} units
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 pointer-events-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Icon name="edit" className="h-3.5 w-3.5" />
            Tap to edit
          </span>
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[3] inline-flex items-center justify-center rounded-pill border border-white/10 bg-white/[0.03] px-3 py-2 text-white/60 transition-colors hover:border-brand/30 hover:text-brand"
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

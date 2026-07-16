import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-card border border-white/[0.06] bg-ink-850 shadow-card transition-all duration-300 ease-out-expo hover:-translate-y-1.5 hover:border-white/10 hover:shadow-card-hover">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-square bg-ink-900">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 19rem"
            className={`object-cover transition-transform duration-500 ease-out-expo group-hover:scale-[1.07] ${
              soldOut ? "opacity-60 saturate-50" : ""
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off && (
            <span className="rounded-pill bg-accent px-2.5 py-1 text-xs font-bold text-ink-950 shadow-accent-glow">
              -{off}%
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3">
          <StockBadge status={product.stock} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-white/40">
            {product.brand}
          </span>
        )}
        <Link href={`/product/${product.slug}`} className="min-h-[2.5rem]">
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-white/35 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        {product.variants.length > 1 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {product.variants.slice(0, 5).map((v) => (
              <span
                key={v.id}
                title={
                  v.available
                    ? `${v.name} · ${v.quantity} left`
                    : `${v.name} · out of stock`
                }
                className={`h-3.5 w-3.5 rounded-full ring-1 ring-white/25 ${
                  v.available ? "" : "opacity-35 grayscale"
                }`}
                style={{ backgroundColor: v.colorHex || "#6b7280" }}
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-[10px] text-white/35">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="mt-4">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Icon } from "@/components/Icons";

export function ProductCard({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";
  const isDeal = product.hotDeal || Boolean(off);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-ink-900/85 transition-all duration-500 ease-out-expo hover:border-brand/30 hover:bg-ink-850/90 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-square bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_70%)]">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            priority={priority}
            quality={75}
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 33vw, 19rem"
            className={`object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] ${
              soldOut ? "opacity-55 saturate-50" : ""
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
        </div>

        {isDeal ? (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-pill bg-gradient-to-r from-brand to-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-950 shadow-brand-glow">
            <Icon name="bolt" className="h-3 w-3" />
            {off ? `Deal · -${off}%` : "Deal of the week"}
          </span>
        ) : null}

        {soldOut ? (
          <span className="absolute right-3 top-3 rounded-pill bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/70 ring-1 ring-white/15">
            Sold out
          </span>
        ) : product.stock === "low_stock" ? (
          <span className="absolute right-3 top-3 rounded-pill bg-brand/90 px-2.5 py-1 text-[10px] font-bold text-ink-950">
            Low stock
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-medium uppercase tracking-wide text-white/35">
            {product.brand ?? "G-Products"}
          </span>
          {product.stock === "in_stock" ? (
            <span className="shrink-0 text-[11px] font-medium text-accent">
              In stock
            </span>
          ) : null}
        </div>

        <Link href={`/product/${product.slug}`} className="mt-1 min-h-[2.4rem]">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[0.95rem] font-extrabold tracking-tight text-white">
            From {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-white/30 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {product.variants.length > 1 ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.variants.slice(0, 5).map((v, i) => (
              <span
                key={v.id}
                title={
                  v.available
                    ? `${v.name} · ${v.quantity} left`
                    : `${v.name} · out of stock`
                }
                className={`h-3.5 w-3.5 rounded-full ring-1 ring-white/20 ${
                  i === 0 ? "ring-brand ring-offset-1 ring-offset-ink-900" : ""
                } ${v.available ? "" : "opacity-30 grayscale"}`}
                style={{ backgroundColor: v.colorHex || "#6b7280" }}
              />
            ))}
            {product.variants.length > 5 ? (
              <span className="text-[10px] text-white/35">
                +{product.variants.length - 5}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-auto pt-3.5">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}

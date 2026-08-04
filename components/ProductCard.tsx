import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/[0.06] bg-ink-900/80 transition-all duration-500 ease-out-expo hover:border-brand/30 hover:bg-ink-850/90 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]">
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
            className={`object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] ${
              soldOut ? "opacity-55 saturate-50" : ""
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
        </div>

        {off ? (
          <span className="absolute left-3 top-3 rounded-pill bg-accent px-2.5 py-1 text-[11px] font-bold text-ink-950 shadow-accent-glow">
            -{off}%
          </span>
        ) : null}
        <div className="absolute right-3 top-3">
          <StockBadge status={product.stock} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
            {product.brand}
          </span>
        ) : null}
        <Link href={`/product/${product.slug}`} className="min-h-[2.4rem]">
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold tracking-tight text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-white/30 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          ) : null}
        </div>

        {product.variants.length > 1 ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.variants.slice(0, 5).map((v) => (
              <span
                key={v.id}
                title={
                  v.available
                    ? `${v.name} · ${v.quantity} left`
                    : `${v.name} · out of stock`
                }
                className={`h-3.5 w-3.5 rounded-full ring-1 ring-white/20 ${
                  v.available ? "" : "opacity-30 grayscale"
                }`}
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

        <div className="mt-auto pt-4">
          <AddToCartButton product={product} compact requireOptions />
        </div>
      </div>
    </div>
  );
}

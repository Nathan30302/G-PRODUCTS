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
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-ink-950/6 bg-white shadow-[0_4px_24px_rgba(6,24,28,0.06)] transition-all duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(6,24,28,0.14)]">
      <Link
        href={`/product/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <div className="relative aspect-square bg-[#f0f2f3]">
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
        </div>

        {off ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-pill bg-brand px-2.5 py-1 text-[11px] font-bold text-ink-950 shadow-sm">
            DEAL · -{off}%
          </span>
        ) : null}
        <div className="absolute right-3 top-3">
          <StockBadge status={product.stock} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          {product.brand ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-950/35">
              {product.brand}
            </span>
          ) : (
            <span />
          )}
        </div>
        <Link href={`/product/${product.slug}`} className="min-h-[2.4rem]">
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-ink-950 transition-colors group-hover:text-[#b89000]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-extrabold tracking-tight text-ink-950 sm:text-lg">
            From {formatPrice(product.price)}
          </span>
          {product.compareAtPrice ? (
            <span className="text-sm text-ink-950/30 line-through">
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
                className={`h-3.5 w-3.5 rounded-full ring-1 ring-ink-950/15 ${
                  v.available ? "ring-offset-1 ring-offset-white" : "opacity-30 grayscale"
                }`}
                style={{ backgroundColor: v.colorHex || "#6b7280" }}
              />
            ))}
            {product.variants.length > 5 ? (
              <span className="text-[10px] text-ink-950/35">
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

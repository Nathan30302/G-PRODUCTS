import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { AddToCartButton } from "@/components/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-ink-800 bg-ink-850 shadow-card transition-transform hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="relative block">
        <div className="relative aspect-square bg-ink-800">
          <Image
            src={product.images[0]?.url}
            alt={product.images[0]?.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {off && (
          <span className="absolute left-3 top-3 rounded-pill bg-accent px-2.5 py-1 text-xs font-bold text-ink-950">
            -{off}%
          </span>
        )}
        <div className="absolute right-3 top-3">
          <StockBadge status={product.stock} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.brand && (
          <span className="text-xs font-medium uppercase tracking-wide text-white/40">
            {product.brand}
          </span>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white hover:text-brand">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-white">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-white/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 pt-0">
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </div>
  );
}

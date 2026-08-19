import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";

function StockPill({ status }: { status: Product["stock"] }) {
  if (status === "sold_out") {
    return (
      <span className="shrink-0 text-[10px] font-medium text-white/35">
        Out of stock
      </span>
    );
  }
  if (status === "low_stock") {
    return (
      <span className="shrink-0 text-[10px] font-medium text-brand">
        Low stock
      </span>
    );
  }
  return (
    <span className="shrink-0 text-[10px] font-medium text-accent/90">
      In stock
    </span>
  );
}

export function ProductCard({
  product,
  priority = false
}: {
  product: Product;
  priority?: boolean;
}) {
  const soldOut = product.stock === "sold_out";
  const primary =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const coverUrl = coverImageForProduct(product, primary);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block h-full transition-transform duration-200 ease-out active:scale-[0.97] active:opacity-90"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/70">
        <div className="relative aspect-square overflow-hidden bg-ink-850">
          <SafeImage
            src={coverUrl}
            alt={product.name}
            fill
            priority={priority}
            quality={72}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 16rem"
            className={`object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
              soldOut ? "opacity-50 saturate-[0.65]" : ""
            }`}
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 px-2.5 pb-2.5 pt-2">
          <h3 className="line-clamp-2 text-[12px] font-semibold leading-snug text-white sm:text-[13px]">
            {product.name}
          </h3>
          <div className="mt-auto flex items-baseline justify-between gap-2 pt-0.5">
            <span className="text-[13px] font-bold tabular-nums text-white sm:text-sm">
              {formatPrice(product.price)}
            </span>
            <StockPill status={product.stock} />
          </div>
        </div>
      </article>
    </Link>
  );
}

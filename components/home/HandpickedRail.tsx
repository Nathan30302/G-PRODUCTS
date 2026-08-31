"use client";

import Link from "next/link";
import { Product, fromPrice, hasPricedOptions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { coverImageForProduct } from "@/lib/product-images";
import { Icon } from "@/components/Icons";

export function HandpickedRail({ products }: { products: Product[] }) {
  const list = products.filter((p) => p.stock !== "sold_out").slice(0, 12);

  return (
    <section className="container-g mt-12 sm:mt-14">
      <div className="max-w-xl">
        <h2 className="display heading-section">Handpicked For You</h2>
        <p className="text-subtitle mt-2">
          Take what you love at present — you&apos;ll love it even more.
        </p>
      </div>

      <div className="no-scrollbar snap-rail relative mt-6 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
        <Link
          href="/search?deals=1"
          className="snap-item flex w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-brand/40 bg-gradient-to-br from-brand/25 via-brand/10 to-gp-muted shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:w-[10.5rem]"
        >
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
            <span className="text-3xl" aria-hidden>
              🔥
            </span>
            <p className="mt-3 font-display text-lg font-extrabold text-gp-text">
              Hot Deals
            </p>
            <p className="mt-1 text-xs font-medium text-gp-text-muted">
              Save on top picks
            </p>
          </div>
          <span className="flex items-center justify-center gap-1 border-t border-brand/20 py-3 text-xs font-bold text-ink-700">
            Shop deals
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </span>
        </Link>

        {list.map((p) => (
          <HandpickedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function HandpickedCard({ product }: { product: Product }) {
  const variant =
    product.variants.find((v) => v.available) ?? product.variants[0] ?? null;
  const image = coverImageForProduct(product, variant);
  const priced = hasPricedOptions(product);
  const price = priced ? fromPrice(product) : product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="snap-item flex w-[9.5rem] shrink-0 flex-col overflow-hidden rounded-2xl border border-gp-border/80 bg-gp-surface shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:w-[10.5rem]"
    >
      <div className="relative aspect-[4/5] bg-gp-muted">
        {image ? (
          <SafeImage
            src={image}
            alt={product.name}
            fill
            sizes="160px"
            className="object-contain p-3"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-gp-text">
          {product.name}
        </p>
        <p className="mt-auto pt-2 text-sm font-bold tabular-nums text-gp-text">
          {priced ? "From " : ""}
          {formatPrice(price)}
        </p>
      </div>
    </Link>
  );
}

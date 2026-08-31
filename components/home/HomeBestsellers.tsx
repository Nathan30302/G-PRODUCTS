import Link from "next/link";
import type { Product } from "@/lib/types";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { Icon } from "@/components/Icons";

function bestsellerScore(p: Product): number {
  return (
    (p.featured ? 3 : 0) +
    (p.hotDeal ? 2 : 0) +
    (p.compareAtPrice && p.compareAtPrice > p.price ? 1 : 0)
  );
}

/** Horizontal bestsellers row — reference "Our Bestsellers" section. */
export function HomeBestsellers({
  products,
  storeRating = null,
  reviewCount = 0
}: {
  products: Product[];
  storeRating?: number | null;
  reviewCount?: number;
}) {
  const list = products
    .filter((p) => p.stock !== "sold_out")
    .sort((a, b) => bestsellerScore(b) - bestsellerScore(b) || a.name.localeCompare(b.name))
    .slice(0, 12);

  if (list.length === 0) return null;

  const ratingLabel =
    storeRating != null
      ? `${storeRating.toFixed(1)}${reviewCount > 0 ? ` (${reviewCount})` : ""}`
      : null;

  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="flex items-end justify-between gap-3">
        <h2 className="display text-[clamp(1.25rem,0.95rem+1.2vw,1.625rem)] font-extrabold text-gp-text">
          Our bestsellers
        </h2>
        <Link
          href="/search"
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-ink-700 hover:underline"
        >
          View all
          <Icon name="chevron-right" className="h-4 w-4" />
        </Link>
      </div>

      <div className="no-scrollbar snap-rail relative mt-5 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
        {list.map((p) => (
          <HomeProductCard
            key={p.id}
            product={p}
            ratingLabel={ratingLabel}
          />
        ))}
      </div>
    </section>
  );
}

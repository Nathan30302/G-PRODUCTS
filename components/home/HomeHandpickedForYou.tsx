import Link from "next/link";
import type { Product } from "@/lib/types";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { Icon } from "@/components/Icons";
import { sortByDealScore } from "@/lib/product-deals";

/** Curated handpicked rail — separate from chip-filtered deals section. */
export function HomeHandpickedForYou({ products }: { products: Product[] }) {
  const list = sortByDealScore(
    products.filter((p) => p.stock !== "sold_out" && (p.featured || p.hotDeal))
  ).slice(0, 12);

  const fallback = sortByDealScore(
    products.filter((p) => p.stock !== "sold_out")
  ).slice(0, 12);

  const rail = list.length >= 4 ? list : fallback;
  if (rail.length === 0) return null;

  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gp-text-subtle sm:text-[11px]">
            Top picks for you
          </p>
          <h2 className="display mt-2 text-[clamp(1.125rem,0.9rem+1.3vw,1.5rem)] font-bold text-gp-text">
            Handpicked products for you
          </h2>
        </div>
        <Link
          href="/search"
          className="inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-ink-700 hover:underline"
        >
          View more
          <Icon name="chevron-right" className="h-4 w-4" />
        </Link>
      </div>

      <div className="no-scrollbar snap-rail relative mt-5 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
        {rail.map((p) => (
          <HomeProductCard
            key={p.id}
            product={p}
            variant="plug"
            width="wide"
          />
        ))}
      </div>
    </section>
  );
}

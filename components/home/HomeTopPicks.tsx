"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { isProductDeal, sortByDealScore } from "@/lib/product-deals";

type Chip = {
  id: string;
  label: string;
  filter: (p: Product) => boolean;
};

const CHIPS: Chip[] = [
  {
    id: "deals",
    label: "Tech Deals",
    filter: isProductDeal
  },
  {
    id: "phones",
    label: "Phones",
    filter: (p) => p.categorySlug === "phones"
  },
  {
    id: "audio",
    label: "Audio",
    filter: (p) => p.categorySlug === "audio"
  },
  {
    id: "smartwatches",
    label: "Smartwatches",
    filter: (p) => p.categorySlug === "watches"
  }
];

/** Handpicked section — chips, rail, promo pill, featured deals of the week. */
export function HomeTopPicks({
  products,
  storeRating = null,
  reviewCount = 0
}: {
  products: Product[];
  storeRating?: number | null;
  reviewCount?: number;
}) {
  const [chipId, setChipId] = useState("deals");
  const chip = CHIPS.find((c) => c.id === chipId) ?? CHIPS[0];

  const inStock = useMemo(
    () => products.filter((p) => p.stock !== "sold_out"),
    [products]
  );

  const list = useMemo(() => {
    const filtered = inStock.filter(chip.filter);
    const base = filtered.length > 0 ? filtered : inStock;
    return sortByDealScore(base).slice(0, 12);
  }, [inStock, chip]);

  const featuredDeals = useMemo(
    () => sortByDealScore(inStock.filter(isProductDeal)).slice(0, 10),
    [inStock]
  );

  const ratingLabel =
    storeRating != null
      ? `${storeRating.toFixed(2)}${reviewCount > 0 ? ` (${reviewCount})` : ""}`
      : null;

  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gp-text-subtle sm:text-[11px]">
          Handpicked for you
        </p>
        <h2 className="display mx-auto mt-2 max-w-[22ch] text-[clamp(1.125rem,0.9rem+1.3vw,1.5rem)] font-bold leading-snug text-gp-text sm:max-w-none">
          Tech you&apos;ll love at prices you&apos;ll love more
        </h2>
      </div>

      <div className="no-scrollbar mt-5 flex items-center gap-4 overflow-x-auto pb-1 sm:gap-5">
        {CHIPS.map((c) => {
          const active = c.id === chipId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setChipId(c.id)}
              className={`shrink-0 whitespace-nowrap text-sm font-semibold transition-colors ${
                active
                  ? "rounded-pill bg-ink-850 px-4 py-2 text-white shadow-sm"
                  : "px-0 py-2 text-gp-text hover:text-ink-700"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar snap-rail relative mt-4 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-4 sm:px-6">
        {list.map((p) => (
          <HomeProductCard
            key={p.id}
            product={p}
            ratingLabel={ratingLabel}
            showDealBadge={isProductDeal(p)}
            variant="plug"
            width="wide"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <span className="rounded-pill bg-gradient-to-r from-brand to-accent px-5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-950 shadow-sm sm:text-[11px]">
          No promo code needed
        </span>
      </div>

      {featuredDeals.length > 0 ? (
        <>
          <h3 className="mt-8 text-center text-base font-bold text-gp-text sm:text-lg">
            Featured Deals of the Week
          </h3>
          <div className="no-scrollbar snap-rail relative mt-4 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
            {featuredDeals.map((p) => (
              <HomeProductCard
                key={`deal-${p.id}`}
                product={p}
                ratingLabel={ratingLabel}
                showDealBadge
                variant="plug"
                width="wide"
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}

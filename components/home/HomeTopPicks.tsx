"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { catalogGroups } from "@/lib/catalog-taxonomy";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { Icon } from "@/components/Icons";

const CHIP_LABELS: Record<string, string> = {
  "phones-accessories": "Phones",
  "computers-storage": "Computers",
  "audio": "Audio",
  "smart-devices": "Watches",
  "stationery-school": "Stationery",
  "home-electrical": "Home"
};

const TOP_PICK_CHIPS = catalogGroups
  .filter((g) => !g.href)
  .slice(0, 6)
  .map((g) => ({
    id: g.slug,
    label: CHIP_LABELS[g.slug] ?? g.name,
    fullLabel: g.name,
    filter: (p: Product) =>
      g.children.length > 0 ? g.children.includes(p.categorySlug) : false
  }));

function isHotDeal(p: Product): boolean {
  return Boolean(
    p.hotDeal || (p.compareAtPrice && p.compareAtPrice > p.price)
  );
}

/** Hot deals first, then featured, then the rest — stable by name. */
function sortTopPicks(list: Product[]): Product[] {
  return [...list].sort((a, b) => {
    const score = (p: Product) =>
      (p.hotDeal ? 4 : 0) +
      (p.compareAtPrice && p.compareAtPrice > p.price ? 2 : 0) +
      (p.featured ? 1 : 0);
    return score(b) - score(a) || a.name.localeCompare(b.name);
  });
}

/** Top picks row — hot deal badges sit on products, ordered deals-first. */
export function HomeTopPicks({
  products,
  storeRating = null,
  reviewCount = 0
}: {
  products: Product[];
  storeRating?: number | null;
  reviewCount?: number;
}) {
  const [chipId, setChipId] = useState(TOP_PICK_CHIPS[0]?.id ?? "all");
  const chip =
    TOP_PICK_CHIPS.find((c) => c.id === chipId) ?? TOP_PICK_CHIPS[0];

  const inStock = useMemo(
    () => products.filter((p) => p.stock !== "sold_out"),
    [products]
  );

  const list = useMemo(() => {
    const filtered = chip ? inStock.filter(chip.filter) : inStock;
    const base = filtered.length > 0 ? filtered : inStock;
    return sortTopPicks(base).slice(0, 12);
  }, [inStock, chip]);

  const ratingLabel =
    storeRating != null
      ? `${storeRating.toFixed(1)}${reviewCount > 0 ? ` (${reviewCount})` : ""}`
      : null;

  return (
    <section className="container-g mt-10 sm:mt-12">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gp-text-subtle">
          Handpicked G-Products
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h2 className="display text-[clamp(1.25rem,0.95rem+1.2vw,1.625rem)] font-extrabold text-gp-text">
            Top picks for you
          </h2>
          <Link
            href="/search"
            className="hidden shrink-0 items-center gap-0.5 text-sm font-semibold text-ink-700 hover:underline sm:inline-flex"
          >
            View all
            <Icon name="chevron-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {TOP_PICK_CHIPS.map((c) => {
          const active = c.id === chipId;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setChipId(c.id)}
              title={c.fullLabel}
              className={`shrink-0 rounded-pill px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                active
                  ? "bg-ink-900 text-white shadow-sm"
                  : "bg-white text-gp-text hover:bg-gp-muted"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar snap-rail relative mt-5 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
        {list.map((p) => (
          <HomeProductCard
            key={p.id}
            product={p}
            ratingLabel={ratingLabel}
            showHotOnImage={isHotDeal(p)}
          />
        ))}
      </div>
    </section>
  );
}

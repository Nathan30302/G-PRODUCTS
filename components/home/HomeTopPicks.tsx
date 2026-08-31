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
      g.children.length > 0
        ? g.children.includes(p.categorySlug)
        : false
  }));

/** Reference-style top picks row with G-Products category filters. */
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

  const filtered = useMemo(
    () => (chip ? inStock.filter(chip.filter).slice(0, 10) : inStock.slice(0, 10)),
    [inStock, chip]
  );

  const list = filtered.length > 0 ? filtered : inStock.slice(0, 10);

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
        <Link
          href="/search?deals=1"
          className="snap-item flex w-[11rem] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-brand/40 bg-gradient-to-br from-brand/25 via-white to-accent/10 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:w-[12rem]"
        >
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
            <span className="text-3xl" aria-hidden>
              🔥
            </span>
            <p className="mt-3 font-display text-base font-extrabold text-ink-900">
              Hot Deals
            </p>
            <p className="mt-1 text-xs font-medium text-gp-text-muted">
              Save on campus picks
            </p>
          </div>
          <span className="flex items-center justify-center gap-1 border-t border-brand/25 py-3 text-xs font-bold text-ink-700">
            Shop deals
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </span>
        </Link>

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

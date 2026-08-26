"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";

type Sort = "newest" | "price-asc" | "price-desc";

const sortLabels: Record<Sort, string> = {
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low"
};

export function CategoryBrowser({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products]
  );

  const results = useMemo(() => {
    let list = [...products];
    if (inStockOnly) list = list.filter((p) => p.stock !== "sold_out");
    if (maxPrice != null) list = list.filter((p) => p.price <= maxPrice);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, inStockOnly, maxPrice, sort]);

  const reset = () => {
    setInStockOnly(false);
    setMaxPrice(null);
    setSort("newest");
  };

  const hasFilters = inStockOnly || maxPrice != null || sort !== "newest";

  return (
    <>
      <div className="sticky top-[var(--chrome-h)] z-30 -mx-4 mt-6 border-y border-white/[0.06] bg-ink-950/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-[1.25rem] sm:border sm:border-white/[0.07]">
        <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto sm:flex-wrap">
          <span className="mr-1 hidden items-center gap-1.5 text-sm font-semibold text-white/60 sm:flex">
            <Icon name="sliders" className="h-4 w-4" />
            Filter
          </span>

          <button
            onClick={() => setInStockOnly((v) => !v)}
            className={`shrink-0 rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
              inStockOnly
                ? "bg-accent/15 text-accent ring-1 ring-accent/40"
                : "bg-white/[0.04] text-white/70 hover:text-white"
            }`}
          >
            In stock
          </button>

          {priceCeiling > 0 &&
            [0.25, 0.5, 0.75].map((f) => {
              const cap = Math.ceil((priceCeiling * f) / 50) * 50;
              const activeCap = maxPrice === cap;
              return (
                <button
                  key={f}
                  onClick={() => setMaxPrice(activeCap ? null : cap)}
                  className={`shrink-0 rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeCap
                      ? "bg-brand/20 text-brand ring-1 ring-brand/40"
                      : "bg-white/[0.04] text-white/70 hover:text-white"
                  }`}
                >
                  Under K{cap.toLocaleString()}
                </button>
              );
            })}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {hasFilters && (
              <button
                onClick={reset}
                className="text-sm text-white/45 transition-colors hover:text-white"
              >
                Clear
              </button>
            )}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Sort products"
                className="appearance-none rounded-pill border border-white/10 bg-white/[0.04] py-1.5 pl-4 pr-9 text-sm font-medium text-white outline-none transition-colors focus:border-brand/40"
              >
                {(Object.keys(sortLabels) as Sort[]).map((s) => (
                  <option key={s} value={s} className="bg-ink-900">
                    {sortLabels[s]}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-white/45">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-12 text-center shadow-card">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-white/40">
            <Icon name="search" className="h-6 w-6" />
          </span>
          <p className="mt-4 font-semibold text-white">No products match</p>
          <p className="mt-1 text-sm text-white/50">
            Try clearing your filters or browse the whole shop.
          </p>
          <div className="mt-5 flex gap-3">
            {hasFilters && (
              <button onClick={reset} className="btn-ghost px-5 py-2.5">
                Clear filters
              </button>
            )}
            <Link href="/search" className="btn-brand px-5 py-2.5">
              Browse all
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5 product-grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

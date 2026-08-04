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
      <div className="sticky top-14 z-30 -mx-4 mt-6 border-y border-ink-950/6 bg-white/90 px-4 py-3 backdrop-blur-xl sm:top-16 sm:mx-0 sm:rounded-[1.25rem] sm:border sm:border-ink-950/8">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="mr-1 hidden items-center gap-1.5 text-sm font-semibold text-ink-950/50 sm:flex">
            <Icon name="sliders" className="h-4 w-4" />
            Filter
          </span>

          <button
            onClick={() => setInStockOnly((v) => !v)}
            className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
              inStockOnly
                ? "bg-accent/15 text-accent-dark ring-1 ring-accent/40"
                : "bg-ink-950/5 text-ink-950/65 hover:text-ink-950"
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
                  className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeCap
                      ? "bg-brand/25 text-[#9a7800] ring-1 ring-brand/50"
                      : "bg-ink-950/5 text-ink-950/65 hover:text-ink-950"
                  }`}
                >
                  Under K{cap.toLocaleString()}
                </button>
              );
            })}

          <div className="ml-auto flex items-center gap-2">
            {hasFilters && (
              <button
                onClick={reset}
                className="text-sm text-ink-950/40 transition-colors hover:text-ink-950"
              >
                Clear
              </button>
            )}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label="Sort products"
                className="appearance-none rounded-pill border border-ink-950/10 bg-white py-1.5 pl-4 pr-9 text-sm font-medium text-ink-950 outline-none transition-colors focus:border-brand"
              >
                {(Object.keys(sortLabels) as Sort[]).map((s) => (
                  <option key={s} value={s}>
                    {sortLabels[s]}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-950/40"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-950/40">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[1.35rem] border border-ink-950/8 bg-white p-12 text-center shadow-[0_4px_24px_rgba(6,24,28,0.06)]">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-950/5 text-ink-950/35">
            <Icon name="search" className="h-6 w-6" />
          </span>
          <p className="mt-4 font-semibold text-ink-950">No products match</p>
          <p className="mt-1 text-sm text-ink-950/45">
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
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

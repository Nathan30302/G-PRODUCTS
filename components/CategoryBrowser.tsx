"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ShopEmptyState } from "@/components/shop/ui";
import { Icon } from "@/components/Icons";

type Sort = "newest" | "price-asc" | "price-desc";

const sortLabels: Record<Sort, string> = {
  newest: "Newest",
  "price-asc": "Price ↑",
  "price-desc": "Price ↓"
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
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto sm:flex-wrap">
          <span className="mr-1 hidden items-center gap-1.5 text-sm font-semibold text-white/60 sm:flex">
            <Icon name="sliders" className="h-4 w-4" />
            Filter
          </span>

          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`shrink-0 rounded-pill px-3.5 py-2 text-sm font-medium transition-colors ${
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
                  type="button"
                  onClick={() => setMaxPrice(activeCap ? null : cap)}
                  className={`shrink-0 rounded-pill px-3.5 py-2 text-sm font-medium transition-colors ${
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
            {hasFilters ? (
              <button
                type="button"
                onClick={reset}
                className="text-sm text-white/45 transition-colors hover:text-white"
              >
                Clear
              </button>
            ) : null}
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSort(s)}
                className={`shrink-0 rounded-pill px-3.5 py-2 text-sm font-medium transition-colors ${
                  sort === s
                    ? "bg-white/[0.08] text-white ring-1 ring-white/15"
                    : "bg-white/[0.04] text-white/55 hover:text-white"
                }`}
              >
                {sortLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-white/45">
        {results.length} product{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-8">
          <ShopEmptyState
            icon="search"
            title="No products match"
            description="Try clearing your filters or browse the full catalogue."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                {hasFilters ? (
                  <button type="button" onClick={reset} className="btn-ghost px-5 py-2.5">
                    Clear filters
                  </button>
                ) : null}
                <Link href="/search" className="btn-brand px-5 py-2.5">
                  Browse all
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div className="mt-5 product-grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      )}
    </>
  );
}

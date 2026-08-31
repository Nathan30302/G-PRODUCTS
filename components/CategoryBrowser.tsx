"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ShopEmptyState } from "@/components/shop/ui";

type Sort = "newest" | "best-sellers" | "price-asc" | "price-desc";

const sortLabels: Record<Sort, string> = {
  newest: "New Arrivals",
  "best-sellers": "Best Sellers",
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)"
};

function extractColors(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    for (const v of p.variants) {
      const name = v.name.trim();
      if (name && name.length < 24) set.add(name);
    }
  }
  return [...set].slice(0, 12);
}

function extractStorage(products: Product[]): string[] {
  const set = new Set<string>();
  const re = /\b(\d+\s?(?:GB|TB|MB|gb|tb))\b/gi;
  for (const p of products) {
    const blob = [p.name, ...p.variants.map((v) => v.name)].join(" ");
    for (const m of blob.matchAll(re)) set.add(m[1].toUpperCase().replace(/\s/g, ""));
  }
  return [...set].slice(0, 8);
}

function extractSeries(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    if (p.brand?.trim()) set.add(p.brand.trim());
  }
  return [...set].slice(0, 10);
}

export function CategoryBrowser({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);
  const [series, setSeries] = useState<string | null>(null);

  const colors = useMemo(() => extractColors(products), [products]);
  const storages = useMemo(() => extractStorage(products), [products]);
  const seriesList = useMemo(() => extractSeries(products), [products]);

  const results = useMemo(() => {
    let list = [...products];
    if (inStockOnly) list = list.filter((p) => p.stock !== "sold_out");
    if (color) {
      list = list.filter((p) =>
        p.variants.some((v) => v.name.toLowerCase() === color.toLowerCase())
      );
    }
    if (storage) {
      const s = storage.toLowerCase();
      list = list.filter((p) => {
        const blob = [p.name, ...p.variants.map((v) => v.name)]
          .join(" ")
          .toLowerCase();
        return blob.includes(s.toLowerCase());
      });
    }
    if (series) {
      list = list.filter(
        (p) => (p.brand ?? "").toLowerCase() === series.toLowerCase()
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "best-sellers") {
      list.sort((a, b) => {
        const score = (p: Product) =>
          (p.featured ? 2 : 0) + (p.hotDeal ? 1 : 0);
        return score(b) - score(a) || a.name.localeCompare(b.name);
      });
    }
    return list;
  }, [products, inStockOnly, color, storage, series, sort]);

  const reset = () => {
    setInStockOnly(false);
    setColor(null);
    setStorage(null);
    setSeries(null);
    setSort("newest");
  };

  const hasFilters =
    inStockOnly || color || storage || series || sort !== "newest";

  const chip = (active: boolean) =>
    active
      ? "bg-ink-700 text-white shadow-sm"
      : "border border-gp-border bg-gp-muted text-gp-text-muted hover:border-ink-700/25 hover:text-gp-text";

  return (
    <>
      <div className="gp-card sticky top-[var(--chrome-h)] z-30 mt-6 !p-4 sm:!p-5">
        <p className="section-label mb-3">Sort &amp; filter</p>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-caption mr-1">Sort</span>
          {(Object.keys(sortLabels) as Sort[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${chip(sort === s)}`}
            >
              {sortLabels[s]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-caption mr-1">Filter</span>
          <button
            type="button"
            onClick={() => setInStockOnly((v) => !v)}
            className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${chip(inStockOnly)}`}
          >
            In stock
          </button>
        </div>

        {colors.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-caption w-full sm:w-auto">Color</span>
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(color === c ? null : c)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${chip(color === c)}`}
              >
                {c}
              </button>
            ))}
          </div>
        ) : null}

        {storages.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-caption w-full sm:w-auto">Storage</span>
            {storages.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStorage(storage === s ? null : s)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${chip(storage === s)}`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        {seriesList.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-caption w-full sm:w-auto">Series</span>
            {seriesList.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeries(series === s ? null : s)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${chip(series === s)}`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : null}

        {hasFilters ? (
          <button
            type="button"
            onClick={reset}
            className="mt-4 text-xs font-semibold text-ink-700 hover:underline"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      <p className="mt-5 text-sm text-gp-text-muted">
        <span className="font-semibold tabular-nums text-gp-text">
          {results.length}
        </span>{" "}
        product{results.length === 1 ? "" : "s"}
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

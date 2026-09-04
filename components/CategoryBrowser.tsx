"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { CategoryPageHeader } from "@/components/category/CategoryPageHeader";
import { CategoryProductCard } from "@/components/category/CategoryProductCard";
import { ShopEmptyState } from "@/components/shop/ui";
import { Icon } from "@/components/Icons";
import type { ReviewSummary } from "@/lib/reviews";

type Sort = "newest" | "best-sellers" | "price-asc" | "price-desc";

const sortLabels: Record<Sort, string> = {
  newest: "New Arrivals",
  "best-sellers": "Best Sellers",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low"
};

function extractColors(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    for (const v of p.variants) {
      if (v.colorHex) {
        const name = v.name.trim();
        if (name && name.length < 24) set.add(name);
      }
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

function FilterPill({
  label,
  displayValue,
  active,
  open,
  onToggle,
  children
}: {
  label: string;
  displayValue?: string | null;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
          active
            ? "border-ink-700/30 bg-ink-700/5 text-gp-text"
            : "border-gp-border bg-white text-gp-text hover:border-gp-text-subtle"
        }`}
      >
        <span className="max-w-[8rem] truncate">{displayValue ?? label}</span>
        <Icon
          name="chevron-down"
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && children ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            aria-label="Close menu"
            onClick={onToggle}
          />
          <div className="absolute left-0 top-[calc(100%+0.35rem)] z-50 max-h-56 min-w-[11rem] overflow-y-auto rounded-xl border border-gp-border bg-white py-1 shadow-[0_12px_40px_rgba(26,35,33,0.12)]">
            {children}
          </div>
        </>
      ) : null}
    </div>
  );
}

function FilterOption({
  label,
  selected,
  onSelect
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm transition-colors ${
        selected
          ? "bg-ink-700/5 font-semibold text-gp-text"
          : "text-gp-text-muted hover:bg-gp-muted hover:text-gp-text"
      }`}
    >
      {label}
      {selected ? <Icon name="check" className="h-4 w-4 shrink-0 text-accent-ink" /> : null}
    </button>
  );
}

export function CategoryBrowser({
  categoryName,
  products,
  reviewSummaries = {}
}: {
  categoryName: string;
  products: Product[];
  reviewSummaries?: Record<string, ReviewSummary>;
}) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [color, setColor] = useState<string | null>(null);
  const [storage, setStorage] = useState<string | null>(null);
  const [series, setSeries] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState<
    null | "sort" | "color" | "storage" | "series" | "panel"
  >(null);

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
      list = list.filter((p) => {
        const blob = [p.name, ...p.variants.map((v) => v.name)]
          .join(" ")
          .toLowerCase();
        return blob.includes(storage.toLowerCase());
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
    setOpenFilter(null);
  };

  const hasFilters =
    inStockOnly || color || storage || series || sort !== "newest";

  function toggleFilter(key: typeof openFilter) {
    setOpenFilter((cur) => (cur === key ? null : key));
  }

  function scrollToFilters() {
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    setOpenFilter("panel");
  }

  return (
    <div className="min-h-[50vh] bg-white pb-4">
      <CategoryPageHeader
        title={categoryName}
        onFilterClick={scrollToFilters}
      />

      <div
        ref={filterRef}
        className="border-b border-gp-border/80 bg-white px-4 py-3"
      >
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          <FilterPill
            label="Sort"
            displayValue={sort === "newest" ? "Sort" : sortLabels[sort]}
            active={sort !== "newest"}
            open={openFilter === "sort"}
            onToggle={() => toggleFilter("sort")}
          >
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <FilterOption
                key={s}
                label={sortLabels[s]}
                selected={sort === s}
                onSelect={() => {
                  setSort(s);
                  setOpenFilter(null);
                }}
              />
            ))}
          </FilterPill>

          {colors.length > 0 ? (
            <FilterPill
              label="Color"
              displayValue={color ?? "Color"}
              active={Boolean(color)}
              open={openFilter === "color"}
              onToggle={() => toggleFilter("color")}
            >
              <FilterOption
                label="All colors"
                selected={!color}
                onSelect={() => {
                  setColor(null);
                  setOpenFilter(null);
                }}
              />
              {colors.map((c) => (
                <FilterOption
                  key={c}
                  label={c}
                  selected={color === c}
                  onSelect={() => {
                    setColor(c);
                    setOpenFilter(null);
                  }}
                />
              ))}
            </FilterPill>
          ) : null}

          {storages.length > 0 ? (
            <FilterPill
              label="Storage Size"
              displayValue={storage ?? "Storage Size"}
              active={Boolean(storage)}
              open={openFilter === "storage"}
              onToggle={() => toggleFilter("storage")}
            >
              <FilterOption
                label="All sizes"
                selected={!storage}
                onSelect={() => {
                  setStorage(null);
                  setOpenFilter(null);
                }}
              />
              {storages.map((s) => (
                <FilterOption
                  key={s}
                  label={s}
                  selected={storage === s}
                  onSelect={() => {
                    setStorage(s);
                    setOpenFilter(null);
                  }}
                />
              ))}
            </FilterPill>
          ) : null}

          {seriesList.length > 0 ? (
            <FilterPill
              label="Series"
              displayValue={series ?? "Series"}
              active={Boolean(series)}
              open={openFilter === "series"}
              onToggle={() => toggleFilter("series")}
            >
              <FilterOption
                label="All brands"
                selected={!series}
                onSelect={() => {
                  setSeries(null);
                  setOpenFilter(null);
                }}
              />
              {seriesList.map((s) => (
                <FilterOption
                  key={s}
                  label={s}
                  selected={series === s}
                  onSelect={() => {
                    setSeries(s);
                    setOpenFilter(null);
                  }}
                />
              ))}
            </FilterPill>
          ) : null}
        </div>

        {openFilter === "panel" || hasFilters ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gp-border/60 pt-3">
            <button
              type="button"
              onClick={() => setInStockOnly((v) => !v)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                inStockOnly
                  ? "border-ink-700/30 bg-ink-700/5 text-gp-text"
                  : "border-gp-border text-gp-text-muted"
              }`}
            >
              In stock only
            </button>
            {hasFilters ? (
              <button
                type="button"
                onClick={reset}
                className="text-xs font-semibold text-ink-700 hover:underline"
              >
                Clear all
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="px-4 pt-4">
        {results.length === 0 ? (
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
        ) : (
          <div className="category-plug-grid">
            {results.map((p, i) => (
              <CategoryProductCard
                key={p.id}
                product={p}
                review={reviewSummaries[p.slug]}
                priority={i < 4}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";
import { ShopEmptyState } from "@/components/shop/ui";
import { filterCatalog, type SortMode, type StockFilter } from "@/lib/search";

type TrendChip = {
  label: string;
  query?: string;
  category?: string;
  href?: string;
};

const trending: TrendChip[] = [
  { label: "Exercise Book", query: "exercise" },
  { label: "Memory Card", query: "memory", category: "storage" },
  { label: "F9-5", query: "f9-5", category: "audio" },
  { label: "Extension", query: "extension", category: "chargers" },
  { label: "Union lock", query: "union lock", category: "locks" },
  { label: "Oraimo", query: "oraimo", category: "chargers" },
  { label: "Mouse", query: "mouse", category: "computers" },
  { label: "Printing", href: "/services/printing" }
];

export function SearchClient({
  products,
  categories
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);
  const [cat, setCat] = useState<string>("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortMode>("match");

  const results = useMemo(
    () =>
      filterCatalog(products, {
        query: deferredQuery,
        category: cat,
        stock,
        sort
      }),
    [deferredQuery, cat, stock, sort, products]
  );

  function applyTrend(chip: TrendChip) {
    if (chip.href) {
      router.push(chip.href);
      return;
    }
    const q = chip.query ?? chip.label;
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", q);
    router.push(`/search?${params.toString()}`);
    if (chip.category) setCat(chip.category);
    else setCat("all");
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const next = params.toString();
    router.push(next ? `/search?${next}` : "/search");
    setCat("all");
    setStock("all");
    setSort("match");
  }

  const grouped = useMemo(() => {
    if (deferredQuery.trim() || cat !== "all") return null;
    const map = new Map<string, Product[]>();
    for (const c of categories) map.set(c.slug, []);
    for (const p of results) {
      const list = map.get(p.categorySlug);
      if (list) list.push(p);
    }
    return categories
      .map((c) => ({ category: c, items: map.get(c.slug) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [deferredQuery, cat, results, categories]);

  const showGrouped = grouped && grouped.length > 0;
  const searching =
    deferredQuery.trim().length > 0 || cat !== "all" || stock !== "all";

  return (
    <div className="relative pb-10">
      <div className="container-g relative pt-4 sm:pt-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="display text-xl font-extrabold text-gp-text sm:text-2xl">
              Shop
            </h1>
            <p className="mt-1 text-sm text-gp-text-muted">
              {products.length} products
              {deferredQuery.trim() ? (
                <>
                  {" "}
                  · {results.length} match
                  {results.length === 1 ? "" : "es"}
                </>
              ) : null}
            </p>
          </div>
        </header>

        {!query ? (
          <div className="mt-5">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gp-text-subtle">
              <Icon name="spark" className="h-3.5 w-3.5 text-brand" />
              Popular right now
            </p>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTrend(t)}
                  className="rounded-pill border border-gp-border bg-gp-bg px-3.5 py-2 text-sm font-medium text-gp-text transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-[1.35rem] border border-gp-border bg-gp-bg p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gp-text-subtle">
              Stock
            </span>
            {(
              [
                ["all", "All"],
                ["in_stock", "In stock"],
                ["sold_out", "Sold out"]
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStock(id)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${
                  stock === id
                    ? "bg-white text-ink-950"
                    : "bg-gp-bg text-gp-text-muted hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/10 sm:inline" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-gp-text-subtle">
              Sort
            </span>
            {(
              [
                ["match", "Best match"],
                ["price-asc", "Price ↑"],
                ["price-desc", "Price ↓"]
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSort(id)}
                className={`rounded-pill px-3 py-1.5 text-xs font-semibold transition-all ${
                  sort === id
                    ? "bg-accent text-white"
                    : "bg-gp-bg text-gp-text-muted hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3.5 py-2 text-sm font-semibold transition-all ${
                cat === "all"
                  ? "bg-accent text-white"
                  : "border border-gp-border bg-gp-surface text-gp-text-muted hover:border-accent/30 hover:text-white"
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCat(c.slug)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-pill px-3.5 py-2 text-sm font-semibold transition-all ${
                  cat === c.slug
                    ? "bg-accent text-white"
                    : "border border-gp-border bg-gp-surface text-gp-text-muted hover:border-accent/30 hover:text-white"
                }`}
              >
                <Icon
                  name={c.icon}
                  className={`h-3.5 w-3.5 ${
                    cat === c.slug ? "text-ink-950/70" : "text-accent"
                  }`}
                />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-gp-text-muted">
              <span className="font-semibold tabular-nums text-gp-text">
                {results.length}
              </span>{" "}
              result{results.length === 1 ? "" : "s"}
              {deferredQuery.trim() ? (
                <>
                  {" "}
                  for{" "}
                  <span className="text-brand">
                    &ldquo;{deferredQuery.trim()}&rdquo;
                  </span>
                </>
              ) : null}
              {cat !== "all" ? (
                <>
                  {" "}
                  in{" "}
                  <span className="text-gp-text">
                    {categories.find((c) => c.slug === cat)?.name ?? cat}
                  </span>
                </>
              ) : null}
            </p>
            {searching ? (
              <p className="mt-1 text-xs text-gp-text-subtle">
                Use the search bar above to change your query
              </p>
            ) : null}
          </div>
          {searching ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-gp-text-subtle transition-colors hover:text-accent"
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {results.length === 0 ? (
          <div className="mt-8">
            <ShopEmptyState
              icon="search"
              title="Nothing matched"
              description="Try a shorter word, a brand name, or pick a category above."
              action={
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn-brand"
                >
                  Reset search
                  <Icon name="refresh" className="h-4 w-4" />
                </button>
              }
            />
          </div>
        ) : showGrouped ? (
          <div className="mt-6 space-y-12">
            {grouped!.map(({ category, items }) => (
              <section key={category.slug}>
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                      <Icon name={category.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="display text-xl">{category.name}</h2>
                      <p className="mt-0.5 text-sm text-gp-text-muted">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/category/${category.slug}`}
                    className="shrink-0 text-sm font-semibold text-accent hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="product-grid">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} compact />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-5 product-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

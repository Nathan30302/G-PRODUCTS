"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";
import { ShopEmptyState } from "@/components/shop/ui";
import { filterCatalog, type SortMode, type StockFilter } from "@/lib/search";
import { pushRecentSearch } from "@/lib/recent-searches";
import { formatPrice } from "@/lib/format";
import { coverImageForProduct } from "@/lib/product-images";
import { SafeImage } from "@/components/SafeImage";

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
  categories,
  initialQuery = ""
}: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [cat, setCat] = useState<string>("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortMode>("match");
  const [focused, setFocused] = useState(false);

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

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return products
      .filter((p) =>
        [p.name, p.brand ?? "", p.categorySlug]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  const showSuggest =
    focused && query.trim().length > 0 && suggestions.length > 0;

  function applyTrend(chip: TrendChip) {
    if (chip.href) {
      router.push(chip.href);
      return;
    }
    setQuery(chip.query ?? chip.label);
    if (chip.category) setCat(chip.category);
    else setCat("all");
    inputRef.current?.focus();
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
  const searching = deferredQuery.trim().length > 0 || cat !== "all";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative pb-10">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22rem] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(246,212,0,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_90%_20%,rgba(34,197,94,0.06),transparent_50%)]" />
      </div>

      <div className="container-g relative pt-8 sm:pt-10">
        <header className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand/90">
            Catalogue
          </p>
          <h1 className="display heading-page mt-1.5">Shop</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Search {products.length} products — stationery, chargers, audio and
            more.
            <span className="hidden sm:inline">
              {" "}
              Press{" "}
              <kbd className="rounded-md border border-white/15 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-white/60">
                /
              </kbd>{" "}
              to jump here anytime.
            </span>
          </p>
        </header>

        {/* Search stage */}
        <div className="relative z-20 mt-7">
          <div
            className={`relative overflow-hidden rounded-[1.5rem] border bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-1.5 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.7)] transition-all duration-300 ${
              focused
                ? "border-brand/45 shadow-brand-glow ring-1 ring-brand/20"
                : "border-white/[0.08]"
            }`}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
            <div className="relative flex items-center gap-2 rounded-[1.15rem] bg-ink-950/50 px-3 sm:px-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <Icon name="search" className="h-5 w-5" />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => {
                  // delay so suggestion click registers
                  window.setTimeout(() => {
                    setFocused(false);
                    const trimmed = query.trim();
                    if (trimmed.length >= 2) pushRecentSearch(trimmed);
                  }, 160);
                }}
                autoFocus={!initialQuery}
                placeholder="Search — f9-5, 5m extension, union lock…"
                className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-white outline-none placeholder:text-white/35 sm:text-base"
                aria-label="Search products"
                autoComplete="off"
                spellCheck={false}
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/55 transition-colors hover:border-brand/35 hover:text-brand"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              ) : (
                <span className="hidden shrink-0 rounded-pill border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/30 sm:inline">
                  Live
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showSuggest ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-ink-900/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl"
              >
                <p className="border-b border-white/[0.06] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
                  Quick matches
                </p>
                <ul>
                  {suggestions.map((p) => {
                    const thumb = coverImageForProduct(
                      p,
                      p.variants.find((v) => v.available) ??
                        p.variants[0] ??
                        null
                    );
                    return (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
                        >
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f2]">
                            <SafeImage
                              src={thumb}
                              alt=""
                              fill
                              sizes="44px"
                              className="object-contain p-1"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-white">
                              {p.name}
                            </span>
                            <span className="block text-xs text-white/40">
                              {formatPrice(p.price)}
                            </span>
                          </span>
                          <Icon
                            name="chevron-right"
                            className="h-4 w-4 shrink-0 text-white/25"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Trending */}
        {!query && (
          <div className="mt-5">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
              <Icon name="spark" className="h-3.5 w-3.5 text-brand" />
              Popular right now
            </p>
            <div className="flex flex-wrap gap-2">
              {trending.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => applyTrend(t)}
                  className="rounded-pill border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-white/70 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-brand/40 hover:bg-brand/10 hover:text-brand"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters panel */}
        <div className="mt-6 rounded-[1.35rem] border border-white/[0.07] bg-white/[0.02] p-3 sm:p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/30">
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
                    : "bg-white/[0.04] text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/10 sm:inline" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/30">
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
                    ? "bg-brand text-ink-950 shadow-brand-glow"
                    : "bg-white/[0.04] text-white/50 hover:text-white/80"
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
                  ? "bg-brand text-ink-950 shadow-brand-glow"
                  : "border border-white/10 bg-ink-950/40 text-white/65 hover:border-brand/30 hover:text-white"
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
                    ? "bg-brand text-ink-950 shadow-brand-glow"
                    : "border border-white/10 bg-ink-950/40 text-white/65 hover:border-brand/30 hover:text-white"
                }`}
              >
                <Icon
                  name={c.icon}
                  className={`h-3.5 w-3.5 ${
                    cat === c.slug ? "text-ink-950/70" : "text-brand/80"
                  }`}
                />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results meta */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-white/45">
              <span className="font-semibold tabular-nums text-white">
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
                  <span className="text-white/70">
                    {categories.find((c) => c.slug === cat)?.name ?? cat}
                  </span>
                </>
              ) : null}
            </p>
            {searching ? (
              <p className="mt-1 text-xs text-white/30">
                Tap a product to open it
              </p>
            ) : null}
          </div>
          {searching ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCat("all");
                setStock("all");
                setSort("match");
              }}
              className="text-xs font-semibold text-white/40 transition-colors hover:text-brand"
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
                  onClick={() => {
                    setQuery("");
                    setCat("all");
                    inputRef.current?.focus();
                  }}
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
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
                      <Icon name={category.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="display text-xl">{category.name}</h2>
                      <p className="mt-0.5 text-sm text-white/45">
                        {category.tagline}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/category/${category.slug}`}
                    className="shrink-0 text-sm font-semibold text-brand hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="product-grid">
                  {items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-5 product-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

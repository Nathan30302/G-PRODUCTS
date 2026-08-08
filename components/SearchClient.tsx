"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";

const trending = [
  "Exercise Book",
  "Memory Card",
  "AirPods",
  "Oraimo",
  "Mouse",
  "Printing"
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
  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState<string>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat = cat === "all" || p.categorySlug === cat;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.brand?.toLowerCase().includes(q) ?? false) ||
        (p.shortSpecs ?? []).some((s) => s.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [query, cat, products]);

  return (
    <div className="container-g py-8 sm:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
        Catalogue
      </p>
      <h1 className="mt-1.5 text-3xl font-black tracking-tight text-white sm:text-4xl">
        Shop
      </h1>
      <p className="mt-2 text-sm text-white/50">
        Find genuine products across {products.length} items.
      </p>

      <div className="relative mt-7">
        <Icon
          name="search"
          className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search stationery, chargers, AirPods…"
          className="w-full rounded-pill border border-white/10 bg-ink-900/70 py-4 pr-12 text-white shadow-card outline-none transition-colors focus:border-brand/50"
          style={{ paddingLeft: "3.25rem" }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white/[0.06] text-white/60 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {!query && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-sm text-white/40">
            <Icon name="spark" className="h-4 w-4 text-brand" />
            Trending:
          </span>
          {trending.map((t) => (
            <button
              key={t}
              onClick={() => setQuery(t)}
              className="rounded-pill border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/70 transition-colors hover:border-brand/40 hover:text-white"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCat("all")}
          className={`shrink-0 rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
            cat === "all"
              ? "bg-brand text-ink-950"
              : "bg-white/[0.04] text-white/70 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`shrink-0 rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === c.slug
                ? "bg-brand text-ink-950"
                : "bg-white/[0.04] text-white/70 hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-white/45">
        {results.length} result{results.length === 1 ? "" : "s"}
        {query && (
          <>
            {" "}
            for <span className="text-white/70">&ldquo;{query}&rdquo;</span>
          </>
        )}
      </p>

      {results.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-12 text-center shadow-card">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-white/40">
            <Icon name="search" className="h-6 w-6" />
          </span>
          <p className="mt-4 font-semibold text-white">Nothing found</p>
          <p className="mt-1 text-sm text-white/50">
            Try another search or browse the shop.
          </p>
          <Link href="/" className="btn-brand mt-5 px-5 py-2.5">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

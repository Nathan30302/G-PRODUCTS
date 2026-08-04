"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { CategoryShowcase } from "@/components/CategoryShowcase";
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
        p.shortSpecs.some((s) => s.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [query, cat, products]);

  const browsing = !query.trim() && cat === "all";

  return (
    <div className="container-g py-6 sm:py-10">
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-950/35"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="What are you looking for?"
          className="w-full rounded-pill border border-ink-950/12 bg-white py-3.5 pr-12 text-ink-950 shadow-[0_4px_20px_rgba(6,24,28,0.04)] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(246,212,0,0.18)]"
          style={{ paddingLeft: "2.85rem" }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-ink-950/5 text-ink-950/50 transition-colors hover:text-ink-950"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>

      {browsing ? (
        <div className="mt-6">
          <CategoryShowcase categories={categories} />
        </div>
      ) : (
        <>
          {!query && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-ink-950/40">
                <Icon name="spark" className="h-4 w-4 text-[#b89000]" />
                Trending:
              </span>
              {trending.map((t) => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  className="rounded-pill border border-ink-950/10 bg-white px-3.5 py-1.5 text-sm text-ink-950/65 transition-colors hover:border-brand hover:text-ink-950"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCat("all")}
              className={`shrink-0 rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
                cat === "all"
                  ? "bg-ink-950 text-white"
                  : "bg-white text-ink-950/60 ring-1 ring-ink-950/10 hover:text-ink-950"
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
                    ? "bg-ink-950 text-white"
                    : "bg-white text-ink-950/60 ring-1 ring-ink-950/10 hover:text-ink-950"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm text-ink-950/40">
            {results.length} result{results.length === 1 ? "" : "s"}
            {query && (
              <>
                {" "}
                for{" "}
                <span className="text-ink-950/70">&ldquo;{query}&rdquo;</span>
              </>
            )}
          </p>

          {results.length === 0 ? (
            <div className="mt-8 flex flex-col items-center rounded-[1.35rem] border border-ink-950/8 bg-white p-12 text-center shadow-[0_4px_24px_rgba(6,24,28,0.06)]">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-950/5 text-ink-950/35">
                <Icon name="search" className="h-6 w-6" />
              </span>
              <p className="mt-4 font-semibold text-ink-950">Nothing found</p>
              <p className="mt-1 text-sm text-ink-950/45">
                Try another search or browse the shop.
              </p>
              <Link href="/" className="btn-brand mt-5 px-5 py-2.5">
                Browse the shop
              </Link>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

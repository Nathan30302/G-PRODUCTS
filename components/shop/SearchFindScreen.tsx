"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Icon } from "@/components/Icons";
import { HomeProductCard } from "@/components/home/HomeProductCard";
import { pushRecentSearch, getRecentSearches } from "@/lib/recent-searches";
import { getRecentProductSlugs } from "@/lib/recent-products";
import { isProductDeal } from "@/lib/product-deals";

const QUICK_SEARCHES = [
  { label: "Chargers", query: "charger" },
  { label: "AirPods", query: "airpod" },
  { label: "Phone cases", query: "case" },
  { label: "Memory cards", query: "memory" },
  { label: "Samsung phones", query: "samsung" },
  { label: "Smartwatches", query: "watch" },
  { label: "Exercise books", query: "exercise" },
  { label: "Flash drives", query: "flash" }
] as const;

/** Dedicated search screen — back header, input, chips, recently viewed. */
export function SearchFindScreen({ products }: { products: Product[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);

  useEffect(() => {
    inputRef.current?.focus();
    setRecentSlugs(getRecentProductSlugs());
    setRecentQueries(getRecentSearches());
  }, []);

  const productsBySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products]
  );

  const recentlyViewed = useMemo(
    () =>
      recentSlugs
        .map((slug) => productsBySlug.get(slug))
        .filter((p): p is Product => Boolean(p && p.stock !== "sold_out"))
        .slice(0, 10),
    [recentSlugs, productsBySlug]
  );

  function goSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    pushRecentSearch(trimmed);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    goSearch(query);
  }

  return (
    <div className="shop-find-screen">
      <header className="shop-find-header">
        <Link
          href="/search"
          aria-label="Back to shop"
          className="grid h-10 w-10 place-items-center rounded-xl text-gp-text transition-colors hover:bg-gp-muted"
        >
          <Icon name="chevron-left" className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-base font-bold text-gp-text">
          Search
        </h1>
        <span className="h-10 w-10" aria-hidden />
      </header>

      <div className="shop-find-body">
        <form onSubmit={onSubmit} className="shop-find-search">
          <Icon name="search" className="h-5 w-5 shrink-0 text-gp-text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
            className="min-w-0 flex-1 bg-transparent text-base text-gp-text outline-none placeholder:text-gp-text-subtle"
            aria-label="Search for products"
            enterKeyHint="search"
            autoComplete="off"
          />
        </form>

        {recentQueries.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-bold text-gp-text">Recent searches</p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
              {recentQueries.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => goSearch(term)}
                  className="shop-find-chip shrink-0"
                >
                  {term}
                  <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-[-45deg] opacity-70" />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <p className="text-sm font-bold text-gp-text">Popular searches</p>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-0.5">
            {QUICK_SEARCHES.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => goSearch(chip.query)}
                className="shop-find-chip shrink-0"
              >
                {chip.label}
                <Icon name="arrow-right" className="h-3.5 w-3.5 rotate-[-45deg] opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {recentlyViewed.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-base font-bold text-gp-text">Recently Viewed</h2>
            <div className="no-scrollbar snap-rail relative mt-4 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
              {recentlyViewed.map((p) => (
                <HomeProductCard
                  key={p.id}
                  product={p}
                  showDealBadge={isProductDeal(p)}
                  variant="plug"
                  width="wide"
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

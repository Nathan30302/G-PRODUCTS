"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { getRecentSearches, pushRecentSearch } from "@/lib/recent-searches";

const quickSearches = ["Charger", "Pouch", "Calculator", "Earphones"];

/** Primary discovery entry — placed directly under the hero. */
export function HomeSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  function go(term: string) {
    const trimmed = term.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }
    pushRecentSearch(trimmed);
    setRecent(getRecentSearches());
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    go(q);
  }

  return (
    <section className="container-g -mt-1 sm:mt-0" aria-label="Product search">
      <div className="rounded-[1.75rem] border border-brand/20 bg-ink-900/55 p-4 ring-1 ring-brand/10 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand/85">
              Start here
            </p>
            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
              What are you looking for?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => router.push("/search")}
            className="text-xs font-semibold text-white/45 transition-colors hover:text-brand"
          >
            View all products →
          </button>
        </div>
        <form
          onSubmit={submit}
          className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-950/80 p-1.5 focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/15"
        >
          <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-brand" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try charger, earphones, exercise book…"
            className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-white outline-none placeholder:text-white/35"
            aria-label="Search products"
            enterKeyHint="search"
            autoComplete="off"
          />
          <button type="submit" className="btn-brand shrink-0 px-5 py-3 text-sm">
            Search
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {recent.length > 0 ? (
            <>
              <span className="w-full text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
                Recent searches
              </span>
              {recent.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => go(term)}
                  className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-brand/30 hover:text-brand"
                >
                  {term}
                </button>
              ))}
            </>
          ) : (
            <span className="w-full text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
              Popular searches
            </span>
          )}
          {quickSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => go(term)}
              className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-brand/30 hover:text-brand"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

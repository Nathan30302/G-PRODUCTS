"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";

const quickSearches = ["Charger", "Pouch", "Calculator", "Earphones"];

/** Primary discovery entry — placed directly under the hero. */
export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"
    );
  }

  function quick(term: string) {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  }

  return (
    <section className="container-g -mt-2 sm:mt-0">
      <div className="rounded-[1.75rem] border border-white/[0.08] bg-ink-900/45 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
          Find products
        </p>
        <form
          onSubmit={submit}
          className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-950/60 p-1.5 focus-within:border-brand/45 focus-within:ring-2 focus-within:ring-brand/10"
        >
          <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-brand" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search phones, chargers, stationery…"
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
          {quickSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => quick(term)}
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

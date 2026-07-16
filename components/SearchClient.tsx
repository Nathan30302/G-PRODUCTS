"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const trending = ["iPhone", "Power Bank", "Type-C", "Headphones", "SSD", "Speaker"];

export function SearchClient({
  products,
  categories
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
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

  return (
    <div className="container-g py-10">
      <h1 className="text-3xl font-black text-white">Search</h1>

      <div className="mt-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Search chargers, phones, power banks..."
          className="w-full rounded-pill border border-ink-700 bg-ink-900 px-6 py-4 text-white outline-none focus:border-brand"
        />
      </div>

      {!query && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-white/40">Trending:</span>
          {trending.map((t) => (
            <button
              key={t}
              onClick={() => setQuery(t)}
              className="rounded-pill bg-ink-800 px-3 py-1 text-sm text-white/70 hover:text-white"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
            cat === "all"
              ? "bg-brand text-ink-950"
              : "bg-ink-800 text-white/70 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium ${
              cat === c.slug
                ? "bg-brand text-ink-950"
                : "bg-ink-800 text-white/70 hover:text-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-white/40">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-card border border-ink-800 bg-ink-850 p-10 text-center text-white/50">
          Nothing found. Try another search or{" "}
          <Link href="/" className="text-brand hover:underline">
            browse the shop
          </Link>
          .
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

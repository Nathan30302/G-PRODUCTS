"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icons";
import { pushRecentSearch } from "@/lib/recent-searches";

const QUICK_SEARCHES = [
  { label: "AirPods", query: "airpod" },
  { label: "Chargers", query: "charger", href: "/category/chargers" },
  { label: "Printing services", href: "/services/printing" },
  { label: "Memory cards", query: "memory", href: "/category/storage" },
  { label: "Phone cases", query: "case", href: "/category/phone-accessories" },
  { label: "Exercise books", query: "exercise", href: "/category/stationery" }
];

export function HomeSearchSection() {
  const router = useRouter();

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const trimmed = String(fd.get("q") ?? "").trim();
    if (trimmed) pushRecentSearch(trimmed);
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search"
    );
  }

  function go(chip: (typeof QUICK_SEARCHES)[number]) {
    if (chip.href) {
      router.push(chip.href);
      return;
    }
    const q = chip.query ?? chip.label;
    pushRecentSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="container-g pt-5 pb-2 sm:pt-6">
      <form
        onSubmit={submit}
        className="flex items-center gap-3 rounded-2xl border border-gp-border bg-gp-surface px-4 py-3.5 shadow-card transition-all focus-within:border-ink-700/30 focus-within:shadow-float"
      >
        <Icon name="search" className="h-5 w-5 shrink-0 text-gp-text-subtle" />
        <input
          name="q"
          placeholder="What are you looking for?"
          className="min-w-0 flex-1 bg-transparent text-base text-gp-text outline-none placeholder:text-gp-text-subtle"
          aria-label="Search products"
          autoComplete="off"
        />
      </form>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {QUICK_SEARCHES.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => go(chip)}
            className="shrink-0 rounded-pill border border-gp-border bg-gp-muted px-4 py-2 text-sm font-medium text-gp-text transition-all hover:border-ink-700/25 hover:bg-white hover:shadow-card active:scale-[0.98]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}

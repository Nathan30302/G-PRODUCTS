"use client";

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
    <section className="container-g pt-4 pb-1 sm:pt-5">
      <form
        onSubmit={submit}
        className="flex items-center gap-3 rounded-pill border border-gp-border bg-gp-surface px-5 py-3.5 shadow-card transition-all focus-within:border-ink-700/25 focus-within:shadow-float"
      >
        <Icon name="search" className="h-[1.125rem] w-[1.125rem] shrink-0 text-gp-text-subtle" />
        <input
          name="q"
          placeholder="Search phones, tablets, laptops…"
          className="min-w-0 flex-1 bg-transparent text-[0.9375rem] text-gp-text outline-none placeholder:text-gp-text-subtle"
          aria-label="Search products"
          autoComplete="off"
        />
      </form>

      <div className="no-scrollbar mt-3.5 flex gap-2 overflow-x-auto pb-1">
        {QUICK_SEARCHES.map((chip) => (
          <button
            key={chip.label}
            type="button"
            onClick={() => go(chip)}
            className="shrink-0 rounded-pill border border-gp-border bg-white px-3.5 py-2 text-xs font-semibold text-gp-text transition-all hover:border-ink-700/20 hover:shadow-card active:scale-[0.98] sm:text-sm"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </section>
  );
}

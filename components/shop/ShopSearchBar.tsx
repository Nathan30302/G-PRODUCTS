"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icons";
import { pushRecentSearch } from "@/lib/recent-searches";

/** Full-width search bar under the header. */
export function ShopSearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(urlQ);

  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  if (pathname?.startsWith("/admin")) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) pushRecentSearch(trimmed);
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search"
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 rounded-xl border border-gp-border bg-gp-surface px-3 py-2 shadow-sm transition-all focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/10 ${className}`}
    >
      <Icon name="search" className="h-[1.125rem] w-[1.125rem] shrink-0 text-gp-text-muted" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search chargers, phones, stationery…"
        className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-gp-text outline-none placeholder:text-gp-text-subtle"
        aria-label="Search products"
        enterKeyHint="search"
        autoComplete="off"
      />
    </form>
  );
}

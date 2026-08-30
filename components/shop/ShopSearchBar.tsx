"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";
import { pushRecentSearch } from "@/lib/recent-searches";

/** Full-width search bar — always visible under the header (Plug-style). */
export function ShopSearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");

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
      className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/80 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all focus-within:border-brand/45 focus-within:ring-2 focus-within:ring-brand/12 ${className}`}
    >
      <Icon name="search" className="h-[1.125rem] w-[1.125rem] shrink-0 text-brand/90" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search chargers, phones, stationery…"
        className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-white outline-none placeholder:text-white/35"
        aria-label="Search products"
        enterKeyHint="search"
        autoComplete="off"
      />
    </form>
  );
}

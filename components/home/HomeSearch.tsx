"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";

/** Prominent homepage search — especially useful on mobile. */
export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"
    );
  }

  return (
    <section className="container-g mt-8 sm:mt-10">
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-1.5 shadow-[0_0_40px_rgba(246,212,0,0.06)] focus-within:border-brand/45 focus-within:bg-white/[0.06]"
      >
        <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-brand" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chargers, pouches, stationery…"
          className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35 sm:text-base"
          aria-label="Search products"
        />
        <button type="submit" className="btn-brand shrink-0 px-5 py-2.5 text-sm">
          Search
        </button>
      </form>
    </section>
  );
}

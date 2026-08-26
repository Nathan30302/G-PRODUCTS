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
    <section className="container-g mt-6 sm:mt-10">
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-2xl border border-brand/35 bg-white/[0.05] p-1.5 shadow-[0_0_40px_rgba(246,212,0,0.1)] focus-within:border-brand/55 focus-within:bg-white/[0.07] sm:border-white/[0.1] sm:shadow-[0_0_40px_rgba(246,212,0,0.06)]"
      >
        <Icon name="search" className="ml-3 h-5 w-5 shrink-0 text-brand" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chargers, pouches, stationery…"
          className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-white outline-none placeholder:text-white/35 sm:py-3 sm:text-base"
          aria-label="Search products"
          enterKeyHint="search"
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn-brand shrink-0 px-4 py-3 text-sm sm:px-5 sm:py-2.5"
        >
          Search
        </button>
      </form>
      <p className="mt-2 text-center text-[11px] text-white/35 sm:text-left">
        Tip: try “charger”, “pouch”, “calculator” or “paper”
      </p>
    </section>
  );
}


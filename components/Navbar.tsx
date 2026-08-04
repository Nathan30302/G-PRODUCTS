"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/categories";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { count } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/[0.07] bg-ink-950/90 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-g flex h-14 items-center justify-between gap-2.5 sm:h-16 sm:gap-3">
        <div className="flex items-center gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/35 hover:text-brand sm:h-11 sm:w-11 sm:rounded-2xl lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <>
                  <line x1="5" y1="8" x2="19" y2="8" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="5" y1="16" x2="14" y2="16" />
                </>
              )}
            </svg>
          </button>
          <Link
            href="/"
            aria-label="G-Products home"
            className="transition-transform duration-300 ease-out-expo hover:scale-[1.03]"
          >
            <Logo size="md" priority />
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 text-sm lg:flex">
          <Link
            href="/search"
            className={`rounded-pill px-3.5 py-2 font-semibold transition-colors ${
              pathname === "/search"
                ? "bg-brand/15 text-brand"
                : "text-white/65 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            Shop
          </Link>
          {categories.slice(0, 4).map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`rounded-pill px-3.5 py-2 font-medium transition-colors ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
          <Link
            href="/services"
            className={`rounded-pill px-3.5 py-2 font-semibold transition-colors ${
              pathname?.startsWith("/services")
                ? "bg-brand text-ink-950 shadow-brand-glow"
                : "text-brand hover:bg-brand/10"
            }`}
          >
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <form
            onSubmit={submitSearch}
            className="hidden items-center rounded-pill border border-white/10 bg-white/[0.03] pl-3.5 pr-1 transition-colors focus-within:border-brand/40 focus-within:bg-white/[0.05] md:flex"
          >
            <Icon name="search" className="h-4 w-4 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-36 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-white/35 lg:w-44"
            />
          </form>

          <Link
            href="/search"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/35 hover:text-brand sm:rounded-2xl md:hidden"
            aria-label="Search"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/35 hover:text-brand sm:rounded-2xl"
            aria-label="Cart"
          >
            <Icon name="cart" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-ink-950 shadow-brand-glow">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-white/[0.04] lg:block">
        <div className="container-g no-scrollbar flex gap-1 overflow-x-auto py-2">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand text-ink-950 shadow-brand-glow"
                    : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/[0.07] bg-gradient-to-b from-ink-850 to-ink-950 lg:hidden"
          >
            <div className="container-g space-y-4 py-5">
              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-brand/40"
                />
                <button type="submit" className="btn-brand px-5 py-3 text-sm">
                  Go
                </button>
              </form>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((c, idx) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-brand/30"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand/10 text-[10px] font-black text-brand">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{c.name}</span>
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="col-span-2 flex items-center gap-2.5 rounded-2xl border border-brand/40 bg-brand/10 px-3.5 py-3.5 text-sm font-bold text-brand"
                >
                  <Icon name="services" className="h-4 w-4" />
                  Services — Keys, Loans, Printing
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

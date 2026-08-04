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

  const isHome = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "border-b border-ink-950/6 bg-white/90 shadow-[0_8px_30px_rgba(6,24,28,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-g flex h-14 items-center justify-between gap-2.5 sm:h-16 sm:gap-3">
        {/* Mobile: Plug-style icon row with centered logo */}
        <div className="flex w-10 items-center lg:hidden">
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-ink-950/70 transition-colors hover:bg-ink-950/5 hover:text-ink-950"
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
        </div>

        <Link
          href="/"
          aria-label="G-Products home"
          className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out-expo hover:scale-[1.02] lg:static lg:translate-x-0"
        >
          <Logo size="md" priority />
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm lg:flex">
          <Link
            href="/search"
            className={`rounded-pill px-3.5 py-2 font-semibold transition-colors ${
              pathname === "/search"
                ? "bg-ink-950 text-white"
                : "text-ink-950/55 hover:bg-ink-950/5 hover:text-ink-950"
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
                    ? "bg-ink-950/8 text-ink-950"
                    : "text-ink-950/50 hover:bg-ink-950/5 hover:text-ink-950"
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
                : "text-[#c9a000] hover:bg-brand/15"
            }`}
          >
            Services
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <form
            onSubmit={submitSearch}
            className="hidden items-center rounded-pill border border-ink-950/10 bg-white pl-3.5 pr-1 transition-colors focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(246,212,0,0.2)] md:flex"
          >
            <Icon name="search" className="h-4 w-4 text-ink-950/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="What are you looking for?"
              className="w-44 bg-transparent px-2 py-2.5 text-sm text-ink-950 outline-none placeholder:text-ink-950/35 lg:w-52"
            />
          </form>

          <Link
            href="/search"
            className="grid h-10 w-10 place-items-center rounded-full text-ink-950/70 transition-colors hover:bg-ink-950/5 hover:text-ink-950 md:hidden"
            aria-label="Search"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative hidden h-10 w-10 place-items-center rounded-full text-ink-950/70 transition-colors hover:bg-ink-950/5 hover:text-ink-950 sm:grid"
            aria-label="Cart"
          >
            <Icon name="cart" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-ink-950">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-ink-950/5 lg:block">
        <div className="container-g no-scrollbar flex gap-1 overflow-x-auto py-2">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-ink-950 text-white"
                    : "text-ink-950/45 hover:bg-ink-950/5 hover:text-ink-950"
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
            className="overflow-hidden border-t border-ink-950/8 bg-white lg:hidden"
          >
            <div className="container-g space-y-4 py-5">
              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What are you looking for?"
                  className="flex-1 rounded-2xl border border-ink-950/10 bg-[#f7f8f9] px-4 py-3 text-sm text-ink-950 outline-none focus:border-brand"
                />
                <button type="submit" className="btn-brand px-5 py-3 text-sm">
                  Go
                </button>
              </form>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="rounded-2xl border border-ink-950/8 bg-[#f7f8f9] px-3.5 py-3 text-sm font-semibold text-ink-950 transition-colors hover:border-brand/50"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/services"
                  className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-3.5 py-3.5 text-sm font-bold text-white"
                >
                  <Icon name="services" className="h-4 w-4 text-brand" />
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

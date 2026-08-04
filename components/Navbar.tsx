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
  const [q, setQ] = useState("");

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
    <header className="sticky top-0 z-50">
      {/* White header bar — photo style */}
      <div className="border-b border-ink-950/5 bg-white">
        <div className="container-g relative flex h-14 items-center justify-between sm:h-16">
          {/* Left: hamburger (mobile) / spacer (desktop) */}
          <div className="flex w-11 items-center justify-start">
            <button
              className="grid h-10 w-10 place-items-center text-ink-950 transition-colors hover:text-ink-700 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <svg
                className="h-6 w-6"
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
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
            <Link
              href="/"
              aria-label="G-Products home"
              className="hidden transition-transform duration-300 ease-out-expo hover:scale-[1.02] lg:block"
            >
              <Logo size="md" priority />
            </Link>
          </div>

          {/* Center: logo on mobile */}
          <Link
            href="/"
            aria-label="G-Products home"
            className="absolute left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out-expo hover:scale-[1.02] lg:hidden"
          >
            <Logo size="md" priority />
          </Link>

          {/* Desktop nav */}
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
                  ? "bg-brand text-ink-950"
                  : "text-[#b89000] hover:bg-brand/15"
              }`}
            >
              Services
            </Link>
          </nav>

          {/* Right: search (+ cart on desktop) */}
          <div className="flex w-auto items-center justify-end gap-0.5 sm:gap-1">
            <form
              onSubmit={submitSearch}
              className="hidden items-center rounded-pill border border-ink-950/10 bg-[#f7f8f9] pl-3.5 pr-1 transition-colors focus-within:border-brand md:flex"
            >
              <Icon name="search" className="h-4 w-4 text-ink-950/35" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="w-36 bg-transparent px-2 py-2 text-sm text-ink-950 outline-none placeholder:text-ink-950/35 lg:w-44"
              />
            </form>

            <Link
              href="/search"
              className="grid h-10 w-10 place-items-center text-ink-950 transition-colors hover:text-ink-700 md:hidden"
              aria-label="Search"
            >
              <Icon name="search" className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative hidden h-10 w-10 place-items-center text-ink-950 transition-colors hover:text-ink-700 sm:grid lg:grid"
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
      </div>

      {/* Yellow accent bar */}
      <div className="h-1.5 w-full bg-brand" aria-hidden />

      {/* Desktop category strip */}
      <div className="hidden border-b border-white/[0.06] bg-ink-950 lg:block">
        <div className="container-g no-scrollbar flex gap-1 overflow-x-auto py-2">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-brand text-ink-950"
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
            className="overflow-hidden border-b border-ink-950/8 bg-white lg:hidden"
          >
            <div className="container-g space-y-4 py-5">
              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
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
                    className="rounded-2xl border border-ink-950/8 bg-[#f7f8f9] px-3.5 py-3 text-sm font-semibold text-ink-950"
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

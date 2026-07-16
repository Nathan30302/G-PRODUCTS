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
    router.push(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-ink-950/85 backdrop-blur-lg"
          : "border-transparent bg-ink-950/60 backdrop-blur"
      }`}
    >
      <div className="container-g flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/[0.06] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
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
          <Link href="/" aria-label="G-Products home">
            <Logo />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 text-sm lg:flex">
          {categories.slice(0, 6).map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`rounded-pill px-3 py-2 font-medium transition-colors ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <form
            onSubmit={submitSearch}
            className="hidden items-center rounded-pill border border-white/10 bg-white/[0.04] pl-4 pr-1 transition-colors focus-within:border-brand/40 md:flex"
          >
            <Icon name="search" className="h-4 w-4 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tech..."
              className="w-36 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/40 lg:w-48"
            />
          </form>

          <Link
            href="/search"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.05] text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white md:hidden"
            aria-label="Search"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/[0.05] text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white"
            aria-label="Cart"
          >
            <Icon name="cart" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-ink-950">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10 bg-ink-900 md:hidden"
          >
            <div className="container-g grid grid-cols-2 gap-2 py-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.08]"
                >
                  <Icon name={c.icon} className="h-4 w-4 text-brand" />
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

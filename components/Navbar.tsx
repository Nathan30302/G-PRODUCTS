"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { categories } from "@/lib/categories";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <div className="container-g flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white/80"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
          <Link href="/" aria-label="G-Products home">
            <Logo />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="hover:text-white transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-white/80 hover:text-white"
            aria-label="Search"
          >
            <Icon name="search" className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-white/80 hover:text-white"
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

      {open && (
        <div className="md:hidden border-t border-ink-800 bg-ink-900">
          <div className="container-g grid grid-cols-2 gap-2 py-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg bg-ink-800 px-3 py-2 text-sm text-white/80"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import type { ShopAuth } from "@/components/SiteChrome";

export function Navbar({ auth = null }: { auth?: ShopAuth }) {
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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(
      q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search"
    );
  }

  const shopGroups = catalogGroups.filter((g) => !g.href);
  const accountHref = auth?.home ?? "/profile";
  const profileActive = Boolean(pathname?.startsWith("/profile"));

  const iconBtn =
    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/35 hover:text-brand sm:rounded-2xl";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/[0.07] bg-ink-950/90 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-ink-950/70 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none"
      }`}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="container-g flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <button
            className={`${iconBtn} lg:hidden`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
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
            className="shrink-0 transition-transform duration-300 ease-out-expo hover:scale-[1.03]"
          >
            <Logo size="md" priority />
          </Link>
        </div>

        <nav className="hidden min-w-0 items-center gap-0.5 text-sm lg:flex">
          <Link
            href="/"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${
              pathname === "/"
                ? "bg-brand/15 text-brand"
                : "text-white/65 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${
              pathname === "/search"
                ? "bg-brand/15 text-brand"
                : "text-white/65 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            Shop
          </Link>
          {shopGroups.slice(0, 4).map((c) => {
            const href = hrefForCatalogGroup(c);
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
                className={`hidden rounded-pill px-3 py-2 font-medium transition-colors xl:inline-flex xl:px-3.5 ${
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
            href="/search?deals=1"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${
              pathname?.includes("deals=1")
                ? "bg-brand/15 text-brand"
                : "text-white/65 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            Deals
          </Link>
          <Link
            href="/services"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${
              pathname?.startsWith("/services")
                ? "bg-white/[0.06] text-white"
                : "text-white/55 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            Services
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <form
            onSubmit={submitSearch}
            className="hidden items-center gap-1 rounded-pill border border-white/10 bg-white/[0.03] py-1 pl-3.5 pr-1.5 transition-all focus-within:border-brand/40 focus-within:bg-white/[0.06] focus-within:shadow-brand-glow md:flex"
          >
            <Icon name="search" className="h-4 w-4 shrink-0 text-brand/80" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-32 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/35 lg:w-40 xl:w-52"
            />
            <button
              type="submit"
              className="rounded-pill bg-brand/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-ink-950"
            >
              Go
            </button>
          </form>

          <Link href="/search" className={`${iconBtn} md:hidden`} aria-label="Search">
            <Icon name="search" className="h-5 w-5" />
          </Link>

          <Link href="/cart" className={`relative ${iconBtn}`} aria-label="Cart">
            <Icon name="cart" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-ink-950 shadow-brand-glow">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          <Link
            href={accountHref}
            className={`${iconBtn} ${
              profileActive
                ? "border-brand/40 bg-brand/[0.12] text-brand"
                : ""
            }`}
            aria-label={auth ? "Account" : "Sign in"}
            title={auth ? "Account" : "Sign in"}
          >
            <Icon name="user" className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-white/[0.04] lg:block">
        <div className="container-g no-scrollbar flex gap-1 overflow-x-auto py-2">
          {catalogGroups
            .filter((c) => !c.href)
            .map((c) => {
            const href = hrefForCatalogGroup(c);
            const active = pathname === href;
            return (
              <Link
                key={c.slug}
                href={href}
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
          <Link
            href="/services"
            className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-all ${
              pathname?.startsWith("/services")
                ? "bg-white/[0.08] text-white"
                : "text-white/40 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            Services
          </Link>
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
            <div className="max-h-[min(70dvh,calc(100dvh-var(--header-h)-var(--mobile-nav-offset)))] overflow-y-auto overscroll-contain">
              <div className="container-g space-y-5 py-5 pb-6">
                <form onSubmit={submitSearch} className="flex gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search products…"
                    className="min-h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white outline-none focus:border-brand/40"
                  />
                  <button type="submit" className="btn-brand px-5">
                    Go
                  </button>
                </form>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: "/", label: "Home", icon: "home" as const },
                    { href: "/search", label: "Shop", icon: "search" as const },
                    {
                      href: "/services",
                      label: "Services",
                      icon: "services" as const
                    }
                  ].map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex min-h-11 items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-sm font-semibold text-white/85"
                    >
                      <Icon name={l.icon} className="h-4 w-4 text-brand" />
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href={accountHref}
                    className="flex min-h-11 items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 text-sm font-semibold text-white/85"
                  >
                    <Icon name="user" className="h-4 w-4 text-brand" />
                    {auth ? "Account" : "Sign in"}
                  </Link>
                </div>

                <div>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Departments
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {catalogGroups
                      .filter((c) => !c.href)
                      .map((c) => (
                      <Link
                        key={c.slug}
                        href={hrefForCatalogGroup(c)}
                        className="flex min-h-11 items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-sm font-semibold text-white/85"
                      >
                        <span className="truncate">{c.name}</span>
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-3 text-sm font-semibold text-white/85"
                    >
                      <Icon name="services" className="h-4 w-4 text-brand" />
                      Store services
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

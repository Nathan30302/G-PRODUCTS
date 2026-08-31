"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import type { ShopAuth } from "@/components/SiteChrome";

export function Navbar({ auth = null }: { auth?: ShopAuth }) {
  const { count } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const shopBrowseMode =
    pathname === "/search" &&
    !searchParams.get("q")?.trim() &&
    searchParams.get("deals") !== "1";

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

  const shopGroups = catalogGroups.filter((g) => !g.href);
  const accountHref = auth?.home ?? "/profile";
  const profileActive = Boolean(pathname?.startsWith("/profile"));

  const iconBtn =
    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gp-border bg-gp-surface text-gp-text-muted transition-colors hover:border-accent/40 hover:text-accent sm:rounded-2xl";

  const navLink = (active: boolean) =>
    active
      ? "bg-ink-700/10 text-ink-700"
      : "text-gp-text-muted hover:bg-gp-muted hover:text-gp-text";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gp-border bg-gp-surface/95 shadow-sm backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      } ${shopBrowseMode ? "md:border-b md:shadow-sm" : ""}`}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div
        className={`container-g flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3 ${
          shopBrowseMode ? "hidden md:flex" : ""
        }`}
      >
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
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${navLink(pathname === "/")}`}
          >
            Home
          </Link>
          <Link
            href="/search"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${navLink(pathname === "/search")}`}
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
                className={`hidden rounded-pill px-3 py-2 font-medium transition-colors xl:inline-flex xl:px-3.5 ${navLink(active)}`}
              >
                {c.name}
              </Link>
            );
          })}
          <Link
            href="/search?deals=1"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${navLink(Boolean(pathname?.includes("deals=1")))}`}
          >
            Deals
          </Link>
          <Link
            href="/services"
            className={`rounded-pill px-3 py-2 font-semibold transition-colors xl:px-3.5 ${navLink(Boolean(pathname?.startsWith("/services")))}`}
          >
            Services
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link href="/cart" className={`relative ${iconBtn}`} aria-label="Cart">
            <Icon name="cart" className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          <Link
            href={accountHref}
            className={`${iconBtn} ${profileActive ? "border-accent/40 bg-accent/10 text-accent" : ""}`}
            aria-label={auth ? "Account" : "Sign in"}
            title={auth ? "Account" : "Sign in"}
          >
            <Icon name="user" className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className={`container-g ${shopBrowseMode ? "py-3 md:pb-3" : "pb-3"}`}>
        <Suspense fallback={null}>
          <ShopSearchBar />
        </Suspense>
      </div>

      <div
        className={`border-t border-gp-border ${shopBrowseMode ? "hidden" : "hidden lg:block"}`}
      >
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
                    ? "bg-ink-700 text-white"
                    : "text-gp-text-muted hover:bg-gp-muted hover:text-gp-text"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
          <Link
            href="/services"
            className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold transition-all ${navLink(Boolean(pathname?.startsWith("/services")))}`}
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
            className="overflow-hidden border-t border-gp-border bg-gp-surface lg:hidden"
          >
            <div className="max-h-[min(70dvh,calc(100dvh-var(--header-h)-var(--mobile-nav-offset)))] overflow-y-auto overscroll-contain">
              <div className="container-g space-y-5 py-5 pb-6">
                <Link
                  href="/search"
                  className="btn-brand flex min-h-12 w-full items-center justify-center gap-2 px-4 py-3 text-base font-bold"
                >
                  <Icon name="search" className="h-5 w-5" />
                  Browse all products
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/search?deals=1"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand/30 bg-brand/10 px-3.5 py-3 text-sm font-semibold text-ink-950"
                  >
                    Hot deals
                  </Link>
                  <Link
                    href="/cart"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gp-border bg-gp-bg px-3.5 py-3 text-sm font-semibold text-gp-text"
                  >
                    <Icon name="cart" className="h-4 w-4 text-accent" />
                    Cart{count > 0 ? ` (${count})` : ""}
                  </Link>
                  <Link
                    href="/"
                    className="flex min-h-11 items-center gap-2.5 rounded-xl border border-gp-border bg-gp-bg px-3.5 py-3 text-sm font-semibold text-gp-text"
                  >
                    <Icon name="home" className="h-4 w-4 text-accent" />
                    Home
                  </Link>
                  <Link
                    href={accountHref}
                    className="flex min-h-11 items-center gap-2.5 rounded-xl border border-gp-border bg-gp-bg px-3.5 py-3 text-sm font-semibold text-gp-text"
                  >
                    <Icon name="user" className="h-4 w-4 text-accent" />
                    {auth ? "Account" : "Sign in"}
                  </Link>
                </div>

                <div>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                    Shop by category
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {catalogGroups
                      .filter((c) => !c.href)
                      .map((c) => (
                        <Link
                          key={c.slug}
                          href={hrefForCatalogGroup(c)}
                          className="flex min-h-11 items-center gap-2 rounded-xl border border-gp-border bg-gp-bg px-3 py-3 text-sm font-semibold text-gp-text"
                        >
                          <span className="truncate">{c.name}</span>
                        </Link>
                      ))}
                  </div>
                </div>

                <div className="border-t border-gp-border pt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
                    Also at our stores
                  </p>
                  <Link
                    href="/services"
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gp-border bg-gp-bg px-3.5 py-3 text-sm font-medium text-gp-text-muted"
                  >
                    <Icon name="services" className="h-4 w-4" />
                    Printing, keys &amp; G-Loans
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

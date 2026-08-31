"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";
import { Icon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { ShopSearchBar } from "@/components/shop/ShopSearchBar";
import type { ShopAuth } from "@/components/SiteChrome";

export function Navbar({ auth = null }: { auth?: ShopAuth }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  const isHome = pathname === "/";
  const shopBrowseMode =
    pathname === "/search" &&
    !searchParams.get("q")?.trim() &&
    searchParams.get("deals") !== "1";

  const accountHref = auth?.home ?? "/profile";

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--search-bar",
      shopBrowseMode ? "3.25rem" : "0px"
    );
    return () => {
      document.documentElement.style.setProperty("--search-bar", "0px");
    };
  }, [shopBrowseMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn =
    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gp-border bg-gp-surface text-gp-text-muted transition-all duration-200 hover:border-brand/35 hover:bg-brand/10 hover:text-ink-700 sm:rounded-2xl";

  const servicesActive = Boolean(pathname?.startsWith("/services"));
  const servicesBtn = servicesActive
    ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand/40 bg-brand/15 text-ink-700 shadow-sm sm:rounded-2xl"
    : iconBtn;

  const navLink = (active: boolean) =>
    active
      ? "bg-ink-700/10 text-ink-700"
      : "text-gp-text-muted hover:bg-gp-muted hover:text-gp-text";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gp-border bg-gp-surface/95 shadow-sm backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="container-g grid h-14 grid-cols-[3rem_1fr_3rem] items-center gap-2 sm:h-16 sm:grid-cols-[3.5rem_1fr_3.5rem]">
        <div className="flex justify-start">
          <Link
            href="/services"
            aria-label="Services"
            className={servicesBtn}
          >
            <Icon name="services" className="h-5 w-5" />
          </Link>
        </div>

        <Link
          href="/"
          aria-label="G-Products home"
          className="mx-auto flex justify-center [&_*]:pointer-events-none"
        >
          <Logo size="md" priority />
        </Link>

        <div className="flex justify-end">
          <Link href="/search" aria-label="Search products" className={iconBtn}>
            <Icon name="search" className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {shopBrowseMode ? (
        <div className="container-g pb-3">
          <Suspense fallback={null}>
            <ShopSearchBar />
          </Suspense>
        </div>
      ) : null}

      <div className="hidden border-t border-gp-border lg:block">
        <div className="container-g flex items-center justify-between gap-4 py-2">
          <nav className="flex min-w-0 items-center gap-0.5 text-sm">
            <Link
              href="/"
              className={`rounded-pill px-3 py-2 font-semibold transition-colors ${navLink(isHome)}`}
            >
              Home
            </Link>
            <Link
              href="/search"
              className={`rounded-pill px-3 py-2 font-semibold transition-colors ${navLink(pathname === "/search")}`}
            >
              Shop
            </Link>
            <Link
              href="/search?deals=1"
              className={`rounded-pill px-3 py-2 font-semibold transition-colors ${navLink(Boolean(pathname?.includes("deals=1")))}`}
            >
              Deals
            </Link>
            <Link
              href="/services"
              className={`rounded-pill px-3 py-2 font-semibold transition-colors ${navLink(Boolean(pathname?.startsWith("/services")))}`}
            >
              Services
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/cart" className={`relative ${iconBtn}`} aria-label="Cart">
              <Icon name="cart" className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink-700 px-1 text-[10px] font-bold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
            <Link
              href={accountHref}
              className={iconBtn}
              aria-label={auth ? "Account" : "Sign in"}
            >
              <Icon name="user" className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="container-g no-scrollbar flex gap-1 overflow-x-auto border-t border-gp-border py-2">
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
        </div>
      </div>
    </header>
  );
}

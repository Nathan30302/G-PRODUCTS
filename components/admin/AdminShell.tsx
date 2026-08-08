"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { logoutAction } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

type NavItem = {
  href: string;
  label: string;
  hint: string;
  ownerOnly?: boolean;
};

const nav: NavItem[] = [
  { href: "/admin", label: "Overview", hint: "Business pulse" },
  {
    href: "/admin/products",
    label: "Products",
    hint: "Catalogue & stock"
  },
  { href: "/admin/orders", label: "Orders", hint: "Purchases" },
  {
    href: "/admin/stock-notify",
    label: "Stock alerts",
    hint: "Waitlist"
  },
  {
    href: "/admin/services",
    label: "Service orders",
    hint: "Print, keys, loans"
  },
  {
    href: "/admin/service-pages",
    label: "Service pages",
    hint: "Public content"
  },
  {
    href: "/admin/staff",
    label: "Staff",
    hint: "Team access",
    ownerOnly: true
  },
  {
    href: "/admin/account",
    label: "Account",
    hint: "Password"
  }
];

export function AdminShell({
  user,
  children
}: {
  user: { name: string; role: "OWNER" | "STAFF" };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const items = nav.filter((i) => !i.ownerOnly || user.role === "OWNER");

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const current =
    items.find((i) => isActive(i.href))?.label ?? "Provider desk";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.07),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,201,138,0.05),_transparent_45%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/40 hover:text-brand lg:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                <line x1="5" y1="8" x2="19" y2="8" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="16" x2="14" y2="16" />
              </svg>
            </button>
            <Link href="/admin" className="shrink-0">
              <Logo size="md" priority />
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand/80">
                Provider desk
              </p>
              <p className="truncate text-sm text-white/45">{current}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-1.5 pl-1.5 pr-3 md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-[11px] font-black text-brand">
                {initials}
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold text-white">
                  {user.name}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-white/35">
                  {user.role === "OWNER" ? "Owner" : "Staff"}
                </span>
              </span>
            </div>
            <Link
              href="/"
              className="rounded-pill border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/70 transition-all hover:border-brand/40 hover:text-brand"
            >
              Live shop
            </Link>
            <form action={logoutAction} className="hidden sm:block">
              <button
                type="submit"
                className="rounded-pill px-3 py-2 text-xs font-semibold text-white/40 transition-colors hover:text-red-400"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:py-10">
        <aside className="hidden lg:block lg:w-64 lg:shrink-0">
          <div className="sticky top-24 overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-gradient-to-b from-ink-850/95 to-ink-900/95 p-3 shadow-card">
            <nav className="space-y-1">
              {items.map((i) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`relative block rounded-2xl px-3.5 py-3 transition-all duration-300 ease-out-expo ${
                      active
                        ? "bg-brand text-ink-950 shadow-brand-glow"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {active ? (
                      <span className="absolute left-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-ink-950/40" />
                    ) : null}
                    <span className="block text-sm font-bold">{i.label}</span>
                    <span
                      className={`mt-0.5 block text-[11px] ${
                        active ? "text-ink-950/60" : "text-white/35"
                      }`}
                    >
                      {i.hint}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1 animate-fade-up pb-12">{children}</main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-gradient-to-b from-ink-850 to-ink-950 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] animate-fade-up">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15" />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Provider menu
                </p>
                <p className="display mt-1 text-xl">Where to next?</p>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-2">
              {items.map((i) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`rounded-2xl border px-4 py-4 transition-all ${
                      active
                        ? "border-brand/50 bg-brand/10"
                        : "border-white/[0.06] bg-white/[0.02]"
                    }`}
                  >
                    <span className="block text-base font-bold text-white">
                      {i.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/45">
                      {i.hint}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 flex gap-2 border-t border-white/[0.06] pt-4">
              <Link
                href="/"
                className="flex-1 rounded-pill border border-white/10 py-3 text-center text-sm font-semibold text-white/70"
              >
                Live shop
              </Link>
              <form action={logoutAction} className="flex-1">
                <button
                  type="submit"
                  className="w-full rounded-pill py-3 text-sm font-semibold text-red-400"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

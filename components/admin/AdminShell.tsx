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
  {
    href: "/admin",
    label: "Command centre",
    hint: "Overview of your business"
  },
  {
    href: "/admin/products",
    label: "Products",
    hint: "Catalogue, colours & stock"
  },
  {
    href: "/admin/orders",
    label: "Orders",
    hint: "Customer purchases"
  },
  {
    href: "/admin/stock-notify",
    label: "Stock alerts",
    hint: "Waitlist notifications"
  },
  {
    href: "/admin/services",
    label: "Service orders",
    hint: "Print, keys & loans"
  },
  {
    href: "/admin/service-pages",
    label: "Service pages",
    hint: "Public service content"
  },
  {
    href: "/admin/staff",
    label: "Staff",
    hint: "Team access",
    ownerOnly: true
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
  const isHome = pathname === "/admin";

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const current =
    items.find((i) => isActive(i.href))?.label ?? "Provider console";

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

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.07),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,201,138,0.05),_transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }}
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/80 transition-colors hover:border-brand/40 hover:text-brand lg:hidden"
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
              <Logo />
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand/80">
                Provider console
              </p>
              <p className="truncate text-sm text-white/45">{current}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-right md:block">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wider text-white/35">
                {user.role === "OWNER" ? "Owner" : "Staff"}
              </p>
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
          <div className="sticky top-28 overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-gradient-to-b from-ink-850/90 to-ink-900/90 p-3 shadow-card backdrop-blur">
            <div className="mb-3 rounded-2xl border border-brand/20 bg-brand/[0.07] px-3 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                G-Products
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Business desk
              </p>
            </div>
            <nav className="space-y-1">
              {items.map((i) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`block rounded-2xl px-3.5 py-3 transition-all duration-300 ease-out-expo ${
                      active
                        ? "bg-brand text-ink-950 shadow-brand-glow"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <span className="block text-sm font-bold">{i.label}</span>
                    {!active && (
                      <span className="mt-0.5 block text-[11px] text-white/35">
                        {i.hint}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-white/[0.06] px-3 pt-4">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-white/40">
                {user.role === "OWNER" ? "Owner access" : "Staff access"}
              </p>
              <form action={logoutAction} className="mt-3">
                <button
                  type="submit"
                  className="text-xs font-medium text-white/40 hover:text-red-400"
                >
                  Sign out securely
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 animate-fade-up pb-12">
          {!isHome && (
            <Link
              href="/admin"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-brand/90 transition-colors hover:text-brand lg:hidden"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full border border-brand/30 bg-brand/10 text-xs">
                ←
              </span>
              Command centre
            </Link>
          )}
          {children}
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto rounded-t-[1.75rem] border border-white/10 bg-gradient-to-b from-ink-850 to-ink-950 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15" />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Provider menu
                </p>
                <p className="mt-1 text-xl font-black tracking-tight text-white">
                  Where to next?
                </p>
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

            <div className="grid gap-2.5">
              {items.map((i, idx) => {
                const active = isActive(i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-4 transition-all ${
                      active
                        ? "border-brand/50 bg-brand/10"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-black ${
                        active
                          ? "bg-brand text-ink-950"
                          : "bg-white/[0.05] text-brand"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-base font-bold text-white">
                        {i.label}
                      </span>
                      <span className="mt-0.5 block text-sm text-white/45">
                        {i.hint}
                      </span>
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
      )}
    </div>
  );
}

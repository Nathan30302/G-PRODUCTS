"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { Icon } from "@/components/Icons";
import { DeskThemeProvider, useDeskTheme } from "@/lib/desk-theme";
import { DeskThemeSettings } from "@/components/admin/DeskThemeSettings";

type NavItem = {
  href: string;
  label: string;
  icon: string;
  ownerOnly?: boolean;
  badgeKey?: "orders" | "services" | "stock";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "home" }]
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: "grid" },
      { href: "/admin/browse-tiles", label: "Browse tiles", icon: "image" }
    ]
  },
  {
    label: "Sales",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        icon: "cart",
        badgeKey: "orders"
      },
      { href: "/admin/customers", label: "Customers", icon: "user" },
      { href: "/admin/reviews", label: "Reviews", icon: "star" }
    ]
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/stock-notify",
        label: "Stock alerts",
        icon: "bell",
        badgeKey: "stock"
      },
      {
        href: "/admin/services",
        label: "Service orders",
        icon: "services",
        badgeKey: "services"
      },
      {
        href: "/admin/service-pages",
        label: "Service pages",
        icon: "file"
      },
      { href: "/admin/locations", label: "Locations", icon: "map-pin" }
    ]
  },
  {
    label: "Team",
    items: [
      { href: "/admin/shop-team", label: "Shop team", icon: "sparkles" },
      {
        href: "/admin/staff",
        label: "Staff",
        icon: "shield",
        ownerOnly: true
      }
    ]
  },
  {
    label: "Account",
    items: [{ href: "/admin/account", label: "Account", icon: "lock" }]
  }
];

export type DeskBadges = {
  orders: number;
  services: number;
  stock: number;
};

export function AdminShell({
  user,
  badges = { orders: 0, services: 0, stock: 0 },
  children
}: {
  user: { name: string; role: "OWNER" | "STAFF"; staffTitle?: string | null };
  badges?: DeskBadges;
  children: ReactNode;
}) {
  return (
    <DeskThemeProvider>
      <AdminShellInner user={user} badges={badges}>
        {children}
      </AdminShellInner>
    </DeskThemeProvider>
  );
}

function AdminShellInner({
  user,
  badges = { orders: 0, services: 0, stock: 0 },
  children
}: {
  user: { name: string; role: "OWNER" | "STAFF"; staffTitle?: string | null };
  badges?: DeskBadges;
  children: ReactNode;
}) {
  const { theme } = useDeskTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const groups = navGroups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => !i.ownerOnly || user.role === "OWNER")
    }))
    .filter((g) => g.items.length > 0);

  const flatItems = groups.flatMap((g) => g.items);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  const current =
    flatItems.find((i) => isActive(i.href))?.label ?? "Provider desk";

  function badgeFor(key?: NavItem["badgeKey"]) {
    if (!key) return 0;
    return badges[key] ?? 0;
  }

  const attention =
    (badges.orders ?? 0) + (badges.services ?? 0) + (badges.stock ?? 0);

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

  function NavButton({ item }: { item: NavItem }) {
    const active = isActive(item.href);
    const count = badgeFor(item.badgeKey);
    return (
      <Link
        href={item.href}
        className={`group flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-200 ease-out-expo active:scale-[0.98] ${
          active
            ? "border-brand/50 bg-brand text-ink-950 shadow-brand-glow"
            : "border-gp-border/80 bg-gp-bg/80 text-gp-text shadow-sm hover:-translate-y-0.5 hover:border-ink-700/20 hover:bg-gp-surface hover:shadow-card"
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors ${
            active
              ? "bg-ink-950/10 text-ink-950"
              : "bg-gp-muted text-ink-700 group-hover:bg-brand/15"
          }`}
        >
          <Icon name={item.icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 text-left text-[13px] font-bold tracking-tight">
          {item.label}
        </span>
        {count > 0 ? (
          <span
            className={`rounded-pill px-2 py-0.5 text-[10px] font-black tabular-nums ${
              active ? "bg-ink-950 text-brand" : "bg-brand text-ink-950"
            }`}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : (
          <Icon
            name="chevron-right"
            className={`h-3.5 w-3.5 shrink-0 opacity-40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-80 ${
              active ? "text-ink-950" : "text-gp-text-subtle"
            }`}
          />
        )}
      </Link>
    );
  }

  return (
    <div
      data-desk-theme={theme}
      className="relative min-h-screen overflow-x-hidden bg-gp-bg text-gp-text"
    >
      <div className="desk-ambient" aria-hidden>
        <span className="desk-ambient__blob desk-ambient__blob--a" />
        <span className="desk-ambient__blob desk-ambient__blob--b" />
        <span className="desk-ambient__blob desk-ambient__blob--c" />
        {theme === "ink" || theme === "studio" ? (
          <>
            <span className="desk-ambient__beam" />
            <span className="desk-ambient__spark desk-ambient__spark--1" />
            <span className="desk-ambient__spark desk-ambient__spark--2" />
            <span className="desk-ambient__spark desk-ambient__spark--3" />
          </>
        ) : null}
      </div>

      <header className="sticky top-0 z-40 border-b border-gp-border bg-gp-surface/90 shadow-sm backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />
        <div className="relative mx-auto flex max-w-[92rem] items-center justify-between gap-3 px-4 py-3.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gp-border bg-gp-surface text-gp-text-muted transition-all hover:border-ink-700/25 hover:text-ink-700 active:scale-95 lg:hidden"
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
              {attention > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-black text-ink-950">
                  {attention > 9 ? "9+" : attention}
                </span>
              ) : null}
            </button>
            <Link href="/admin" className="shrink-0 transition-transform hover:scale-[1.03] active:scale-95">
              <Logo variant="mark" size="md" priority />
            </Link>
            <div className="hidden min-w-0 sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-700">
                Provider desk
              </p>
              <p className="truncate text-sm font-medium text-gp-text-muted">
                {current}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2.5 rounded-2xl border border-gp-border bg-gp-surface py-1.5 pl-1.5 pr-3 md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/20 text-[11px] font-black text-ink-850">
                {initials}
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold leading-tight text-gp-text">
                  {user.name}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-gp-text-subtle">
                  {user.role === "OWNER"
                    ? "Owner"
                    : user.staffTitle?.trim() || "Staff"}
                </span>
              </span>
            </div>
            <LogoutButton
              variant="prominent"
              label="Sign out"
              next="/admin/login"
            />
          </div>
        </div>
      </header>

      <div className="relative z-[1] mx-auto flex w-full max-w-[92rem] flex-col gap-8 px-4 py-7 sm:px-8 lg:flex-row lg:gap-10 lg:py-10">
        <aside className="hidden lg:block lg:w-[15.5rem] lg:shrink-0">
          <div className="sticky top-[5.75rem] rounded-[1.5rem] border border-gp-border/80 bg-gp-surface/95 p-3 shadow-card backdrop-blur-sm">
            <div className="mb-3 rounded-2xl border border-gp-border/70 bg-gp-muted/60 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                Signed in
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-gp-text">
                {user.name}
              </p>
              <p className="mt-0.5 text-[11px] text-gp-text-muted">
                {user.role === "OWNER"
                  ? "Owner access"
                  : user.staffTitle?.trim() || "Staff access"}
              </p>
            </div>
            <nav className="space-y-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                    {group.label}
                  </p>
                  <div className="space-y-1.5">
                    {group.items.map((i) => (
                      <NavButton key={i.href} item={i} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            <div className="mt-4 border-t border-gp-border/70 pt-4">
              <DeskThemeSettings compact />
            </div>
          </div>
        </aside>

        <main
          key={pathname}
          className="min-w-0 flex-1 animate-page-enter pb-14"
        >
          {children}
        </main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-850/45 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[1.85rem] border border-gp-border bg-gp-surface p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-24px_70px_rgba(35,55,70,0.15)] animate-fade-up">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gp-border" />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink-700">
                  Provider menu
                </p>
                <p className="display mt-1 text-xl leading-tight text-gp-text">
                  Go somewhere
                </p>
                {attention > 0 ? (
                  <p className="mt-1.5 text-xs text-gp-text-muted">
                    {attention} item{attention === 1 ? "" : "s"} need attention
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gp-border bg-gp-muted text-gp-text-muted"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gp-border bg-gp-muted/50 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/20 text-xs font-black text-ink-850">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gp-text">
                  {user.name}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-gp-text-subtle">
                  {user.role === "OWNER"
                    ? "Owner"
                    : user.staffTitle?.trim() || "Staff"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                    {group.label}
                  </p>
                  <div className="grid gap-2">
                    {group.items.map((i) => (
                      <NavButton key={i.href} item={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4 border-t border-gp-border pt-4">
              <DeskThemeSettings compact />
              <LogoutButton
                variant="prominent"
                label="Sign out"
                next="/admin/login"
                className="w-full justify-center py-3"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

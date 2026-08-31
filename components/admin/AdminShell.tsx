"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import { DeskThemeProvider, useDeskTheme } from "@/lib/desk-theme";
import { DeskThemeSettings } from "@/components/admin/DeskThemeSettings";

type NavItem = {
  href: string;
  label: string;
  hint: string;
  ownerOnly?: boolean;
  badgeKey?: "orders" | "services" | "stock";
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Home",
    items: [{ href: "/admin", label: "Overview", hint: "Business pulse" }]
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", hint: "Catalogue & stock" },
      {
        href: "/admin/browse-tiles",
        label: "Browse tiles",
        hint: "Shop category photos"
      }
    ]
  },
  {
    label: "Sales",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        hint: "Purchases",
        badgeKey: "orders"
      },
      {
        href: "/admin/customers",
        label: "Customers",
        hint: "Shop users & buyers"
      },
      { href: "/admin/reviews", label: "Reviews", hint: "Moderate feedback" }
    ]
  },
  {
    label: "Ops",
    items: [
      {
        href: "/admin/stock-notify",
        label: "Stock alerts",
        hint: "Waitlist",
        badgeKey: "stock"
      },
      {
        href: "/admin/services",
        label: "Service orders",
        hint: "Print, keys, loans",
        badgeKey: "services"
      },
      {
        href: "/admin/service-pages",
        label: "Service pages",
        hint: "Public content"
      },
      { href: "/admin/locations", label: "Locations", hint: "Shop photos" }
    ]
  },
  {
    label: "Team",
    items: [
      { href: "/admin/shop-team", label: "Shop team", hint: "Names & roles" },
      {
        href: "/admin/staff",
        label: "Staff",
        hint: "Desk logins",
        ownerOnly: true
      },
      { href: "/admin/account", label: "Account", hint: "Password" }
    ]
  }
];

export type DeskBadges = {
  orders: number;
  services: number;
  stock: number;
};

function todayLabel() {
  return new Date().toLocaleDateString("en-ZM", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

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

  function NavLink({
    item,
    dense = false
  }: {
    item: NavItem;
    dense?: boolean;
  }) {
    const active = isActive(item.href);
    const count = badgeFor(item.badgeKey);
    return (
      <Link
        href={item.href}
        className={`group relative block rounded-2xl transition-all duration-200 ${
          dense ? "px-3 py-2.5" : "px-4 py-3.5"
        } ${
          active
            ? "bg-ink-850 text-white shadow-sm"
            : "text-gp-text-muted hover:bg-gp-muted hover:text-gp-text"
        }`}
      >
        <span className="flex items-center justify-between gap-2">
          <span
            className={`block font-semibold tracking-tight ${
              dense ? "text-[13px]" : "text-[15px]"
            } ${active ? "font-bold" : ""}`}
          >
            {item.label}
          </span>
          {count > 0 ? (
            <span
              className={`rounded-pill px-2 py-0.5 text-[10px] font-black tabular-nums ${
                active ? "bg-white/20 text-white" : "bg-brand/20 text-ink-850"
              }`}
            >
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </span>
        <span
          className={`mt-0.5 block text-[11px] leading-snug ${
            active ? "text-white/70" : "text-gp-text-subtle group-hover:text-gp-text-muted"
          }`}
        >
          {item.hint}
        </span>
      </Link>
    );
  }

  return (
    <div
      data-desk-theme={theme}
      className="relative min-h-screen overflow-x-hidden bg-gp-bg text-gp-text"
    >
      <header className="sticky top-0 z-40 border-b border-gp-border bg-gp-surface/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gp-border bg-gp-surface text-gp-text-muted transition-colors hover:border-ink-700/25 hover:text-ink-700 lg:hidden"
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
            <Link href="/admin" className="shrink-0">
              <Logo size="md" priority />
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
            <span className="hidden rounded-pill border border-gp-border bg-gp-muted px-3 py-1.5 text-[11px] font-semibold text-gp-text-muted sm:inline">
              {todayLabel()}
            </span>
            <div className="hidden items-center gap-2.5 rounded-2xl border border-gp-border bg-gp-surface py-1.5 pl-1.5 pr-3 md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-[11px] font-black text-ink-700">
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
            <Link
              href="/"
              className="hidden rounded-pill border border-gp-border bg-gp-surface px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:border-ink-700/25 hover:bg-gp-muted sm:inline-flex"
            >
              Live shop
            </Link>
            <LogoutButton variant="prominent" label="Sign out" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-6 sm:gap-8 sm:px-6 lg:flex-row lg:py-9">
        <aside className="hidden lg:block lg:w-[17rem] lg:shrink-0">
          <div className="sticky top-[5.75rem] rounded-[1.35rem] border border-gp-border/80 bg-gp-surface p-3 shadow-card">
            <div className="mb-3 rounded-2xl border border-gp-border/70 bg-gp-muted/50 px-3.5 py-3">
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
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((i) => (
                      <NavLink key={i.href} item={i} dense />
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

        <main className="min-w-0 flex-1 animate-fade-up pb-14">{children}</main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-850/40 backdrop-blur-sm"
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
                  Where to next?
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
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-xs font-black text-ink-700">
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

            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
                    {group.label}
                  </p>
                  <div className="grid gap-2">
                    {group.items.map((i) => {
                      const active = isActive(i.href);
                      const count = badgeFor(i.badgeKey);
                      return (
                        <Link
                          key={i.href}
                          href={i.href}
                          className={`rounded-2xl border px-4 py-3.5 transition-all ${
                            active
                              ? "border-ink-850/20 bg-ink-850/5 shadow-sm"
                              : "border-gp-border bg-gp-surface"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="block text-[15px] font-bold text-gp-text">
                              {i.label}
                            </span>
                            {count > 0 ? (
                              <span className="rounded-pill bg-brand/20 px-2 py-0.5 text-[10px] font-black text-ink-850">
                                {count}
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-sm text-gp-text-muted">
                            {i.hint}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-4 border-t border-gp-border pt-4">
              <DeskThemeSettings compact />
              <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 rounded-pill border border-gp-border py-3 text-center text-sm font-semibold text-ink-700"
              >
                Live shop
              </Link>
              <LogoutButton
                variant="prominent"
                label="Sign out"
                className="flex-1 justify-center py-3"
              />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";

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
    items: [
      { href: "/admin", label: "Overview", hint: "Business pulse" }
    ]
  },
  {
    label: "Catalogue",
    items: [
      {
        href: "/admin/products",
        label: "Products",
        hint: "Catalogue & stock"
      },
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
      {
        href: "/admin/reviews",
        label: "Reviews",
        hint: "Moderate feedback"
      }
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
      {
        href: "/admin/locations",
        label: "Locations",
        hint: "Shop photos"
      }
    ]
  },
  {
    label: "Team",
    items: [
      {
        href: "/admin/shop-team",
        label: "Shop team",
        hint: "Names & roles"
      },
      {
        href: "/admin/staff",
        label: "Staff",
        hint: "Desk logins",
        ownerOnly: true
      },
      {
        href: "/admin/account",
        label: "Account",
        hint: "Password"
      }
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
        className={`group relative block rounded-2xl transition-all duration-300 ease-out-expo ${
          dense ? "px-3 py-2.5" : "px-4 py-3.5"
        } ${
          active
            ? "bg-brand text-ink-950 shadow-brand-glow"
            : "text-white/70 hover:bg-white/[0.045] hover:text-white"
        }`}
      >
        {active ? (
          <span className="absolute left-1.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-ink-950/35" />
        ) : null}
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
                active
                  ? "bg-ink-950/20 text-ink-950"
                  : "bg-brand/20 text-brand"
              }`}
            >
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </span>
        <span
          className={`mt-0.5 block text-[11px] leading-snug ${
            active ? "text-ink-950/55" : "text-white/32 group-hover:text-white/42"
          }`}
        >
          {item.hint}
        </span>
      </Link>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(246,212,0,0.08),_transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(34,201,138,0.06),_transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,32,0)_0%,rgba(6,24,28,0.4)_100%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-950/88 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/35 to-transparent" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 transition-colors hover:border-brand/40 hover:text-brand lg:hidden"
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
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand/85">
                Provider desk
              </p>
              <p className="truncate text-sm font-medium text-white/50">
                {current}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-semibold text-white/50 sm:inline">
              {todayLabel()}
            </span>
            <div className="hidden items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] py-1.5 pl-1.5 pr-3 md:flex">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand/15 text-[11px] font-black text-brand ring-1 ring-brand/20">
                {initials}
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold leading-tight text-white">
                  {user.name}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-white/35">
                  {user.role === "OWNER"
                    ? "Owner"
                    : user.staffTitle?.trim() || "Staff"}
                </span>
              </span>
            </div>
            <Link
              href="/"
              className="rounded-pill border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-white/70 transition-all hover:border-brand/40 hover:text-brand"
            >
              Live shop
            </Link>
            <LogoutButton className="rounded-pill px-3 py-2 text-xs font-semibold text-white/40 transition-colors hover:text-red-400" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-6 sm:gap-8 sm:px-6 lg:flex-row lg:py-9">
        <aside className="hidden lg:block lg:w-[17rem] lg:shrink-0">
          <div className="relative sticky top-[5.75rem] overflow-hidden rounded-[1.65rem] border border-white/[0.09] bg-gradient-to-b from-ink-850/95 via-ink-900/90 to-ink-950/95 p-3 shadow-[0_28px_70px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.04]">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />
            <div className="mb-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Signed in
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">
                {user.role === "OWNER"
                  ? "Owner access"
                  : user.staffTitle?.trim() || "Staff access"}
              </p>
            </div>
            <nav className="relative space-y-4">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/28">
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
          </div>
        </aside>

        <main className="min-w-0 flex-1 animate-fade-up pb-14">{children}</main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/82 backdrop-blur-md"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[1.85rem] border border-white/10 bg-gradient-to-b from-ink-850 to-ink-950 p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[0_-24px_70px_rgba(0,0,0,0.55)] animate-fade-up">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/15" />
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand">
                  Provider menu
                </p>
                <p className="display mt-1 text-xl leading-tight">
                  Where to next?
                </p>
                {attention > 0 ? (
                  <p className="mt-1.5 text-xs text-white/45">
                    {attention} item{attention === 1 ? "" : "s"} need attention
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-xs font-black text-brand ring-1 ring-brand/20">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user.name}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-white/35">
                  {user.role === "OWNER"
                    ? "Owner"
                    : user.staffTitle?.trim() || "Staff"}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
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
                              ? "border-brand/50 bg-brand/10 shadow-[0_0_0_1px_rgba(246,212,0,0.12)]"
                              : "border-white/[0.06] bg-white/[0.02]"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="block text-[15px] font-bold text-white">
                              {i.label}
                            </span>
                            {count > 0 ? (
                              <span className="rounded-pill bg-brand/20 px-2 py-0.5 text-[10px] font-black text-brand">
                                {count}
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block text-sm text-white/45">
                            {i.hint}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2 border-t border-white/[0.06] pt-4">
              <Link
                href="/"
                className="flex-1 rounded-pill border border-white/10 py-3 text-center text-sm font-semibold text-white/70"
              >
                Live shop
              </Link>
              <LogoutButton
                className="flex-1 rounded-pill py-3 text-sm font-semibold text-red-400"
                label="Sign out"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";

type NavItem = { href: string; label: string; ownerOnly?: boolean };

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/staff", label: "Staff", ownerOnly: true }
];

export function AdminShell({
  user,
  children
}: {
  user: { name: string; role: "OWNER" | "STAFF" };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const items = nav.filter((i) => !i.ownerOnly || user.role === "OWNER");

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="lg:w-60 lg:shrink-0">
          <div className="rounded-card border border-ink-800 bg-ink-900 p-4">
            <div className="mb-4 px-2">
              <Logo />
            </div>
            <nav className="space-y-1">
              {items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={`block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(i.href)
                      ? "bg-brand text-ink-950"
                      : "text-white/70 hover:bg-ink-800 hover:text-white"
                  }`}
                >
                  {i.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-ink-800 pt-4">
              <p className="px-3 text-sm font-semibold text-white">
                {user.name}
              </p>
              <p className="px-3 text-xs text-white/40">
                {user.role === "OWNER" ? "Owner" : "Staff"}
              </p>
              <form action={logoutAction} className="mt-3 px-3">
                <button
                  type="submit"
                  className="text-sm text-white/50 hover:text-red-400"
                >
                  Sign out
                </button>
              </form>
              <Link
                href="/"
                className="mt-2 block px-3 text-sm text-white/50 hover:text-brand"
              >
                View shop
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

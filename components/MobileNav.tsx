"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";
import type { ShopAuth } from "@/components/SiteChrome";

const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/search", label: "Shop", icon: "search" as const },
  { href: "/services", label: "Services", icon: "services" as const },
  { href: "/cart", label: "Cart", icon: "cart" as const },
  { href: "/profile", label: "Account", icon: "user" as const }
];

export function MobileNav({ auth = null }: { auth?: ShopAuth }) {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  const accountHref = auth?.home ?? "/profile";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Primary"
    >
      <div className="border-t border-white/[0.08] bg-ink-950/94 shadow-[0_-12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="grid h-14 grid-cols-5 px-1">
          {items.map((it) => {
            const href = it.href === "/profile" ? accountHref : it.href;
            const active =
              it.href === "/"
                ? pathname === "/"
                : it.href === "/profile"
                  ? Boolean(pathname?.startsWith("/profile"))
                  : pathname?.startsWith(it.href);

            return (
              <Link
                key={it.href}
                href={href}
                className={`relative flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold tracking-wide transition-colors ${
                  active ? "text-brand" : "text-white/45 active:text-white/70"
                }`}
              >
                <span className="relative grid h-5 w-5 place-items-center">
                  <Icon name={it.icon} className="h-[1.15rem] w-[1.15rem]" />
                  {it.href === "/cart" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-0.5 text-[9px] font-bold leading-none text-ink-950">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {it.label}
                {active ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

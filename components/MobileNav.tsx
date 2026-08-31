"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";
import type { ShopAuth } from "@/components/SiteChrome";

const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/search", label: "Shop", icon: "search" as const },
  { href: "/cart", label: "Cart", icon: "cart" as const },
  { href: "/profile", label: "Profile", icon: "user" as const }
];

export function MobileNav({ auth = null }: { auth?: ShopAuth }) {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  const accountHref = auth?.home ?? "/profile";

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 border-t border-gp-border bg-gp-surface/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md items-stretch justify-around px-2 pt-1">
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
              className={`relative flex min-w-[4rem] flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors ${
                active ? "text-accent" : "text-gp-text-subtle"
              }`}
            >
              <span className="relative grid h-6 w-6 place-items-center">
                <Icon name={it.icon} className="h-5 w-5" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
              {it.label}
              {active ? (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

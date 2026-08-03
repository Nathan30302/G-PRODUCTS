"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/search", label: "Shop", icon: "search" as const },
  { href: "/services", label: "Services", icon: "services" as const },
  { href: "/cart", label: "Cart", icon: "cart" as const }
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-ink-950/90 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex flex-col items-center gap-1 rounded-2xl py-2.5 text-[10px] font-bold tracking-wide transition-colors ${
                active ? "text-brand" : "text-white/45"
              }`}
            >
              <span
                className={`relative grid h-9 w-9 place-items-center rounded-xl transition-all ${
                  active
                    ? "bg-brand/15 text-brand shadow-[0_0_20px_rgba(246,212,0,0.15)]"
                    : "text-white/50"
                }`}
              >
                <Icon name={it.icon} className="h-5 w-5" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-ink-950">
                    {count}
                  </span>
                )}
              </span>
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

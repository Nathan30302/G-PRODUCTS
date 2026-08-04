"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/search", label: "Shop", icon: "search" as const },
  { href: "/services", label: "Services", icon: "services" as const },
  { href: "/cart", label: "Cart", icon: "cart" as const },
  { href: "/#contact", label: "Profile", icon: "user" as const }
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-10 pb-[max(0.85rem,env(safe-area-inset-bottom))] md:hidden">
      {/* Compact dark floating pill — no white shell */}
      <div className="pointer-events-auto flex w-auto max-w-[16.5rem] items-center justify-center gap-0.5 rounded-pill border border-white/10 bg-ink-950/90 px-1.5 py-1 shadow-[0_10px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : it.href.startsWith("/#")
                ? false
                : pathname?.startsWith(it.href);

          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex min-w-[2.65rem] flex-col items-center gap-px rounded-pill px-1.5 py-1 text-[8px] font-bold tracking-wide transition-colors ${
                active ? "text-brand" : "text-white/40"
              }`}
            >
              <span className="relative grid h-5 w-5 place-items-center">
                <Icon name={it.icon} className="h-3.5 w-3.5" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand px-0.5 text-[8px] font-bold leading-none text-ink-950">
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

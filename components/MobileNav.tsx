"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

const items = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/search", label: "Search", icon: "search" },
  { href: "/cart", label: "Cart", icon: "cart" },
  { href: "/admin/login", label: "Account", icon: "user" }
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink-950/90 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {items.map((it) => {
          const active =
            it.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                active ? "text-brand" : "text-white/55"
              }`}
            >
              <span className="relative">
                <Icon name={it.icon} className="h-6 w-6" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-ink-950">
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

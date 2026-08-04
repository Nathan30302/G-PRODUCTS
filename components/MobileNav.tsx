"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

const items = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/search", label: "Shop", icon: "grid" as const },
  { href: "/services", label: "Services", icon: "plus-circle" as const },
  { href: "/cart", label: "Cart", icon: "cart" as const },
  { href: "/#contact", label: "Profile", icon: "user" as const }
];

export function MobileNav() {
  const pathname = usePathname();
  const { count } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] md:hidden">
      {/* White floating pill from the Plug-style bottom nav photo */}
      <div className="pointer-events-auto flex w-full max-w-md items-stretch justify-between gap-0.5 rounded-pill bg-white px-2.5 py-2 shadow-[0_12px_40px_rgba(6,24,28,0.28)]">
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
              className={`relative flex flex-1 flex-col items-center gap-0.5 rounded-pill px-1 py-1 text-[10px] font-bold tracking-wide transition-colors ${
                active ? "text-[#e8a200]" : "text-ink-950/40"
              }`}
            >
              <span className="relative grid h-7 w-7 place-items-center">
                <Icon name={it.icon} className="h-[1.2rem] w-[1.2rem]" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-ink-950/70 px-1 text-[9px] font-bold text-white">
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

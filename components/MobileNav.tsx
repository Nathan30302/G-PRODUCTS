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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-12 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      {/* Plug-sized compact floating pill */}
      <div className="pointer-events-auto flex items-center gap-0.5 rounded-pill border border-white/10 bg-ink-950/92 px-1.5 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/[0.04] backdrop-blur-2xl">
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
              className={`relative flex w-[3.1rem] flex-col items-center gap-0.5 rounded-pill px-0.5 py-1.5 text-[9px] font-semibold tracking-normal transition-all duration-300 ${
                active
                  ? "bg-brand/15 text-brand"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <span className="relative grid h-[1.1rem] w-[1.1rem] place-items-center">
                <Icon name={it.icon} className="h-3.5 w-3.5" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-3 min-w-3 place-items-center rounded-full bg-brand px-0.5 text-[7px] font-bold leading-none text-ink-950">
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

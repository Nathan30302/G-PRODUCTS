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
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-5 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="pointer-events-auto flex w-full max-w-[22rem] items-center justify-around gap-0.5 rounded-pill border border-gp-border/90 bg-white/96 px-1.5 py-1.5 shadow-nav ring-1 ring-black/[0.04] backdrop-blur-xl">
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
              className={`relative flex min-w-[3.25rem] flex-1 flex-col items-center gap-0.5 rounded-pill px-1 py-1.5 text-[10px] font-semibold tracking-normal transition-all duration-300 ${
                active
                  ? "bg-brand/20 text-ink-850"
                  : "text-gp-text-subtle hover:text-gp-text"
              }`}
            >
              <span
                className={`relative grid h-[1.125rem] w-[1.125rem] place-items-center transition-transform duration-300 ${
                  active ? "scale-110" : ""
                }`}
              >
                <Icon name={it.icon} className="h-[1.05rem] w-[1.05rem]" />
                {it.href === "/cart" && count > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-ink-700 px-0.5 text-[7px] font-bold leading-none text-white">
                    {count > 9 ? "9+" : count}
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

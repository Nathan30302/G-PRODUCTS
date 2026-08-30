"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { catalogGroups, hrefForCatalogGroup } from "@/lib/catalog-taxonomy";

const quick = [
  { label: "🔥 Hot deals", href: "/search?deals=1" },
  { label: "Chargers", href: "/search?q=charger" },
  { label: "Earphones", href: "/search?q=earphone" },
  { label: "Stationery", href: "/search?q=book" }
];

/** Horizontal category chips — Plug-style discovery row. */
export function CategoryPills() {
  const pathname = usePathname();
  const groups = catalogGroups.filter((g) => !g.href).slice(0, 6);

  return (
    <section className="container-g pt-3 sm:pt-4" aria-label="Browse categories">
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {quick.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-pill px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                active
                  ? "bg-brand text-ink-950 shadow-brand-glow"
                  : "border border-white/10 bg-ink-900/60 text-white/75 hover:border-brand/30 hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {groups.map((g) => {
          const href = hrefForCatalogGroup(g);
          const active = pathname === href;
          return (
            <Link
              key={g.slug}
              href={href}
              className={`shrink-0 rounded-pill px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                active
                  ? "bg-white/10 text-white ring-1 ring-white/15"
                  : "border border-white/10 bg-ink-900/60 text-white/65 hover:border-brand/30 hover:text-white"
              }`}
            >
              {g.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

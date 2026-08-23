import Link from "next/link";
import {
  catalogGroups,
  hrefForCatalogGroup
} from "@/lib/catalog-taxonomy";
import { Icon } from "@/components/Icons";

export function ShopByCategory() {
  return (
    <section className="container-g mt-14 sm:mt-16">
      <div className="mb-7">
        <p className="eyebrow">Browse</p>
        <h2 className="display mt-2 text-2xl sm:text-3xl">Shop by category</h2>
        <p className="mt-2 max-w-xl text-sm text-white/50">
          Clear departments — tap a group to explore products and services.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {catalogGroups.map((g) => (
          <Link
            key={g.slug}
            href={hrefForCatalogGroup(g)}
            className="group flex flex-col items-center gap-3 rounded-[1.4rem] border border-white/[0.06] bg-ink-900/60 px-3 py-5 text-center transition-all duration-400 ease-out-expo hover:border-brand/35 hover:bg-ink-850/80 sm:px-4 sm:py-6"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15 transition-all duration-400 group-hover:scale-105 group-hover:bg-brand group-hover:text-ink-950 group-hover:ring-brand sm:h-14 sm:w-14">
              <Icon name={g.icon} />
            </span>
            <span className="text-sm font-bold leading-snug text-white">
              {g.name}
            </span>
            <span className="line-clamp-2 text-[11px] leading-snug text-white/40 sm:text-xs">
              {g.tagline}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

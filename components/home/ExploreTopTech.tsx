import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import {
  EXPLORE_TOP_TECH_TILES,
  enrichExploreTiles,
  type ExploreTile
} from "@/lib/home-explore-tiles";
import type { Product } from "@/lib/types";

export function ExploreTopTech({ products }: { products: Product[] }) {
  const tiles = enrichExploreTiles(EXPLORE_TOP_TECH_TILES, products);

  return (
    <section className="container-g mt-10 sm:mt-12">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gp-text-subtle sm:text-[11px]">
          Trusted by many, loved by all
        </p>
        <h2 className="display mt-2 text-[clamp(1.5rem,1.1rem+1.6vw,2rem)] font-extrabold text-ink-800">
          Explore our Top Tech
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        {tiles.map((tile) => (
          <ExploreTileCard key={tile.id} tile={tile} />
        ))}
      </div>
    </section>
  );
}

function ExploreTileCard({ tile }: { tile: ExploreTile }) {
  return (
    <Link
      href={tile.href}
      className={`group relative flex min-h-[13.5rem] flex-col overflow-hidden rounded-[1.35rem] border border-gp-border/60 bg-gradient-to-br ${tile.gradient} shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99] sm:min-h-[15rem] sm:rounded-[1.5rem]`}
    >
      <div className="flex flex-col items-center px-3 pt-4 text-center sm:px-4 sm:pt-5">
        <span className="rounded-pill bg-gradient-to-r from-[#f4b942] to-[#e8a317] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-white shadow-sm sm:px-3.5 sm:text-[10px]">
          {tile.badge}
        </span>
        <p className="mt-2.5 max-w-[12ch] font-display text-sm font-bold leading-snug text-ink-900 sm:mt-3 sm:text-[0.9375rem]">
          {tile.headline}
        </p>
      </div>

      <div className="relative mt-auto flex flex-1 items-end justify-center px-2 pb-1 pt-2 sm:px-3 sm:pb-2">
        {tile.imageUrl ? (
          <div className="relative h-[5.5rem] w-full sm:h-[6.5rem]">
            <SafeImage
              src={tile.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 45vw, 22vw"
              quality={88}
              className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <div className="flex h-[5.5rem] w-full items-end justify-center pb-2 opacity-40">
            <span className="font-display text-4xl font-extrabold text-ink-700/30">
              G
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

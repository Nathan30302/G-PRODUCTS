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
      <div className="max-w-2xl">
        <p className="text-subtitle text-ink-600">
          Trusted by many, loved by all
        </p>
        <h2 className="display heading-section mt-1">Explore Top Tech</h2>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
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
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-gp-border/80 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99]"
    >
      {tile.imageUrl ? (
        <SafeImage
          src={tile.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          quality={82}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <span className="absolute inset-0 bg-gradient-to-br from-ink-700/90 via-ink-600/80 to-ink-800/90" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
      <span className="absolute inset-x-0 bottom-0 p-4 text-center font-display text-sm font-extrabold tracking-tight text-white drop-shadow-sm sm:text-base">
        {tile.label}
      </span>
    </Link>
  );
}

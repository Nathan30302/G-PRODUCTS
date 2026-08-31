import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { BrowseTileView } from "@/lib/browse-tiles";

/** Plug-style vertical category browse stack — full-width photo tiles. */
export function CategoryBrowseStack({ tiles }: { tiles: BrowseTileView[] }) {
  if (tiles.length === 0) return null;

  return (
    <section className="space-y-3.5 sm:space-y-4" aria-label="Browse categories">
      {tiles.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group relative block w-full overflow-hidden rounded-3xl border border-gp-border/80 shadow-card transition-all hover:shadow-card-hover active:scale-[0.995] ${
            tile.isPromo ? "h-[8.5rem] sm:h-[9.5rem]" : "h-[7rem] sm:h-[8rem]"
          }`}
        >
          {tile.imageUrl ? (
            <SafeImage
              src={tile.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              quality={82}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <span
              className={`absolute inset-0 bg-gradient-to-br ${
                tile.isPromo
                  ? "from-brand/90 via-brand/70 to-accent/80"
                  : "from-accent/80 via-accent/60 to-gp-text/70"
              }`}
            />
          )}
          <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/35" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/5" />
          <span
            className={`absolute inset-0 flex items-center justify-center px-5 text-center font-display font-extrabold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] ${
              tile.isPromo ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {tile.label}
          </span>
        </Link>
      ))}
    </section>
  );
}

import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { BrowseTileView } from "@/lib/browse-tiles";

/** Plug-style vertical category browse stack — full-width photo tiles. */
export function CategoryBrowseStack({ tiles }: { tiles: BrowseTileView[] }) {
  if (tiles.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-3.5" aria-label="Browse categories">
      {tiles.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group relative block w-full overflow-hidden rounded-2xl border border-gp-border shadow-card transition-all hover:shadow-card-hover active:scale-[0.995] ${
            tile.isPromo ? "h-[7.5rem] sm:h-[8.5rem]" : "h-[5.75rem] sm:h-[6.5rem]"
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
          <span className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span
            className={`absolute bottom-0 left-0 right-0 px-4 pb-4 font-display font-extrabold tracking-tight text-white drop-shadow-sm sm:px-5 sm:pb-5 ${
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

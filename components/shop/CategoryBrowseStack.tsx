import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import type { BrowseTileView } from "@/lib/browse-tiles";

/** Full-width photo category tiles for the Shop tab. */
export function CategoryBrowseStack({ tiles }: { tiles: BrowseTileView[] }) {
  if (tiles.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-3.5" aria-label="Browse categories">
      {tiles.map((tile) => (
        <Link
          key={tile.id}
          href={tile.href}
          className={`group relative block w-full overflow-hidden rounded-3xl shadow-[0_2px_16px_rgba(26,35,33,0.08)] transition-all hover:shadow-[0_8px_28px_rgba(26,35,33,0.12)] active:scale-[0.995] ${
            tile.isPromo ? "h-[10rem] sm:h-[11rem]" : "h-[8.75rem] sm:h-[9.5rem]"
          }`}
        >
          {tile.imageUrl ? (
            <SafeImage
              src={tile.imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              quality={85}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span
              className={`absolute inset-0 bg-gradient-to-br ${
                tile.isPromo
                  ? "from-brand/90 via-brand/70 to-accent/80"
                  : "from-ink-700/90 via-ink-850/80 to-ink-950/75"
              }`}
            />
          )}
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/30" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5" />
          <span
            className={`absolute inset-0 flex items-center justify-center px-6 text-center font-display font-extrabold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.5)] ${
              tile.isPromo ? "text-[1.35rem] sm:text-2xl" : "text-xl sm:text-[1.4rem]"
            }`}
          >
            {tile.label}
          </span>
        </Link>
      ))}
    </section>
  );
}

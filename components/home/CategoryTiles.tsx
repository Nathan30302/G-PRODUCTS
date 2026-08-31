import Link from "next/link";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";

export type CategoryTileData = {
  label: string;
  href: string;
  image: string | null;
};

/** Photo category tiles — horizontally scrollable on mobile. */
export function CategoryTiles({ tiles }: { tiles: CategoryTileData[] }) {
  return (
    <section className="container-g pt-5 sm:pt-6" aria-label="Shop by category">
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:gap-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className="group shrink-0 w-[5.5rem] sm:w-[6.25rem]"
          >
            <span className="relative mx-auto block aspect-square w-full overflow-hidden rounded-2xl border border-gp-border bg-gp-surface shadow-card transition-all group-hover:border-accent/40 group-hover:shadow-card-hover">
              {tile.image ? (
                <SafeImage
                  src={tile.image}
                  alt=""
                  fill
                  sizes="100px"
                  className="object-contain p-2"
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center bg-gp-bg text-accent">
                  <Icon name="search" className="h-6 w-6 opacity-60" />
                </span>
              )}
            </span>
            <span className="mt-2 block text-center text-[11px] font-semibold leading-tight text-gp-text group-hover:text-accent sm:text-xs">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Link from "next/link";
import { Category } from "@/lib/types";
import { Icon } from "@/components/Icons";
import { SafeImage } from "@/components/SafeImage";

/** Short Plug-style hooks under the yellow shop pill */
const HOOKS: Record<string, string> = {
  stationery: "Stock up for class",
  storage: "More space, less hassle",
  computers: "Power meets value",
  chargers: "Charge ready, every day",
  power: "Stay powered up",
  audio: "Sound that travels",
  "phone-accessories": "Protect & style",
  watches: "Track your day",
  locks: "Secure what matters"
};

export function CategoryTile({
  category,
  imageUrl
}: {
  category: Category;
  imageUrl?: string | null;
}) {
  const hook = HOOKS[category.slug] ?? category.tagline;
  const shopLabel = `Shop ${category.name.split("&")[0]!.trim()}`;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex min-h-[11.5rem] flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-gradient-to-b from-ink-850/95 to-ink-950/90 p-3.5 transition-all duration-400 ease-out-expo hover:border-brand/35 hover:from-ink-850 hover:to-ink-900 sm:min-h-[13.5rem] sm:p-4"
    >
      <span className="relative z-[1] mx-auto inline-flex max-w-full truncate rounded-pill bg-brand px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-ink-950 shadow-brand-glow sm:px-3 sm:text-[10px]">
        {shopLabel}
      </span>

      <h3 className="relative z-[1] mt-2.5 text-center text-[13px] font-bold leading-snug tracking-tight text-white sm:mt-3 sm:text-sm">
        {hook}
      </h3>

      <div className="relative mt-auto flex min-h-[4.75rem] flex-1 items-end justify-center pt-3 sm:min-h-[5.5rem]">
        {imageUrl ? (
          <div className="relative h-[4.5rem] w-full sm:h-[5.25rem]">
            <SafeImage
              src={imageUrl}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 45vw, 200px"
              className="object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          <span className="mb-1 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 transition-all duration-400 group-hover:scale-105 group-hover:bg-brand group-hover:text-ink-950 sm:h-16 sm:w-16">
            <Icon name={category.icon} className="h-7 w-7 sm:h-8 sm:w-8" />
          </span>
        )}
      </div>
    </Link>
  );
}

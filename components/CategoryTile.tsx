import Link from "next/link";
import { Category } from "@/lib/types";
import { Icon } from "@/components/Icons";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-[1.4rem] border border-white/[0.06] bg-ink-900/60 px-3 py-5 text-center transition-all duration-400 ease-out-expo hover:border-brand/35 hover:bg-ink-850/80 sm:px-4 sm:py-6"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15 transition-all duration-400 group-hover:scale-105 group-hover:bg-brand group-hover:text-ink-950 group-hover:ring-brand sm:h-14 sm:w-14">
        <Icon name={category.icon} />
      </span>
      <span className="text-sm font-bold leading-snug text-white">
        {category.name}
      </span>
      <span className="line-clamp-2 text-[11px] leading-snug text-white/40 sm:text-xs">
        {category.tagline}
      </span>
    </Link>
  );
}

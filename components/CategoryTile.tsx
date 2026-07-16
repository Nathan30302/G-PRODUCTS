import Link from "next/link";
import { Category } from "@/lib/types";
import { Icon } from "@/components/Icons";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-card border border-white/[0.06] bg-ink-850 p-5 text-center transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-brand/30 hover:bg-ink-800 hover:shadow-card-hover"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.04] text-brand ring-1 ring-white/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:text-ink-950 group-hover:ring-brand">
        <Icon name={category.icon} />
      </span>
      <span className="text-sm font-semibold text-white">{category.name}</span>
      <span className="line-clamp-1 text-xs text-white/40">
        {category.tagline}
      </span>
    </Link>
  );
}

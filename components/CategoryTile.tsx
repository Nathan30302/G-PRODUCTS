import Link from "next/link";
import { Category } from "@/lib/types";
import { Icon } from "@/components/Icons";

export function CategoryTile({ category }: { category: Category }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-card border border-ink-800 bg-ink-850 p-5 text-center transition-colors hover:border-brand/40 hover:bg-ink-800"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-800 text-brand ring-1 ring-ink-700 transition-colors group-hover:bg-brand group-hover:text-ink-950">
        <Icon name={category.icon} />
      </span>
      <span className="text-sm font-semibold text-white">{category.name}</span>
      <span className="text-xs text-white/40">{category.tagline}</span>
    </Link>
  );
}

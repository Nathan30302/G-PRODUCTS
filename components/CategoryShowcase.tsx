import Link from "next/link";
import Image from "next/image";
import { Category } from "@/lib/types";
import { getCategoryCover } from "@/lib/category-images";

export function CategoryShowcase({
  categories,
  compact = false
}: {
  categories: Category[];
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {categories.map((c) => {
        const cover = getCategoryCover(c.slug);
        return (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`group relative block overflow-hidden rounded-[1.5rem] bg-ink-900 shadow-[0_8px_30px_rgba(6,24,28,0.12)] transition-transform duration-500 ease-out-expo active:scale-[0.985] sm:rounded-[1.75rem] ${
              compact ? "aspect-[16/7] sm:aspect-[21/7]" : "aspect-[16/9] sm:aspect-[21/8]"
            }`}
          >
            <Image
              src={cover.image}
              alt={c.name}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${cover.tint}`}
            />
            <div className="absolute inset-0 bg-ink-950/25" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <h3 className="text-center text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-3xl lg:text-4xl">
                {c.name}
              </h3>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

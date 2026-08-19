"use client";

import { Icon } from "@/components/Icons";

type Category = {
  slug: string;
  name: string;
  tagline?: string;
  icon?: string;
};

export function CategoryPicker({
  categories,
  defaultSlug
}: {
  categories: Category[];
  defaultSlug?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {categories.map((c) => (
        <label
          key={c.slug}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-300 ease-out-expo hover:border-white/15 hover:bg-white/[0.04] has-[:checked]:border-brand/60 has-[:checked]:bg-brand/[0.12] has-[:checked]:shadow-[0_0_0_1px_rgba(246,212,0,0.15)]"
        >
          <input
            type="radio"
            name="categorySlug"
            value={c.slug}
            defaultChecked={c.slug === defaultSlug}
            className="peer sr-only"
            required
          />
          <div className="flex items-start gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-brand transition-colors group-has-[:checked]:bg-brand group-has-[:checked]:text-ink-950 group-hover:bg-brand/10">
              <Icon name={c.icon ?? "grid"} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <span className="block text-sm font-bold text-white">{c.name}</span>
              {c.tagline && (
                <span className="mt-0.5 block text-xs leading-relaxed text-white/40">
                  {c.tagline}
                </span>
              )}
            </div>
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-white/20 bg-transparent transition-all group-has-[:checked]:border-brand group-has-[:checked]:bg-brand">
              <span className="hidden h-2 w-2 rounded-full bg-ink-950 group-has-[:checked]:block" />
            </span>
          </div>
        </label>
      ))}
    </div>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { Icon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: `${category.name} - ${category.tagline}. Shop at G-Products.`
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const items = await getProductsByCategory(slug);

  return (
    <div className="container-g py-8 sm:py-10">
      <nav className="flex items-center gap-1.5 text-sm text-white/40">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
        <span className="text-white/70">{category.name}</span>
      </nav>

      <header className="mt-5 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20 shadow-[0_0_24px_rgba(246,212,0,0.12)]">
          <Icon name={category.icon} className="h-7 w-7" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Category
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1.5 text-white/50">{category.tagline}</p>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-12 text-center shadow-card">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
            <Icon name={category.icon} className="h-6 w-6" />
          </span>
          <p className="mt-4 font-semibold text-white">
            No products here yet
          </p>
          <p className="mt-1 text-sm text-white/50">
            Check back soon - we&apos;re restocking this category.
          </p>
          <Link href="/search" className="btn-brand mt-5 px-5 py-2.5">
            Browse all tech
          </Link>
        </div>
      ) : (
        <CategoryBrowser products={items} />
      )}
    </div>
  );
}

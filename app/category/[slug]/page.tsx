import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { getCategoryCover } from "@/lib/category-images";
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
  const cover = getCategoryCover(slug);

  return (
    <div className="pb-8 sm:pb-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden sm:mt-3 sm:rounded-[1.75rem] sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] min-h-[10rem] overflow-hidden sm:rounded-[1.75rem]">
          <Image
            src={cover.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${cover.tint}`} />
          <div className="absolute inset-0 bg-ink-950/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
              {category.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="container-g">
        <nav className="mt-5 flex items-center gap-1.5 text-sm text-ink-950/40">
          <Link href="/" className="transition-colors hover:text-ink-950">
            Home
          </Link>
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
          <Link href="/search" className="transition-colors hover:text-ink-950">
            Shop
          </Link>
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
          <span className="text-ink-950/70">{category.name}</span>
        </nav>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-[1.35rem] border border-ink-950/8 bg-white p-12 text-center shadow-[0_4px_24px_rgba(6,24,28,0.06)]">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/15 text-[#b89000]">
              <Icon name={category.icon} className="h-6 w-6" />
            </span>
            <p className="mt-4 font-semibold text-ink-950">
              No products here yet
            </p>
            <p className="mt-1 text-sm text-ink-950/45">
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
    </div>
  );
}

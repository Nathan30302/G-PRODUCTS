import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { ShopEmptyState } from "@/components/shop/ui";
import { Icon } from "@/components/Icons";
import {
  childCategoriesForGroup,
  getCatalogGroup
} from "@/lib/catalog-taxonomy";

export const revalidate = 60;

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
    description: `${category.name} — ${category.tagline}. Shop genuine products at G-Products.`
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
  const group = getCatalogGroup(slug);
  const children = group ? childCategoriesForGroup(group) : [];

  return (
    <div className="container-g py-8 sm:py-10">
      <nav className="flex items-center gap-1.5 text-sm text-gp-text-subtle">
        <Link href="/" className="transition-colors hover:text-ink-700">
          Home
        </Link>
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
        <Link href="/search" className="transition-colors hover:text-ink-700">
          Shop
        </Link>
        <Icon name="chevron-right" className="h-3.5 w-3.5" />
        <span className="text-gp-text">{category.name}</span>
      </nav>

      <header className="mt-5 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
          <Icon name={category.icon} className="h-7 w-7" />
        </span>
        <div>
          <p className="section-label">Category</p>
          <h1 className="display heading-page mt-1">{category.name}</h1>
          <p className="text-subtitle mt-1.5">{category.tagline}</p>
        </div>
      </header>

      {children.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {children.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-pill border border-gp-border bg-gp-muted px-3.5 py-1.5 text-xs font-semibold text-gp-text-muted transition-colors hover:border-ink-700/25 hover:text-ink-700"
            >
              {c.name}
            </Link>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-10">
          <ShopEmptyState
            icon={category.icon}
            title="No products here yet"
            description="Check back soon — we're restocking this category."
            action={
              <Link href="/search" className="btn-brand px-5 py-2.5">
                Browse the catalogue
              </Link>
            }
          />
        </div>
      ) : (
        <CategoryBrowser products={items} />
      )}
    </div>
  );
}

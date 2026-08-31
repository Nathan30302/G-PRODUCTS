import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { ShopEmptyState } from "@/components/shop/ui";
import { getReviewSummariesForProducts } from "@/lib/reviews";

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
  const reviewSummaries = await getReviewSummariesForProducts(
    items.map((p) => p.slug)
  );

  if (items.length === 0) {
    return (
      <div className="bg-white">
        <div className="container-g py-10">
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
      </div>
    );
  }

  return (
    <CategoryBrowser
      categoryName={category.name}
      products={items}
      reviewSummaries={reviewSummaries}
    />
  );
}

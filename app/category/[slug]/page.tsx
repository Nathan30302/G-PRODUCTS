import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

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
    <div className="container-g py-10">
      <nav className="text-sm text-white/40">
        <a href="/" className="hover:text-white">
          Home
        </a>{" "}
        / <span className="text-white/70">{category.name}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-black text-white">{category.name}</h1>
        <p className="mt-1 text-white/50">{category.tagline}</p>
        <p className="mt-2 text-sm text-white/40">
          {items.length} product{items.length === 1 ? "" : "s"}
        </p>
      </header>

      {items.length === 0 ? (
        <p className="mt-12 text-white/50">
          No products here yet. Check back soon.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

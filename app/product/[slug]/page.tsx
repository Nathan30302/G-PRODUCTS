import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getProductBySlug,
  getProductsByCategory,
  getCategoryBySlug
} from "@/lib/queries";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((i) => ({ url: i.url })),
      type: "website"
    }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, categoryProducts] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug)
  ]);
  const off = discountPercent(product.price, product.compareAtPrice);
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-g py-10">
      <nav className="text-sm text-white/40">
        <Link href="/" className="hover:text-white">
          Home
        </Link>{" "}
        /{" "}
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-white"
            >
              {category.name}
            </Link>{" "}
            /{" "}
          </>
        )}
        <span className="text-white/70">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-card border border-ink-800 bg-ink-850">
            <Image
              src={product.images[0]?.url}
              alt={product.images[0]?.alt ?? product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {off && (
              <span className="absolute left-4 top-4 rounded-pill bg-accent px-3 py-1 text-sm font-bold text-ink-950">
                -{off}%
              </span>
            )}
          </div>
        </div>

        <div>
          {product.brand && (
            <span className="text-sm font-medium uppercase tracking-wide text-white/40">
              {product.brand}
            </span>
          )}
          <h1 className="mt-1 text-3xl font-black text-white">{product.name}</h1>

          <div className="mt-3">
            <StockBadge status={product.stock} />
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black text-white">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-white/40 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 text-white/70">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.shortSpecs.map((s) => (
              <li key={s} className="flex items-center gap-2 text-sm text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-8 max-w-sm">
            <ProductActions product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-extrabold text-white">
            Similar Products
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

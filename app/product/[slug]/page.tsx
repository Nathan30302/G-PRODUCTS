import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProductBySlug,
  getProductsByCategory,
  getCategoryBySlug
} from "@/lib/queries";
import { formatPrice, discountPercent } from "@/lib/format";
import { StockBadge } from "@/components/StockBadge";
import { ProductActions } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { ProductRail } from "@/components/ProductRail";
import { Icon } from "@/components/Icons";

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

const trust = [
  { icon: "shield", label: "Genuine product" },
  { icon: "wallet", label: "Mobile Money" },
  { icon: "truck", label: "Fast delivery" }
];

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
  const saved = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;
  const related = categoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <div className="pb-24 md:pb-0">
      <div className="container-g py-6 sm:py-10">
        <nav className="flex flex-wrap items-center gap-1.5 text-sm text-white/40">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
          {category && (
            <>
              <Link
                href={`/category/${category.slug}`}
                className="transition-colors hover:text-white"
              >
                {category.name}
              </Link>
              <Icon name="chevron-right" className="h-3.5 w-3.5" />
            </>
          )}
          <span className="truncate text-white/70">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery
            images={product.images}
            name={product.name}
            badge={off ? `-${off}%` : null}
          />

          <div className="lg:py-2">
            {product.brand && (
              <span className="text-sm font-semibold uppercase tracking-wide text-brand/80">
                {product.brand}
              </span>
            )}
            <h1 className="mt-1.5 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StockBadge status={product.stock} />
              {off && (
                <span className="rounded-pill bg-accent/15 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-accent/30">
                  Save {formatPrice(saved)}
                </span>
              )}
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight text-white">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-white/35 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-white/65">
              {product.description}
            </p>

            <div className="mt-8 max-w-sm">
              <ProductActions product={product} />
            </div>

            {/* trust row */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {trust.map((t) => (
                <div
                  key={t.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-ink-850/60 p-3 text-center"
                >
                  <Icon name={t.icon} className="h-5 w-5 text-brand" />
                  <span className="text-[11px] font-medium text-white/60">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>

            {/* specs table */}
            {product.shortSpecs.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-bold text-white">Specifications</h2>
                <dl className="mt-4 overflow-hidden rounded-card border border-white/[0.06]">
                  {product.shortSpecs.map((s, i) => (
                    <div
                      key={s}
                      className={`flex items-start gap-3 px-4 py-3 text-sm ${
                        i % 2 === 0 ? "bg-ink-850/60" : "bg-transparent"
                      }`}
                    >
                      <Icon
                        name="check"
                        className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      />
                      <span className="text-white/75">{s}</span>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <ProductRail
          title="Related products"
          subtitle={`More from ${category?.name ?? "the shop"}.`}
          products={related}
          href={category ? `/category/${category.slug}` : "/search"}
        />
      )}

      <div className="h-16" />

      <MobileBuyBar product={product} />
    </div>
  );
}

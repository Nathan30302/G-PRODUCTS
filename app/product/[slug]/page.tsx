import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProductBySlug,
  getProductsByCategory,
  getCategoryBySlug,
  getAllProducts
} from "@/lib/queries";
import { discountPercent } from "@/lib/format";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductDetailInfo } from "@/components/ProductDetailInfo";
import { ProductVariantProvider } from "@/components/ProductVariantContext";
import { ProductRail } from "@/components/ProductRail";
import { Icon } from "@/components/Icons";
import { relatedProducts } from "@/lib/related-products";
import { getProductExtras } from "@/lib/product-extras";
import { ProductReviewsSection } from "@/components/ReviewsSection";
import { MobileBuyBar } from "@/components/MobileBuyBar";

export const revalidate = 60;

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
    description:
      product.description.slice(0, 160) ||
      `Buy ${product.name} at G-Products — genuine stock, fair prices, pickup across Lusaka.`,
    openGraph: {
      title: `${product.name} | G-Products`,
      description: product.description.slice(0, 160),
      images: product.images.map((i) => ({
        url: i.url,
        alt: i.alt || product.name
      })),
      type: "website"
    }
  };
}

const trust = [
  { icon: "truck", label: "School delivery", hint: "Free within campus" },
  { icon: "wallet", label: "Mobile Money", hint: "MTN · Airtel · Zamtel" },
  { icon: "map-pin", label: "4 pickup spots", hint: "UNZA · town · campus" }
];


export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, categoryProducts, allProducts] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
    getAllProducts()
  ]);
  const off = discountPercent(product.price, product.compareAtPrice);
  const saved = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;
  // Prefer full catalogue for cross-sell (chargers with pouches, mice with laptops…)
  const relatedPool =
    allProducts.length > categoryProducts.length ? allProducts : categoryProducts;
  const related = relatedProducts(product, relatedPool, 8);

  return (
    <div>
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
          <span className="min-w-0 truncate text-white/70">{product.name}</span>
        </nav>

        <ProductVariantProvider product={product}>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 xl:gap-14">
            <div className="mx-auto w-full max-w-md shrink-0 sm:max-w-lg lg:mx-0 lg:w-[min(48%,30rem)] lg:max-w-none xl:w-[min(44%,32rem)]">
              <ProductPurchasePanel
                product={product}
                badge={off ? `-${off}%` : null}
                compareOff={off}
                saved={saved}
              />
            </div>

            <div className="min-w-0 flex-1">
              <ProductDetailInfo product={product} />
            </div>
          </div>

          <MobileBuyBar product={product} />
        </ProductVariantProvider>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-3 rounded-[1.15rem] border border-white/[0.07] bg-ink-900/50 px-4 py-3.5 sm:flex-col sm:items-center sm:gap-2 sm:p-4 sm:text-center"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/20">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white/85">{t.label}</p>
                <p className="text-[11px] text-white/40">{t.hint}</p>
              </div>
            </div>
          ))}
        </div>

        {product.shortSpecs.length > 0 && !getProductExtras(product).features && (
          <div className="mt-10">
            <h2 className="display text-xl">Specifications</h2>
            <dl className="mt-4 overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-ink-900/40">
              {product.shortSpecs.map((s, i) => (
                <div
                  key={s}
                  className={`flex items-start gap-3 px-4 py-3.5 text-sm ${
                    i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
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

        <ProductReviewsSection
          productSlug={product.slug}
          productName={product.name}
        />
      </div>

      {related.length > 0 && (
        <ProductRail
          title="Often bought together"
          subtitle="Complementary picks — chargers, cases, protectors and more."
          products={related}
          href={category ? `/category/${category.slug}` : "/search"}
        />
      )}

      <div className="h-[calc(var(--mobile-nav-offset)+5.5rem)] md:h-0" />
    </div>
  );
}

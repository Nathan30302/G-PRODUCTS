import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
import { TrackProductView } from "@/components/shop/TrackProductView";
import { ProductPageHeader } from "@/components/product/ProductPageHeader";
import {
  averageRating,
  getProductReviews
} from "@/lib/reviews";

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

  const [category, categoryProducts, allProducts, reviews] = await Promise.all([
    getCategoryBySlug(product.categorySlug),
    getProductsByCategory(product.categorySlug),
    getAllProducts(),
    getProductReviews(slug)
  ]);
  const off = discountPercent(product.price, product.compareAtPrice);
  const saved = product.compareAtPrice
    ? product.compareAtPrice - product.price
    : 0;
  const avgRating = averageRating(reviews);
  const relatedPool =
    allProducts.length > categoryProducts.length ? allProducts : categoryProducts;
  const related = relatedProducts(product, relatedPool, 8);
  const backHref = category ? `/category/${category.slug}` : "/search";

  return (
    <div className="bg-white">
      <TrackProductView slug={product.slug} />
      <ProductPageHeader title={product.name} backHref={backHref} />

      <div className="container-g py-5 sm:py-8">
        <ProductVariantProvider product={product}>
          <div className="mx-auto max-w-2xl">
            <ProductPurchasePanel
              product={product}
              compareOff={off}
              saved={saved}
              avgRating={avgRating}
              reviewCount={reviews.length}
            />

            <ProductDetailInfo product={product} />
          </div>

          <MobileBuyBar product={product} />
        </ProductVariantProvider>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-3 rounded-[1.15rem] border border-gp-border/80 bg-gp-muted/40 px-4 py-3.5 sm:flex-col sm:items-center sm:gap-2 sm:p-4 sm:text-center"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/15 text-ink-700 ring-1 ring-brand/25">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gp-text">{t.label}</p>
                <p className="text-[11px] text-gp-text-muted">{t.hint}</p>
              </div>
            </div>
          ))}
        </div>

        {product.shortSpecs.length > 0 && !getProductExtras(product).features && (
          <div className="mx-auto mt-10 max-w-2xl">
            <h2 className="text-xl font-bold text-gp-text">Specifications</h2>
            <dl className="mt-4 overflow-hidden rounded-[1.25rem] border border-gp-border/80 bg-white">
              {product.shortSpecs.map((s, i) => (
                <div
                  key={s}
                  className={`flex items-start gap-3 px-4 py-3.5 text-sm ${
                    i % 2 === 0 ? "bg-gp-muted/30" : "bg-transparent"
                  }`}
                >
                  <Icon
                    name="check"
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  />
                  <span className="text-gp-text">{s}</span>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <ProductReviewsSection
            productSlug={product.slug}
            productName={product.name}
            theme="light"
          />
        </div>
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

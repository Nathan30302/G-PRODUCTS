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
import { relatedProducts } from "@/lib/related-products";
import { ProductReviewsSection } from "@/components/ReviewsSection";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { TrackProductView } from "@/components/shop/TrackProductView";
import { ProductPageHeader } from "@/components/product/ProductPageHeader";
import { ProductSpecsTable } from "@/components/product/ProductSpecsTable";
import { ProductRatingBreakdown } from "@/components/product/ProductRatingBreakdown";
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
  const onSale = Boolean(off || product.hotDeal);

  return (
    <div className="overflow-x-hidden bg-white pb-4">
      <TrackProductView slug={product.slug} />
      <ProductPageHeader title={product.name} backHref={backHref} />

      <div className="mx-auto max-w-2xl py-4 sm:py-6">
        <ProductVariantProvider product={product}>
          <ProductPurchasePanel
            product={product}
            compareOff={off}
            saved={saved}
            avgRating={avgRating}
            reviewCount={reviews.length}
            onSale={onSale}
          />

          <ProductDetailInfo product={product} />

          <div className="px-4 sm:px-0">
            <ProductSpecsTable product={product} />

            {avgRating != null && reviews.length > 0 ? (
              <ProductRatingBreakdown avg={avgRating} reviews={reviews} />
            ) : null}

            <ProductReviewsSection
              productSlug={product.slug}
              productName={product.name}
              theme="light"
              showLeaveForm
              hideHeader={reviews.length > 0}
            />
          </div>

          <MobileBuyBar product={product} />
        </ProductVariantProvider>
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

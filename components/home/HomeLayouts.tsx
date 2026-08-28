import { Product } from "@/lib/types";
import { ProductRail } from "@/components/ProductRail";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { HomeBundlesSection } from "@/components/home/HomeBundlesSection";

/** Homepage product discovery — search lives directly under the hero. */
export function HomeCatalogSections({
  hotDeals,
  featured,
  newest,
  allProducts
}: {
  hotDeals: Product[];
  featured: Product[];
  newest: Product[];
  allProducts: Product[];
}) {
  return (
    <>
      <ProductRail
        title="Hot deals"
        subtitle="Real savings — compare the old price and see what you save."
        products={hotDeals}
        href="/search?deals=1"
        hrefLabel="View all deals"
        accent="accent"
        eyebrow="Deals"
        className="!mt-10 sm:!mt-12"
      />

      <ShopByCategory />

      <ProductRail
        title="Best sellers"
        subtitle="Popular picks from G-Products."
        products={featured}
        href="/search"
        hrefLabel="View all"
        eyebrow="Popular"
      />

      <ProductRail
        title="New arrivals"
        subtitle="Recently added to the catalogue."
        products={newest}
        href="/search"
        hrefLabel="View all"
        eyebrow="New"
      />

      <HomeBundlesSection products={allProducts} />
    </>
  );
}

import { Product } from "@/lib/types";
import { ProductRail } from "@/components/ProductRail";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { HomeBundlesSection } from "@/components/home/HomeBundlesSection";

/** Homepage product discovery — search in header, rails below. */
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
        title="Featured deals of the week"
        subtitle="Real savings on chargers, accessories and essentials."
        products={hotDeals}
        href="/search?deals=1"
        hrefLabel="All deals"
        accent="accent"
        eyebrow="🔥 Hot deals"
        className="!mt-6 sm:!mt-8"
      />

      <ProductRail
        title="Tech you'll love at prices you'll love more"
        subtitle="Popular picks from G-Products."
        products={featured}
        href="/search"
        hrefLabel="Shop all"
        eyebrow="Handpicked for you"
      />

      <ShopByCategory />

      <ProductRail
        title="New this week"
        subtitle="Recently added to the catalogue."
        products={newest}
        href="/search"
        hrefLabel="View all"
        eyebrow="Just in"
      />

      <HomeBundlesSection products={allProducts} />
    </>
  );
}

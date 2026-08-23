import { Product } from "@/lib/types";
import { ProductRail } from "@/components/ProductRail";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { HomeSearch } from "@/components/home/HomeSearch";

/** Unified homepage product sections — same order on mobile and desktop. */
export function HomeCatalogSections({
  hotDeals,
  featured,
  newest
}: {
  hotDeals: Product[];
  featured: Product[];
  newest: Product[];
}) {
  return (
    <>
      <HomeSearch />
      <ShopByCategory />

      <ProductRail
        title="Hot Deals"
        subtitle="Compare the old price and see what you save."
        products={hotDeals}
        href="/search?deals=1"
        hrefLabel="View all deals"
        accent="accent"
        className="!mt-14 sm:!mt-16"
      />
      <ProductRail
        title="Best Sellers"
        subtitle="Popular picks from G-Products."
        products={featured}
        href="/search"
        hrefLabel="View all"
        className="!mt-14 sm:!mt-16"
      />
      <ProductRail
        title="New Arrivals"
        subtitle="Recently added to the catalogue."
        products={newest}
        href="/search"
        hrefLabel="View all"
        className="!mt-14 sm:!mt-16"
      />
    </>
  );
}

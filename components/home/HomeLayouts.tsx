import { Product } from "@/lib/types";
import { ProductRail } from "@/components/ProductRail";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { HomeSearch } from "@/components/home/HomeSearch";
import Link from "next/link";

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
        subtitle="Real savings — compare the old price and see what you save."
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

      <section className="container-g mt-14 sm:mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Bundles &amp; packs
            </h2>
            <p className="mt-1 text-sm text-white/50">
              Student, phone, laptop and printing packs — add a set in one tap.
            </p>
          </div>
          <Link
            href="/bundles"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View all packs
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            "Student Starter Pack",
            "Phone Essentials",
            "Laptop Essentials",
            "Assignment / Printing"
          ].map((label) => (
            <Link
              key={label}
              href="/bundles"
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-brand/40 hover:text-brand"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

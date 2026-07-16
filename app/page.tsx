import { Hero } from "@/components/Hero";
import { CategoryTile } from "@/components/CategoryTile";
import { DealsRow } from "@/components/DealsRow";
import { TrustBadges } from "@/components/TrustBadges";
import { categories } from "@/lib/categories";
import { getFeatured, getHotDeals } from "@/lib/products";

export default function HomePage() {
  const hotDeals = getHotDeals();
  const featured = getFeatured();

  return (
    <>
      <Hero />

      <section className="container-g mt-14">
        <div className="mb-5">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Everything you need, all in one plug.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((c) => (
            <CategoryTile key={c.slug} category={c} />
          ))}
        </div>
      </section>

      <DealsRow
        title="Hot Deals of the Week"
        subtitle="Smart upgrades, bigger savings."
        products={hotDeals}
      />

      <DealsRow
        title="Handpicked for You"
        subtitle="Top picks from G-Products."
        products={featured}
      />

      <TrustBadges />
    </>
  );
}

import { Hero } from "@/components/Hero";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductRail } from "@/components/ProductRail";
import { TrustBadges } from "@/components/TrustBadges";
import { WhyGProducts } from "@/components/WhyGProducts";
import { ServicesBand } from "@/components/ServicesBand";
import { ContactBand } from "@/components/ContactBand";
import { Stagger, StaggerItem, Reveal } from "@/components/Reveal";
import {
  getAllCategories,
  getAllProducts,
  getFeatured,
  getHotDeals
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, hotDeals, featured, all] = await Promise.all([
    getAllCategories(),
    getHotDeals(),
    getFeatured(),
    getAllProducts()
  ]);

  const newest = all.slice(0, 8);

  return (
    <>
      <Hero />

      <section className="container-g mt-16">
        <Reveal className="mb-5">
          <span className="eyebrow">Browse</span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Everything you need, all in one plug.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <StaggerItem key={c.slug}>
              <CategoryTile category={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <ProductRail
        title="Hot Deals of the Week"
        subtitle="Smart upgrades, bigger savings."
        products={hotDeals}
        href="/search"
        hrefLabel="See all deals"
        accent="accent"
      />

      <ProductRail
        title="Handpicked for You"
        subtitle="Top picks from G-Products."
        products={featured}
        href="/search"
      />

      <ProductRail
        title="Fresh Arrivals"
        subtitle="The newest tech in stock."
        products={newest}
        href="/search"
      />

      <WhyGProducts />

      <ServicesBand />

      <TrustBadges />

      <ContactBand />
    </>
  );
}

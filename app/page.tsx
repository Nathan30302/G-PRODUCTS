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

      <section className="container-g mt-16 sm:mt-20">
        <Reveal className="mb-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Browse
          </p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Stationery, storage, chargers, audio and more.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((c) => (
            <StaggerItem key={c.slug}>
              <CategoryTile category={c} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <ProductRail
        title="Hot Deals of the Week"
        subtitle="Smart picks at better prices."
        products={hotDeals}
        href="/search?q="
        hrefLabel="See all deals"
        accent="accent"
      />

      <ProductRail
        title="Handpicked for You"
        subtitle="Popular items from G-Products."
        products={featured}
        href="/search"
      />

      <ProductRail
        title="Fresh Arrivals"
        subtitle="Browse the latest from our catalogue."
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

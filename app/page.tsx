import { Hero } from "@/components/Hero";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductRail } from "@/components/ProductRail";
import { WhyGProducts } from "@/components/WhyGProducts";
import { ServicesBand } from "@/components/ServicesBand";
import { ContactBand } from "@/components/ContactBand";
import { Reveal } from "@/components/Reveal";
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

      <section className="container-g mt-12 sm:mt-16">
        <Reveal className="mb-6 text-center sm:mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ink-950/40">
            Trusted by many, loved by all.
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">
            Explore our Top Tech.
          </h2>
          <p className="mt-2 text-sm text-ink-950/45">
            Stationery, storage, chargers, audio and more.
          </p>
        </Reveal>
        <CategoryShowcase categories={categories} />
      </section>

      <ProductRail
        title="Hot Deals of the Week"
        subtitle="Smart picks at better prices."
        products={hotDeals}
        href="/search"
        hrefLabel="See all deals"
        accent="accent"
      />

      <ProductRail
        title="Our Bestsellers"
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

      <ContactBand />
    </>
  );
}

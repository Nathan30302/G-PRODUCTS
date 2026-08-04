import { Hero } from "@/components/Hero";
import { CategoryTile } from "@/components/CategoryTile";
import { ProductRail } from "@/components/ProductRail";
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
        <Reveal className="mb-8">
          <p className="eyebrow">Browse</p>
          <h2 className="display mt-2 text-2xl sm:text-3xl">
            Shop by category
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Stationery, storage, chargers, audio and more.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
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
        href="/search"
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

      <ContactBand />
    </>
  );
}

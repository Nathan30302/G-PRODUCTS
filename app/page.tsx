import { Hero } from "@/components/Hero";
import { WhyGProducts } from "@/components/WhyGProducts";
import { ServicesBand } from "@/components/ServicesBand";
import { ContactBand } from "@/components/ContactBand";
import {
  HomeDesktop,
  HomeMobileSections
} from "@/components/home/HomeLayouts";
import {
  getAllCategories,
  getAllProducts,
  getFeatured,
  getHotDeals
} from "@/lib/queries";
import { getAllServiceOffers } from "@/lib/service-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, hotDeals, featured, all, services] = await Promise.all([
    getAllCategories(),
    getHotDeals(),
    getFeatured(),
    getAllProducts(),
    getAllServiceOffers()
  ]);

  const newest = all.slice(0, 8);
  const serviceLinks = services.map((s) => ({
    slug: s.slug,
    name: s.name,
    tagline: s.tagline
  }));

  return (
    <>
      <Hero />

      <HomeDesktop
        categories={categories}
        hotDeals={hotDeals}
        featured={featured}
        newest={newest}
        services={serviceLinks}
      />

      <HomeMobileSections
        categories={categories}
        hotDeals={hotDeals}
        featured={featured}
        newest={newest}
      />

      <div className="lg:hidden">
        <WhyGProducts />
        <ServicesBand />
        <ContactBand />
      </div>

      {/* Desktop: trust strip only — services already in hero + /services link */}
      <div className="hidden lg:block">
        <WhyGProducts />
        <ContactBand />
      </div>
    </>
  );
}

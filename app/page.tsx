import { Hero } from "@/components/Hero";
import { CategoryPills } from "@/components/home/CategoryPills";
import { WhyGProducts } from "@/components/WhyGProducts";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
import { LocationsBand } from "@/components/LocationsBand";
import { StoreReviewsSection } from "@/components/ReviewsSection";
import { HomeCatalogSections } from "@/components/home/HomeLayouts";
import {
  getAllProducts
} from "@/lib/queries";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.headline}`
  },
  description: `${siteConfig.headline} ${siteConfig.subheading}. ${siteConfig.description}`
};

/** Opens straight into the shop — one cached catalogue fetch powers all rails. */
export default async function HomePage() {
  const all = await getAllProducts();
  const hotDeals = all.filter((p) => p.hotDeal);
  const featured = all.filter((p) => p.featured);
  const newest = all.slice(0, 12);

  return (
    <>
      <Hero />
      <CategoryPills />
      <HomeCatalogSections
        hotDeals={hotDeals}
        featured={featured}
        newest={newest}
        allProducts={all}
      />
      <StoreReviewsSection />
      <StoreServicesStrip />
      <WhyGProducts />
      <LocationsBand />
    </>
  );
}

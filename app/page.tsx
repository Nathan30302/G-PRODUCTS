import { Hero } from "@/components/Hero";
import { WhyGProducts } from "@/components/WhyGProducts";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
import { LocationsBand } from "@/components/LocationsBand";
import { StoreReviewsSection } from "@/components/ReviewsSection";
import { HomeCatalogSections } from "@/components/home/HomeLayouts";
import {
  getAllProducts,
  getFeatured,
  getHotDeals
} from "@/lib/queries";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.headline}`
  },
  description: `${siteConfig.headline} ${siteConfig.subheading}. ${siteConfig.description}`
};

export default async function HomePage() {
  const [hotDeals, featured, all] = await Promise.all([
    getHotDeals(),
    getFeatured(),
    getAllProducts()
  ]);

  const newest = all.slice(0, 8);

  return (
    <>
      <Hero />
      <HomeCatalogSections
        hotDeals={hotDeals}
        featured={featured}
        newest={newest}
      />
      <StoreServicesStrip />
      <WhyGProducts />
      <StoreReviewsSection />
      <LocationsBand />
    </>
  );
}

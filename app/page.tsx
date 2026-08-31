import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { ExploreTopTech } from "@/components/home/ExploreTopTech";
import { HandpickedRail } from "@/components/home/HandpickedRail";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
import { StoreReviewsSection } from "@/components/ReviewsSection";
import { getAllProducts } from "@/lib/queries";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — ${siteConfig.headline}`
  },
  description: `${siteConfig.headline} ${siteConfig.subheading}. ${siteConfig.description}`
};

export default async function HomePage() {
  const all = await getAllProducts();
  const handpicked = [
    ...all.filter((p) => p.featured),
    ...all.filter((p) => !p.featured)
  ].slice(0, 14);

  return (
    <>
      <HomeSearchSection />
      <ExploreTopTech products={all} />
      <HandpickedRail products={handpicked} />
      <HomeFAQ />
      <StoreReviewsSection />
      <StoreServicesStrip />
    </>
  );
}

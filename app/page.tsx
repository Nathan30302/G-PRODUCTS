import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { HomeStudentPacks } from "@/components/home/HomeStudentPacks";
import { ExploreTopTech } from "@/components/home/ExploreTopTech";
import { HomeTopPicks } from "@/components/home/HomeTopPicks";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
import { HomeBestsellers } from "@/components/home/HomeBestsellers";
import { HomeHandpickedForYou } from "@/components/home/HomeHandpickedForYou";
import { HomeAboutSection } from "@/components/home/HomeAboutSection";
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

  return (
    <>
      <HomeSearchSection />
      <HomeStudentPacks />
      <ExploreTopTech products={all} />
      <HomeTopPicks products={all} />
      <StoreServicesStrip />
      <HomeBestsellers products={all} />
      <HomeHandpickedForYou products={all} />
      <HomeAboutSection />
    </>
  );
}

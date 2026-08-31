import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { HomeStudentPacks } from "@/components/home/HomeStudentPacks";
import { ExploreTopTech } from "@/components/home/ExploreTopTech";
import { HandpickedRail } from "@/components/home/HandpickedRail";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
import { StoreReviewsSection } from "@/components/ReviewsSection";
import { getAllProducts } from "@/lib/queries";
import { averageRating, getPublishedStoreReviews } from "@/lib/reviews";
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
  const [all, storeReviews] = await Promise.all([
    getAllProducts(),
    getPublishedStoreReviews()
  ]);
  const handpicked = [
    ...all.filter((p) => p.featured),
    ...all.filter((p) => !p.featured)
  ].slice(0, 14);
  const storeRating = averageRating(storeReviews);

  return (
    <>
      <HomeSearchSection />
      <HomeStudentPacks products={all} />
      <ExploreTopTech products={all} />
      <HandpickedRail
        products={handpicked}
        storeRating={storeRating}
        reviewCount={storeReviews.length}
      />
      <HomeFAQ />
      <StoreReviewsSection />
      <StoreServicesStrip />
    </>
  );
}

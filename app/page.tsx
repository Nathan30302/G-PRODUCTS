import { HomeSearchSection } from "@/components/home/HomeSearchSection";
import { HomeStudentPacks } from "@/components/home/HomeStudentPacks";
import { ExploreTopTech } from "@/components/home/ExploreTopTech";
import { HomeTopPicks } from "@/components/home/HomeTopPicks";
import { HomeBestsellers } from "@/components/home/HomeBestsellers";
import { HomeReviewsRail } from "@/components/home/HomeReviewsRail";
import { HomePromoBanner } from "@/components/home/HomePromoBanner";
import { HomeAboutSection } from "@/components/home/HomeAboutSection";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { StoreServicesStrip } from "@/components/home/StoreServicesStrip";
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
  ].slice(0, 20);
  const storeRating = averageRating(storeReviews);
  const productsBySlug = new Map(all.map((p) => [p.slug, p]));

  return (
    <>
      <HomeSearchSection />
      <HomeStudentPacks />
      <ExploreTopTech products={all} />
      <HomeTopPicks
        products={handpicked}
        storeRating={storeRating}
        reviewCount={storeReviews.length}
      />
      <HomeBestsellers
        products={all}
        storeRating={storeRating}
        reviewCount={storeReviews.length}
      />
      <HomeReviewsRail
        reviews={storeReviews}
        productsBySlug={productsBySlug}
      />
      <HomePromoBanner />
      <HomeAboutSection />
      <HomeFAQ />
      <StoreServicesStrip />
    </>
  );
}

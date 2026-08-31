import { Suspense } from "react";
import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";
import { BrowseTilesSection } from "@/components/shop/BrowseTilesSection";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search products",
  description: `Find electronics, stationery, chargers, phone accessories and more at ${siteConfig.name}. Fast search across the full catalogue.`
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; deals?: string }>;
}) {
  const [{ q, deals }, products, categories] = await Promise.all([
    searchParams,
    getAllProducts(),
    getAllCategories()
  ]);
  const list =
    deals === "1"
      ? products.filter((p) => p.hotDeal || p.compareAtPrice)
      : products;
  const showBrowse = !q?.trim() && deals !== "1";

  return (
    <>
      {showBrowse ? (
        <div className="container-g pt-4 sm:pt-6">
          <BrowseTilesSection />
        </div>
      ) : null}
      <Suspense fallback={null}>
        <SearchClient products={list} categories={categories} />
      </Suspense>
    </>
  );
}

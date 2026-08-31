import { Suspense } from "react";
import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";
import { ShopBrowseScreen } from "@/components/shop/ShopBrowseScreen";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description: `Browse electronics, stationery, chargers, phone accessories and more at ${siteConfig.name}.`
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

  if (showBrowse) {
    return (
      <div className="shop-browse-wrap">
        <ShopBrowseScreen />
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <SearchClient products={list} categories={categories} />
    </Suspense>
  );
}

import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

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
  return (
    <SearchClient
      products={list}
      categories={categories}
      initialQuery={q ?? ""}
    />
  );
}

import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

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
    deals === "1" ? products.filter((p) => p.hotDeal || p.compareAtPrice) : products;
  return (
    <SearchClient
      products={list}
      categories={categories}
      initialQuery={q ?? ""}
    />
  );
}

import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";

export const revalidate = 60;

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, products, categories] = await Promise.all([
    searchParams,
    getAllProducts(),
    getAllCategories()
  ]);
  return (
    <SearchClient
      products={products}
      categories={categories}
      initialQuery={q ?? ""}
    />
  );
}

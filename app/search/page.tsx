import { getAllProducts, getAllCategories } from "@/lib/queries";
import { SearchClient } from "@/components/SearchClient";

export const dynamic = "force-dynamic";

export const metadata = { title: "Search" };

export default async function SearchPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);
  return <SearchClient products={products} categories={categories} />;
}

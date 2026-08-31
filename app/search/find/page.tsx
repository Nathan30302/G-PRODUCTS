import { getAllProducts } from "@/lib/queries";
import { SearchFindScreen } from "@/components/shop/SearchFindScreen";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Search",
  description: `Search products at ${siteConfig.name}.`
};

export default async function SearchFindPage() {
  const products = await getAllProducts();

  return (
    <div className="shop-find-wrap">
      <SearchFindScreen products={products} />
    </div>
  );
}

import { ShopSearchTrigger } from "@/components/shop/ShopSearchTrigger";
import { CategoryBrowseStack } from "@/components/shop/CategoryBrowseStack";
import { resolveShopBrowseTiles } from "@/lib/browse-tiles";
import { getAllProducts } from "@/lib/queries";

/** Clean shop browse — search trigger + full-width category tiles. */
export async function ShopBrowseScreen() {
  const products = await getAllProducts();
  const tiles = await resolveShopBrowseTiles(products);

  return (
    <div className="shop-browse-screen">
      <ShopSearchTrigger className="mb-1" />
      <CategoryBrowseStack tiles={tiles} />
    </div>
  );
}

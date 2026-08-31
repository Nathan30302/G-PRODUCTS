import { CategoryBrowseStack } from "@/components/shop/CategoryBrowseStack";
import { resolveShopBrowseTiles } from "@/lib/browse-tiles";
import { getAllProducts } from "@/lib/queries";

/** Server-rendered vertical browse stack for the Shop tab. */
export async function BrowseTilesSection({
  className = ""
}: {
  className?: string;
}) {
  const products = await getAllProducts();
  const tiles = await resolveShopBrowseTiles(products);

  return (
    <div className={className}>
      <CategoryBrowseStack tiles={tiles} />
    </div>
  );
}

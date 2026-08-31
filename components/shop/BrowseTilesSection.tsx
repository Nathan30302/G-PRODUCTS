import { CategoryBrowseStack } from "@/components/shop/CategoryBrowseStack";
import {
  enrichBrowseTilesWithFallbacks,
  getBrowseTiles
} from "@/lib/browse-tiles";
import { getAllProducts } from "@/lib/queries";

/** Server-rendered vertical browse stack with catalogue photo fallbacks. */
export async function BrowseTilesSection({
  className = ""
}: {
  className?: string;
}) {
  const [tiles, products] = await Promise.all([
    getBrowseTiles(),
    getAllProducts()
  ]);
  const enriched = enrichBrowseTilesWithFallbacks(tiles, products);
  if (enriched.length === 0) return null;

  return (
    <div className={className}>
      <CategoryBrowseStack tiles={enriched} />
    </div>
  );
}

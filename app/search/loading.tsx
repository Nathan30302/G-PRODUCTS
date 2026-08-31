import { ShopSearchTrigger } from "@/components/shop/ShopSearchTrigger";
import { BrowseTilesSkeleton } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div className="shop-browse-wrap">
      <ShopSearchTrigger className="mb-1 opacity-60" />
      <BrowseTilesSkeleton />
    </div>
  );
}

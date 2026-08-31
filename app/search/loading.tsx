import { BrowseTilesSkeleton } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div className="container-g px-4 pb-[calc(var(--mobile-nav-offset)+0.5rem)] pt-1 sm:pt-2 md:pb-10 md:pt-4">
      <BrowseTilesSkeleton />
    </div>
  );
}

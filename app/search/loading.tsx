import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div className="container-g py-8 sm:py-10">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="mt-6 h-14 w-full rounded-pill" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-pill" />
        ))}
      </div>
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

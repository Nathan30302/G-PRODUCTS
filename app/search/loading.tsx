import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <div className="container-g py-8 sm:py-10">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-10 w-36" />
      <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      <Skeleton className="mt-7 h-[4.5rem] w-full rounded-[1.5rem]" />
      <div className="mt-5 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-pill" />
        ))}
      </div>
      <Skeleton className="mt-6 h-28 w-full rounded-[1.35rem]" />
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

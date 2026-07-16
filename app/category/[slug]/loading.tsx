import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function CategoryLoading() {
  return (
    <div className="container-g py-8 sm:py-10">
      <Skeleton className="h-4 w-40" />
      <div className="mt-5 flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="mt-6 h-12 w-full rounded-card" />
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

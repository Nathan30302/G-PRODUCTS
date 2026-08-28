import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="container-g space-y-12 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <Skeleton className="mx-auto h-4 w-28" />
        <Skeleton className="mx-auto h-10 w-full max-w-md" />
        <Skeleton className="mx-auto h-5 w-full max-w-lg" />
        <Skeleton className="mx-auto h-14 w-full max-w-xl rounded-[1.75rem]" />
      </div>
      <div>
        <Skeleton className="mb-6 h-8 w-40" />
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}

import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

/** Real data fetch placeholder — not a brand splash. Navbar stays visible via layout. */
export default function HomeLoading() {
  return (
    <>
      <div className="container-g py-10 sm:py-14">
        <div className="mx-auto max-w-4xl space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-24" />
          <Skeleton className="mx-auto h-9 w-full max-w-[16rem] sm:max-w-md" />
          <Skeleton className="mx-auto h-4 w-full max-w-sm sm:max-w-lg" />
          <Skeleton className="mx-auto mt-2 h-[3.25rem] w-full max-w-xl rounded-[1.75rem]" />
        </div>
      </div>
      <div className="container-g -mt-1 sm:mt-0">
        <Skeleton className="h-[7.5rem] w-full rounded-[1.75rem] sm:h-[8rem]" />
      </div>
      <div className="container-g mt-6 sm:mt-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="hidden h-20 rounded-2xl sm:block" />
          <Skeleton className="hidden h-20 rounded-2xl sm:block" />
        </div>
      </div>
      <div className="container-g mt-10 sm:mt-12">
        <Skeleton className="mb-6 h-7 w-36" />
        <ProductGridSkeleton count={4} />
      </div>
    </>
  );
}

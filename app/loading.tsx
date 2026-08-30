import { Skeleton, ProductGridSkeleton } from "@/components/Skeleton";

/** Dark-theme loading — matches compact shop layout (search is in the header). */
export default function HomeLoading() {
  return (
    <>
      <div className="container-g border-b border-white/[0.05] py-6">
        <div className="mx-auto max-w-md space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-28" />
          <Skeleton className="mx-auto h-8 w-full max-w-xs" />
          <Skeleton className="mx-auto h-4 w-full max-w-sm" />
          <Skeleton className="mx-auto mt-2 h-10 w-36 rounded-pill" />
        </div>
      </div>
      <div className="container-g mt-4 flex gap-2 overflow-hidden">
        <Skeleton className="h-9 w-24 shrink-0 rounded-pill" />
        <Skeleton className="h-9 w-20 shrink-0 rounded-pill" />
        <Skeleton className="h-9 w-28 shrink-0 rounded-pill" />
      </div>
      <div className="container-g mt-8">
        <Skeleton className="mb-4 h-3 w-24" />
        <Skeleton className="mb-2 h-6 w-48" />
        <div className="no-scrollbar flex gap-2.5 overflow-hidden pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-[9.25rem] shrink-0">
              <Skeleton className="aspect-[5/6] w-full rounded-xl" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-1 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

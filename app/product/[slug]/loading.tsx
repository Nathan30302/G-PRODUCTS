import { Skeleton } from "@/components/Skeleton";

export default function ProductLoading() {
  return (
    <div className="container-g py-6 sm:py-10">
      <Skeleton className="h-4 w-56" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="mx-auto aspect-[4/5] w-full max-w-[19.5rem] rounded-[1.15rem] sm:max-w-md lg:mx-0 lg:max-w-none" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-6 w-24 rounded-pill" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full max-w-sm rounded-pill" />
          <Skeleton className="h-12 w-full max-w-sm rounded-pill" />
        </div>
      </div>
    </div>
  );
}

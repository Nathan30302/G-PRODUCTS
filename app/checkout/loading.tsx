import { Skeleton } from "@/components/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="container-g max-w-4xl py-10">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-2 h-9 w-48" />
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-48 w-full rounded-[1.35rem]" />
          <Skeleton className="h-36 w-full rounded-[1.35rem]" />
        </div>
        <Skeleton className="h-64 w-full rounded-[1.35rem] lg:col-span-2" />
      </div>
    </div>
  );
}

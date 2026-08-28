import { Skeleton } from "@/components/Skeleton";

export default function CartLoading() {
  return (
    <div className="container-g py-10">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="mt-2 h-9 w-40" />
      <div className="mt-8 space-y-4">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex gap-4 rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50 p-4"
          >
            <Skeleton className="h-24 w-24 shrink-0 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-auto h-9 w-28 rounded-pill" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

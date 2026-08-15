export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-white/[0.06] bg-ink-850">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-2.5 p-3">
        <Skeleton className="h-2.5 w-14" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full rounded-pill" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

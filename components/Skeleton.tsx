export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/70">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

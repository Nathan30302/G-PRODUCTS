export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gp-border/80 bg-gp-surface shadow-card">
      <Skeleton
        className={`w-full rounded-none ${compact ? "aspect-[4/5]" : "aspect-[4/5]"}`}
      />
      <div className={`space-y-2.5 ${compact ? "p-3" : "p-4"}`}>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-1 h-4 w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  compact = true
}: {
  count?: number;
  compact?: boolean;
}) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} compact={compact} />
      ))}
    </div>
  );
}

export function BrowseTilesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`w-full rounded-3xl ${i === 0 ? "h-[8.5rem]" : "h-[7rem]"}`}
        />
      ))}
    </div>
  );
}

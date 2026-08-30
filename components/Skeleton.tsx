export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function ProductCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/[0.06] bg-ink-900/70 ${compact ? "" : "rounded-2xl"}`}>
      <Skeleton className={`w-full rounded-none ${compact ? "aspect-[5/6]" : "aspect-square"}`} />
      <div className={`space-y-1.5 ${compact ? "p-1.5" : "space-y-2 p-2.5"}`}>
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-2/3" />
        <Skeleton className="h-3 w-12" />
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
    <div className="grid product-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} compact={compact} />
      ))}
    </div>
  );
}

"use client";

import { Icon } from "@/components/Icons";

export function ProductRatingBreakdown({
  avg,
  reviews
}: {
  avg: number;
  reviews: Array<{ rating: number }>;
}) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );
  const max = Math.max(...counts, 1);

  return (
    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-4xl font-extrabold tabular-nums text-gp-text">{avg}</p>
        <div className="mt-2 flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={i}
              name="star"
              className={`h-4 w-4 ${
                i < Math.round(avg) ? "text-gp-text" : "text-gp-border"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-gp-text-muted">
          Based on {total} review{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="min-w-0 flex-1 sm:max-w-xs">
        {[5, 4, 3, 2, 1].map((star, i) => {
          const count = counts[i];
          const pct = (count / max) * 100;
          return (
            <div key={star} className="mb-2 flex items-center gap-2 text-xs">
              <span className="w-4 shrink-0 font-semibold tabular-nums text-gp-text">
                {star}
              </span>
              <Icon name="star" className="h-3 w-3 shrink-0 text-gp-text" />
              <span className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gp-muted">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gp-text/80"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right tabular-nums text-gp-text-muted">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

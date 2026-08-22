"use client";

export function ServiceSteps({
  steps,
  current
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li
            key={label}
            className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? "border-brand/40 bg-brand/15 text-brand"
                : done
                  ? "border-accent/30 bg-accent/10 text-accent"
                  : "border-white/[0.08] bg-white/[0.02] text-white/40"
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-black ${
                active
                  ? "bg-brand text-ink-950"
                  : done
                    ? "bg-accent text-ink-950"
                    : "bg-white/10 text-white/50"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

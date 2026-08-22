"use client";

import type { ReactNode } from "react";

export function ServiceSteps({
  steps,
  current
}: {
  steps: string[];
  current: number;
}) {
  const pct =
    steps.length <= 1
      ? 100
      : Math.round(
          (Math.min(current, steps.length - 1) / (steps.length - 1)) * 100
        );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
          Step {Math.min(current + 1, steps.length)} of {steps.length}
        </p>
        <p className="text-xs font-semibold text-brand">
          {steps[Math.min(current, steps.length - 1)]}
        </p>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
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
    </div>
  );
}

/** Lightweight section header inside service forms */
export function FormSection({
  title,
  hint,
  children
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-[1.15rem] border border-white/[0.06] bg-ink-950/35 p-4 sm:p-5">
      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        {hint ? (
          <p className="mt-1 text-xs leading-relaxed text-white/45">{hint}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

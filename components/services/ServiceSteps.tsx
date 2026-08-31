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
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
          Step {Math.min(current + 1, steps.length)} of {steps.length}
        </p>
        <p className="text-xs font-semibold text-ink-700">
          {steps[Math.min(current, steps.length - 1)]}
        </p>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-gp-muted"
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
      <ol className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
        {steps.map((label, i) => {
          const active = i === current;
          const done = i < current;
          return (
            <li
              key={label}
              className={`inline-flex shrink-0 items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "border-brand/40 bg-brand/15 text-ink-800"
                  : done
                    ? "border-accent/35 bg-accent/10 text-accent-dark"
                    : "border-gp-border bg-gp-muted/80 text-gp-text-subtle"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-black ${
                  active
                    ? "bg-brand text-ink-950"
                    : done
                      ? "bg-accent text-ink-950"
                      : "bg-gp-border text-gp-text-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className="whitespace-nowrap">{label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

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
    <section className="service-form-section">
      <div>
        <h3 className="text-sm font-bold text-gp-text">{title}</h3>
        {hint ? (
          <p className="mt-1 text-xs leading-relaxed text-gp-text-muted">{hint}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

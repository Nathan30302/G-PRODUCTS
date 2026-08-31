import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
  elevated = false
}: {
  children: ReactNode;
  className?: string;
  /** Slightly stronger surface for summaries and trust blocks */
  elevated?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.25rem] border border-gp-border/80 bg-gp-surface shadow-card ${
        elevated ? "shadow-float" : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}

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
      className={`rounded-[1.35rem] border border-white/[0.07] bg-ink-900/70 shadow-card ${
        elevated
          ? "bg-gradient-to-b from-ink-900/80 to-ink-950/50"
          : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}

/** Soft drifting smoke / nebula layers for a live atmospheric feel */
export function SmokeBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="smoke-layer smoke-a" />
      <div className="smoke-layer smoke-b" />
      <div className="smoke-layer smoke-c" />
      <div className="smoke-layer smoke-d" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(6,24,28,0.55)_100%)]" />
    </div>
  );
}

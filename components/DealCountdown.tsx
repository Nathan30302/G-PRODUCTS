"use client";

import { useEffect, useState } from "react";

/** Shared deal season end — shown on hot deals / savings badges. */
export function DealCountdown({ endsAt }: { endsAt: string }) {
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!Number.isFinite(end)) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (!Number.isFinite(end)) return null;
  const ms = end - now;
  if (ms <= 0) {
    return (
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white/40">
        Deal ended
      </span>
    );
  }

  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const label =
    d > 0
      ? `${d}d ${h}h`
      : h > 0
        ? `${h}h ${m}m`
        : `${m}m ${String(sec).padStart(2, "0")}s`;

  return (
    <span className="rounded-pill bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
      Ends in {label}
    </span>
  );
}

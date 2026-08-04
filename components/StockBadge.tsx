import { StockStatus } from "@/lib/types";

const map: Record<StockStatus, { label: string; className: string }> = {
  in_stock: {
    label: "In Stock",
    className: "bg-accent/15 text-accent-dark ring-1 ring-accent/30"
  },
  low_stock: {
    label: "Low Stock",
    className: "bg-brand/90 text-ink-950 ring-1 ring-brand/40"
  },
  sold_out: {
    label: "Sold Out",
    className: "bg-ink-950/8 text-ink-950/50 ring-1 ring-ink-950/10"
  }
};

export function StockBadge({ status }: { status: StockStatus }) {
  const s = map[status];
  return (
    <span
      className={`rounded-pill px-2.5 py-1 text-xs font-semibold backdrop-blur ${s.className}`}
    >
      {s.label}
    </span>
  );
}

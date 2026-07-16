import { StockStatus } from "@/lib/types";

const map: Record<StockStatus, { label: string; className: string }> = {
  in_stock: {
    label: "In Stock",
    className: "bg-accent/15 text-accent ring-1 ring-accent/30"
  },
  low_stock: {
    label: "Low Stock",
    className: "bg-brand/15 text-brand ring-1 ring-brand/30"
  },
  sold_out: {
    label: "Sold Out",
    className: "bg-white/10 text-white/60 ring-1 ring-white/15"
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

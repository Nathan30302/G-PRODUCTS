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

export function StockBadge({
  status,
  size = "default"
}: {
  status: StockStatus;
  size?: "default" | "compact";
}) {
  const s = map[status];
  const compact = size === "compact";
  return (
    <span
      className={`rounded-pill font-semibold backdrop-blur ${s.className} ${
        compact
          ? "px-2 py-0.5 text-[10px] font-medium ring-0"
          : "px-2.5 py-1 text-xs"
      }`}
    >
      {compact && status === "in_stock" ? "In stock" : s.label}
    </span>
  );
}

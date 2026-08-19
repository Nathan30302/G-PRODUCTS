import type { CSSProperties } from "react";

export function swatchStyle(hex?: string, name?: string): CSSProperties {
  if (hex) return { backgroundColor: hex };
  const n = (name ?? "x").toLowerCase();
  if (n.includes("white") || n.includes("ivory"))
    return { backgroundColor: "#f5f5f5" };
  if (n.includes("black") || n.includes("midnight"))
    return { backgroundColor: "#111111" };
  if (n.includes("blue")) return { backgroundColor: "#2563eb" };
  if (n.includes("red")) return { backgroundColor: "#dc2626" };
  if (n.includes("green")) return { backgroundColor: "#16a34a" };
  if (n.includes("gold") || n.includes("yellow"))
    return { backgroundColor: "#eab308" };
  if (n.includes("silver") || n.includes("grey") || n.includes("gray"))
    return { backgroundColor: "#9ca3af" };
  if (n.includes("pink")) return { backgroundColor: "#ec4899" };
  return { backgroundColor: "#6b7280" };
}

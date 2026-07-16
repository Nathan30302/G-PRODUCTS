"use client";

import { useState } from "react";

export type VariantRow = {
  name: string;
  colorHex: string;
  quantity: number;
};

const PRESETS = [
  { name: "Black", colorHex: "#111111" },
  { name: "White", colorHex: "#f5f5f5" },
  { name: "Silver", colorHex: "#c0c0c0" },
  { name: "Blue", colorHex: "#2563eb" },
  { name: "Red", colorHex: "#dc2626" },
  { name: "Gold", colorHex: "#eab308" }
];

export function VariantEditor({
  initial = [{ name: "Standard", colorHex: "#6b7280", quantity: 5 }]
}: {
  initial?: VariantRow[];
}) {
  const [rows, setRows] = useState<VariantRow[]>(
    initial.length > 0 ? initial : [{ name: "Standard", colorHex: "", quantity: 0 }]
  );

  function update(i: number, patch: Partial<VariantRow>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function remove(i: number) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  function addRow(preset?: { name: string; colorHex: string }) {
    setRows((prev) => [
      ...prev,
      {
        name: preset?.name ?? "",
        colorHex: preset?.colorHex ?? "",
        quantity: 0
      }
    ]);
  }

  return (
    <div className="space-y-3 rounded-card border border-ink-800 bg-ink-900 p-4">
      <div>
        <p className="text-sm font-semibold text-white">Colours & stock</p>
        <p className="mt-1 text-xs text-white/40">
          Add each colour option and how many you have. Quantity 0 = out of
          stock (customers see it greyed out and can tap Notify me).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => addRow(p)}
            className="rounded-pill border border-ink-700 px-3 py-1 text-xs text-white/60 hover:border-brand/40 hover:text-white"
          >
            + {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_5rem_auto] items-end gap-2 sm:grid-cols-[auto_1fr_1fr_5rem_auto]"
          >
            <div
              className="mb-2 h-9 w-9 rounded-full border border-white/20"
              style={{ backgroundColor: row.colorHex || "#6b7280" }}
              title="Swatch"
            />
            <label className="block sm:col-span-1">
              <span className="text-xs text-white/50">Colour name</span>
              <input
                value={row.name}
                onChange={(e) => update(i, { name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-white outline-none focus:border-brand"
                placeholder="e.g. Black"
                required
              />
            </label>
            <label className="hidden sm:block">
              <span className="text-xs text-white/50">Hex (optional)</span>
              <input
                value={row.colorHex}
                onChange={(e) => update(i, { colorHex: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-white outline-none focus:border-brand"
                placeholder="#111111"
              />
            </label>
            <label className="block">
              <span className="text-xs text-white/50">Qty</span>
              <input
                type="number"
                min={0}
                value={row.quantity}
                onChange={(e) =>
                  update(i, { quantity: Math.max(0, Number(e.target.value) || 0) })
                }
                className="mt-1 w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-white outline-none focus:border-brand"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mb-2 text-xs text-white/40 hover:text-red-400"
              aria-label="Remove colour"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => addRow()}
        className="text-sm font-semibold text-brand hover:underline"
      >
        + Add another colour
      </button>

      {/* Serialized for the server action */}
      <input type="hidden" name="variantsJson" value={JSON.stringify(rows)} />
    </div>
  );
}

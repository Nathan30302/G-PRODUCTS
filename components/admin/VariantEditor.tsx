"use client";

import { useState } from "react";
import { swatchStyle } from "@/lib/swatch";
import { ImageUploader } from "@/components/admin/ImageUploader";

export type VariantRow = {
  id?: string;
  name: string;
  colorHex: string;
  quantity: number;
  imageUrls: string[];
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
  initial = [
    { name: "Standard", colorHex: "#6b7280", quantity: 5, imageUrls: [] }
  ]
}: {
  initial?: VariantRow[];
}) {
  const [rows, setRows] = useState<VariantRow[]>(
    initial.length > 0
      ? initial
      : [{ name: "Standard", colorHex: "", quantity: 0, imageUrls: [] }]
  );

  function update(i: number, patch: Partial<VariantRow>) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    );
  }

  function remove(i: number) {
    setRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)
    );
  }

  function addRow(preset?: { name: string; colorHex: string }) {
    setRows((prev) => [
      ...prev,
      {
        name: preset?.name ?? "",
        colorHex: preset?.colorHex ?? "",
        quantity: 0,
        imageUrls: []
      }
    ]);
  }

  return (
    <div className="space-y-4 rounded-[1.35rem] border border-white/[0.07] bg-ink-900/55 p-5 shadow-card">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand/80">
          Colours & photos
        </p>
        <p className="mt-1.5 text-sm font-semibold text-white">
          One section per colour
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/45">
          Add each colour separately with its own photos and stock. Customers
          will only see photos for the colour they pick — no mixing black and
          white pictures.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => addRow(p)}
            className="rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:border-brand/40 hover:text-brand"
          >
            + {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div
            key={row.id ?? i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="h-10 w-10 shrink-0 rounded-xl ring-1 ring-white/20"
                style={swatchStyle(row.colorHex, row.name)}
              />
              <div>
                <p className="text-sm font-bold text-white">
                  Colour {i + 1}
                  {row.name ? `: ${row.name}` : ""}
                </p>
                <p className="text-xs text-white/40">
                  Photos below are shown only for this colour
                </p>
              </div>
            </div>

            {row.id && (
              <input type="hidden" name={`variant_id_${i}`} value={row.id} />
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-white/50">
                  Colour name
                </span>
                <input
                  value={row.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                  placeholder="e.g. Black"
                  required
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-white/50">
                  Stock qty (provider only)
                </span>
                <input
                  type="number"
                  min={0}
                  value={row.quantity}
                  onChange={(e) =>
                    update(i, {
                      quantity: Math.max(0, Number(e.target.value) || 0)
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                />
              </label>
            </div>

            <label className="mt-3 block">
              <span className="text-xs font-medium text-white/50">
                Swatch hex (optional)
              </span>
              <input
                value={row.colorHex}
                onChange={(e) => update(i, { colorHex: e.target.value })}
                className="mt-1 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                placeholder="#111111"
              />
            </label>

            <div className="mt-3">
              <ImageUploader
                folder="products"
                multiple
                label={`Photos for ${row.name || "this colour"}`}
                urls={row.imageUrls}
                onUrlsChange={(imageUrls) => update(i, { imageUrls })}
              />
              <p className="mt-1 text-[11px] text-white/35">
                First photo is the main image. Add more for gallery swipes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-3 text-xs font-semibold text-white/40 transition-colors hover:text-red-400"
            >
              Remove this colour
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

      <input type="hidden" name="variantsJson" value={JSON.stringify(rows)} />
    </div>
  );
}

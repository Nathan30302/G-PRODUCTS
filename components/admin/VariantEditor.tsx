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
  photosDirty?: boolean;
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
      ? initial.map((r) => ({ ...r, photosDirty: r.photosDirty ?? false }))
      : [{ name: "Black", colorHex: "#111111", quantity: 0, imageUrls: [] }]
  );
  const [openIndex, setOpenIndex] = useState(0);

  function update(i: number, patch: Partial<VariantRow>) {
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r))
    );
  }

  function remove(i: number) {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, idx) => idx !== i);
      setOpenIndex((cur) => Math.min(cur, Math.max(0, next.length - 1)));
      return next;
    });
  }

  function addRow(preset?: { name: string; colorHex: string }) {
    setRows((prev) => {
      const next = [
        ...prev,
        {
          name: preset?.name ?? "",
          colorHex: preset?.colorHex ?? "",
          quantity: 0,
          imageUrls: [],
          photosDirty: false
        }
      ];
      setOpenIndex(next.length - 1);
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-b from-ink-900/70 to-ink-950/50 shadow-card">
      <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand/80">
          Step 3 · Colours & photos
        </p>
        <h2 className="mt-1 text-lg font-bold text-white">One section per colour</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/45">
          Add each colour separately with its own photos and stock. Customers
          only see photos for the colour they pick.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => addRow(p)}
              className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/60 transition-colors hover:border-brand/40 hover:text-brand"
            >
              <span
                className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20"
                style={swatchStyle(p.colorHex, p.name)}
              />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/[0.05]">
        {rows.map((row, i) => {
          const open = openIndex === i;
          const photoCount = row.imageUrls.length;
          return (
            <div key={row.id ?? `row-${i}`} className="bg-white/[0.01]">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.02] sm:px-6"
              >
                <span
                  className="h-11 w-11 shrink-0 rounded-2xl ring-2 ring-white/15 shadow-inner"
                  style={swatchStyle(row.colorHex, row.name)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {row.name.trim() || `Colour ${i + 1}`}
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">
                    {photoCount > 0
                      ? `${photoCount} photo${photoCount === 1 ? "" : "s"} · ${row.quantity} in stock`
                      : `${row.quantity} in stock · add photos below`}
                  </p>
                </div>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-white/50 transition-transform ${
                    open ? "rotate-180 bg-brand/10 text-brand" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {open && (
                <div className="space-y-4 border-t border-white/[0.05] px-5 pb-5 pt-4 sm:px-6">
                  {row.id && (
                    <input type="hidden" name={`variant_id_${i}`} value={row.id} />
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
                        Colour name
                      </span>
                      <input
                        value={row.name}
                        onChange={(e) => update(i, { name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                        placeholder="e.g. White"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
                        Stock quantity
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
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/45">
                      Swatch colour (optional)
                    </span>
                    <div className="mt-1.5 flex items-center gap-3">
                      <input
                        type="color"
                        value={row.colorHex || "#6b7280"}
                        onChange={(e) => update(i, { colorHex: e.target.value })}
                        className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-ink-950 p-1"
                      />
                      <input
                        value={row.colorHex}
                        onChange={(e) => update(i, { colorHex: e.target.value })}
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-950 px-3 py-2.5 text-sm text-white outline-none focus:border-brand/50"
                        placeholder="#ffffff"
                      />
                    </div>
                  </label>

                  <div className="rounded-2xl border border-dashed border-white/10 bg-ink-950/60 p-4">
                    <ImageUploader
                      folder="products"
                      multiple
                      allowDownload
                      downloadPrefix={`${row.name.trim() || "colour"}`.toLowerCase().replace(/\s+/g, "-")}
                      label={`Photos for ${row.name.trim() || "this colour"}`}
                      urls={row.imageUrls}
                      onUrlsChange={(imageUrls) =>
                        update(i, { imageUrls, photosDirty: true })
                      }
                    />
                    <p className="mt-2 text-[11px] text-white/35">
                      Tap upload from your phone. First photo is the cover image.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-xs font-semibold text-white/40 transition-colors hover:text-red-400"
                  >
                    Remove this colour
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/[0.06] px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => addRow()}
          className="inline-flex items-center gap-2 rounded-pill border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand/20"
        >
          + Add another colour
        </button>
      </div>

      <input type="hidden" name="variantsJson" value={JSON.stringify(rows)} />
    </div>
  );
}

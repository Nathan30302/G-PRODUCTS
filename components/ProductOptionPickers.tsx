"use client";

import { useMemo, useState } from "react";
import { Product, ProductImage, ProductVariant, unitPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { swatchStyle } from "@/lib/swatch";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";
import type { FitmentConfig } from "@/lib/fitment";
import { imagesForVariant } from "@/lib/product-images";

function thumbForVariant(
  images: ProductImage[],
  variantId: string,
  fitmentModel?: string | null
): string | null {
  const list = imagesForVariant(images, variantId, { fitmentModel });
  return list[0]?.url ?? null;
}

export function ColourPicker({
  product,
  variants,
  selectedId,
  onSelect,
  locked = false,
  lockHint,
  fitmentModel
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locked?: boolean;
  lockHint?: string;
  fitmentModel?: string | null;
}) {
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className={`mt-5 ${locked ? "opacity-55" : ""}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
          Colour
        </p>
        {locked ? (
          <p className="text-xs text-white/35">{lockHint ?? "Select model first"}</p>
        ) : selected ? (
          <p className="text-sm font-semibold text-white/80">
            {selected.name}
            {!selected.available ? (
              <span className="text-white/40"> · Out of stock</span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          const thumb = thumbForVariant(product.images, v.id, fitmentModel);
          return (
            <button
              key={v.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(v.id)}
              aria-label={v.name}
              aria-pressed={active}
              title={
                locked
                  ? lockHint ?? "Select model first"
                  : out
                    ? `${v.name} — out of stock`
                    : v.name
              }
              className={`group relative overflow-hidden rounded-2xl border bg-[#f4f4f2] text-left transition-all duration-300 ease-out-expo ${
                active
                  ? "border-brand ring-2 ring-brand/40 shadow-brand-glow"
                  : "border-white/10 hover:-translate-y-0.5 hover:border-white/25"
              } ${out || locked ? "opacity-45" : ""} ${locked ? "cursor-not-allowed" : ""}`}
            >
              <span className="relative block aspect-square">
                {thumb ? (
                  <SafeImage
                    src={thumb}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  <span
                    className="absolute inset-3 rounded-xl ring-1 ring-black/10"
                    style={swatchStyle(v.colorHex, v.name)}
                  />
                )}
              </span>
              <span className="block truncate px-1.5 pb-2 text-center text-[10px] font-semibold text-ink-950/70">
                {v.name}
              </span>
              {active ? (
                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand text-ink-950">
                  <Icon name="check" className="h-3 w-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Generic priced option tiles (when not ways×length). */
export function PricedOptionGrid({
  product,
  variants,
  selectedId,
  onSelect
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
        Choose option
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          const thumb = thumbForVariant(product.images, v.id);
          const price = unitPrice(product, v);
          return (
            <button
              key={v.id}
              type="button"
              disabled={out}
              onClick={() => onSelect(v.id)}
              className={`overflow-hidden rounded-2xl border text-left transition-all ${
                active
                  ? "border-brand ring-2 ring-brand/35"
                  : "border-white/10 hover:border-white/25"
              } ${out ? "opacity-40" : ""}`}
            >
              {thumb ? (
                <span className="relative block aspect-[4/3] bg-[#f4f4f2]">
                  <SafeImage
                    src={thumb}
                    alt=""
                    fill
                    sizes="160px"
                    className="object-contain p-1"
                  />
                </span>
              ) : null}
              <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="text-sm font-semibold text-white">{v.name}</span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-brand">
                  {formatPrice(price)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function parseExtension(name: string): { ways: string; length: string } | null {
  const m = name.match(/^(\d)-way\s*[·•-]\s*(\d+m)$/i);
  if (!m) return null;
  return { ways: `${m[1]}-way`, length: m[2].toLowerCase() };
}

export function ExtensionPicker({
  product,
  variants,
  selectedId,
  onSelect
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const parsed = useMemo(() => {
    return variants.map((v) => ({
      variant: v,
      ...parseExtension(v.name)
    }));
  }, [variants]);

  const waysOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of parsed) if (p.ways) set.add(p.ways);
    return [...set].sort();
  }, [parsed]);

  const lengthOptions = useMemo(() => {
    const set = new Set<string>();
    for (const p of parsed) if (p.length) set.add(p.length);
    return [...set].sort();
  }, [parsed]);

  const selected = variants.find((v) => v.id === selectedId);
  const selectedParsed = selected ? parseExtension(selected.name) : null;

  const [ways, setWays] = useState(
    selectedParsed?.ways ?? waysOptions[0] ?? "4-way"
  );
  const [length, setLength] = useState(
    selectedParsed?.length ?? lengthOptions[0] ?? "3m"
  );

  function pick(nextWays: string, nextLength: string) {
    setWays(nextWays);
    setLength(nextLength);
    const hit = parsed.find(
      (p) => p.ways === nextWays && p.length === nextLength
    );
    if (hit) onSelect(hit.variant.id);
  }

  const active = parsed.find((p) => p.variant.id === selectedId);
  const price = unitPrice(product, active?.variant ?? selected);
  const thumb = selectedId
    ? thumbForVariant(product.images, selectedId)
    : null;

  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-start gap-3 rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] p-3">
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f4f2]">
          {thumb ? (
            <SafeImage
              src={thumb}
              alt=""
              fill
              sizes="64px"
              className="object-contain p-1"
            />
          ) : (
            <span className="grid h-full place-items-center text-[10px] text-ink-950/30">
              PK
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand/80">
            PK TRUSTS
          </p>
          <p className="mt-0.5 text-sm font-bold text-white">
            {ways} · {length}
          </p>
          <p className="mt-1 text-lg font-black tabular-nums text-brand">
            {formatPrice(price)}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
          How many ways?
        </p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {waysOptions.map((w) => {
            const on = ways === w;
            return (
              <button
                key={w}
                type="button"
                onClick={() => pick(w, length)}
                className={`rounded-2xl border px-2 py-3 text-center text-sm font-bold transition-all ${
                  on
                    ? "border-brand bg-brand text-ink-950 shadow-brand-glow"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:border-brand/35"
                }`}
              >
                {w.replace("-way", "")}
                <span className="mt-0.5 block text-[10px] font-semibold opacity-70">
                  way
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
          Cable length
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {lengthOptions.map((l) => {
            const on = length === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => pick(ways, l)}
                className={`rounded-2xl border px-3 py-3.5 text-center text-sm font-bold transition-all ${
                  on
                    ? "border-brand bg-brand/15 text-brand ring-1 ring-brand/30"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:border-brand/35"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const MODEL_GROUPS: { title: string; match: (m: string) => boolean }[] = [
  {
    title: "6 / 7 / 8 · single camera",
    match: (m) =>
      /iPhone (6|6s|7|8)\b/i.test(m) &&
      !/Plus/i.test(m) &&
      !/X|XR|XS|11|12|13|14|15|16/.test(m)
  },
  {
    title: "Plus · dual camera",
    match: (m) => /iPhone (6|6s|7|8)\s+Plus/i.test(m)
  },
  {
    title: "X / 11 · notch",
    match: (m) => /iPhone (X|XR|XS|11)/i.test(m)
  },
  {
    title: "12–16 · camera island",
    match: (m) => /iPhone 1[2-6]/i.test(m)
  }
];

export function FitmentPicker({
  fitment,
  value,
  onChange
}: {
  fitment: FitmentConfig;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const groups = MODEL_GROUPS.map((g) => ({
    title: g.title,
    options: fitment.options.filter(g.match)
  })).filter((g) => g.options.length > 0);

  const leftover = fitment.options.filter(
    (o) => !MODEL_GROUPS.some((g) => g.match(o))
  );
  if (leftover.length) {
    groups.push({ title: "Other", options: leftover });
  }

  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
          {fitment.label}
        </p>
        {value ? (
          <p className="text-sm font-semibold text-brand">{value}</p>
        ) : (
          <p className="text-xs text-white/35">Required</p>
        )}
      </div>

      <div className="mt-3 space-y-4">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-2 text-[11px] font-semibold text-white/35">
              {g.title}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {g.options.map((opt) => {
                const on = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange(opt)}
                    className={`rounded-pill border px-3 py-1.5 text-xs font-semibold transition-all ${
                      on
                        ? "border-brand bg-brand text-ink-950 shadow-brand-glow"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:border-brand/35 hover:text-white"
                    }`}
                  >
                    {opt.replace(/^iPhone\s+/i, "")}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

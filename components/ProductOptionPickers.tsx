"use client";

import { useMemo, useState } from "react";
import { Product, ProductImage, ProductVariant, unitPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { swatchStyle } from "@/lib/swatch";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";
import type { FitmentConfig } from "@/lib/fitment";
import { shortModelLabel } from "@/lib/fitment";
import { imagesForVariant } from "@/lib/product-images";

function isLightSwatch(hex?: string, name?: string): boolean {
  const n = (name ?? "").toLowerCase();
  if (n.includes("white") || n.includes("yellow") || n.includes("mint") || n.includes("lilac") || n.includes("grey") || n.includes("gray")) {
    return true;
  }
  if (!hex || !/^#?[0-9a-f]{6}$/i.test(hex)) return false;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

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
  fitmentModel,
  swatchesOnly = false,
  variant = "default"
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locked?: boolean;
  lockHint?: string;
  fitmentModel?: string | null;
  /** Round colour dots only — used for silicone pouches after model pick. */
  swatchesOnly?: boolean;
  variant?: "default" | "plug";
}) {
  const selected = variants.find((v) => v.id === selectedId);
  const isPlug = variant === "plug";

  if (isPlug && !swatchesOnly) {
    return (
      <div className={`mt-6 ${locked ? "opacity-55" : ""}`}>
        <h2 className="text-base font-bold text-gp-text">Choose Your Color</h2>
        <p className="mt-0.5 text-sm text-gp-text-muted">
          A color that matches your style. Designed to stand out.
        </p>
        {locked ? (
          <p className="mt-2 text-xs text-gp-text-subtle">
            {lockHint ?? "Select model first"}
          </p>
        ) : null}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {variants.map((v) => {
            const active = v.id === selectedId;
            const out = !v.available;
            return (
              <button
                key={v.id}
                type="button"
                disabled={locked}
                onClick={() => onSelect(v.id)}
                aria-pressed={active}
                title={
                  locked
                    ? lockHint ?? "Select model first"
                    : out
                      ? `${v.name} — out of stock`
                      : v.name
                }
                className={`relative inline-flex shrink-0 items-center gap-2 rounded-pill border px-3.5 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "border-ink-700 bg-white text-gp-text shadow-[0_0_0_1px_rgba(35,55,70,0.15)] ring-2 ring-ink-700/20"
                    : "border-gp-border bg-gp-muted/60 text-gp-text hover:border-gp-text-subtle"
                } ${out || locked ? "opacity-50" : ""} ${locked ? "cursor-not-allowed" : ""}`}
              >
                {out ? (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-pill"
                    aria-hidden
                  >
                    <span className="absolute left-2 right-2 top-1/2 h-px -rotate-[18deg] bg-gp-text-subtle/70" />
                  </span>
                ) : null}
                <span
                  className="relative h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10"
                  style={swatchStyle(v.colorHex, v.name)}
                />
                <span className={out ? "line-through decoration-gp-text-subtle" : ""}>
                  {v.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-5 ${locked ? "opacity-55" : ""}`}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
          {swatchesOnly ? (
            <>
              <span className="text-brand">2</span>
              <span className="mx-1.5 text-white/20">·</span>
              Colour
            </>
          ) : (
            "Colour"
          )}
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

      {swatchesOnly ? (
        <div className="mt-3 flex flex-wrap gap-2.5">
          {variants.map((v) => {
            const active = v.id === selectedId;
            const out = !v.available;
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
                className={`relative h-10 w-10 rounded-full transition-all duration-300 ease-out-expo ${
                  active
                    ? "scale-110 ring-2 ring-brand ring-offset-2 ring-offset-ink-950"
                    : "ring-1 ring-white/20 hover:scale-105 hover:ring-white/40"
                } ${out || locked ? "opacity-40" : ""} ${locked ? "cursor-not-allowed" : ""}`}
                style={swatchStyle(v.colorHex, v.name)}
              >
                {active ? (
                  <span className="absolute inset-0 grid place-items-center">
                    <Icon
                      name="check"
                      className={`h-4 w-4 drop-shadow ${
                        isLightSwatch(v.colorHex, v.name)
                          ? "text-ink-950"
                          : "text-white"
                      }`}
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
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
      )}
    </div>
  );
}

/** Generic priced option tiles (when not ways×length). */
export function PricedOptionGrid({
  product,
  variants,
  selectedId,
  onSelect,
  variant = "default"
}: {
  product: Product;
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  variant?: "default" | "plug";
}) {
  const isPlug = variant === "plug";

  if (isPlug) {
    return (
      <div className="mt-6">
        <h2 className="text-base font-bold text-gp-text">Choose Your Option</h2>
        <p className="mt-0.5 text-sm text-gp-text-muted">
          Pick the variant that fits your needs.
        </p>
        <div className="mt-3 space-y-2.5">
          {variants.map((v) => {
            const active = v.id === selectedId;
            const out = !v.available;
            const price = unitPrice(product, v);
            return (
              <button
                key={v.id}
                type="button"
                disabled={out}
                onClick={() => onSelect(v.id)}
                aria-pressed={active}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition-all ${
                  active
                    ? "border-ink-700 ring-1 ring-ink-700/15"
                    : "border-gp-border hover:border-gp-text-subtle"
                } ${out ? "opacity-45" : ""}`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gp-text">{v.name}</p>
                  <p className="mt-0.5 text-xs text-gp-text-muted">
                    {out ? "Out of stock" : "In stock · ready to ship"}
                  </p>
                </div>
                <span className="shrink-0 text-base font-bold tabular-nums text-gp-text">
                  {formatPrice(price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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

export function FitmentPicker({
  fitment,
  value,
  onChange
}: {
  fitment: FitmentConfig;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(!value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fitment.options;
    return fitment.options.filter((opt) => {
      const full = opt.toLowerCase();
      const short = shortModelLabel(opt).toLowerCase();
      return (
        full.includes(q) ||
        short.includes(q) ||
        short.replace(/\s+/g, "").includes(q.replace(/\s+/g, ""))
      );
    });
  }, [fitment.options, query]);

  function pick(opt: string) {
    onChange(opt);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="mt-6">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gp-text-muted">
          <span className="text-brand">1</span>
          <span className="mx-1.5 text-gp-border">·</span>
          Choose your iPhone
        </p>
        {!value ? (
          <p className="text-xs text-gp-text-subtle">Required</p>
        ) : null}
      </div>

      {value && !open ? (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-brand/40 bg-brand/10 px-3.5 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-ink-950">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-700/80">
              Your phone
            </p>
            <p className="truncate text-sm font-bold text-gp-text">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setQuery("");
            }}
            className="shrink-0 rounded-full border border-gp-border px-3 py-1.5 text-xs font-semibold text-gp-text-muted transition hover:border-brand/40 hover:text-ink-700"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <label className="relative mt-3 block">
            <span className="sr-only">Search iPhone model</span>
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gp-text-subtle">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type model… e.g. 17 Pro Max"
              autoComplete="off"
              autoFocus={open && Boolean(value)}
              className="w-full rounded-2xl border border-gp-border bg-white py-3.5 pl-10 pr-3.5 text-sm text-gp-text outline-none placeholder:text-gp-text-subtle focus:border-ink-700/35 focus:ring-1 focus:ring-ink-700/15"
            />
          </label>

          <div
            className="mt-2 max-h-48 overflow-y-auto overscroll-contain rounded-2xl border border-gp-border bg-white sm:max-h-56"
            role="listbox"
            aria-label={fitment.label}
          >
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gp-text-muted">
                No model matches “{query}”
              </p>
            ) : (
              filtered.map((opt) => {
                const on = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => pick(opt)}
                    className={`flex w-full items-center justify-between gap-3 border-b border-gp-border/60 px-4 py-3 text-left text-sm transition last:border-0 ${
                      on
                        ? "bg-brand/15 font-bold text-ink-700"
                        : "text-gp-text hover:bg-gp-muted hover:text-gp-text"
                    }`}
                  >
                    <span>{opt}</span>
                    {on ? (
                      <Icon name="check" className="h-4 w-4 shrink-0" />
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
          {value && open ? (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 text-xs font-semibold text-gp-text-muted hover:text-gp-text"
            >
              Cancel
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

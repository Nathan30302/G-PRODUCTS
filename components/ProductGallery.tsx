"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage, ProductVariant } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";
import { swatchStyle } from "@/lib/swatch";

const SWIPE_THRESHOLD = 40;

export function ProductGallery({
  images,
  name,
  badge
}: {
  images: ProductImage[];
  name: string;
  badge?: string | null;
}) {
  const [active, setActive] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const dragging = useRef(false);

  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const count = list.length;
  const current = list[Math.min(active, count - 1)];

  useEffect(() => {
    setActive(0);
  }, [images]);

  function go(dir: -1 | 1) {
    setActive((i) => Math.max(0, Math.min(count - 1, i + dir)));
  }

  function onPointerDown(clientX: number) {
    pointerStart.current = clientX;
    dragging.current = true;
  }

  function onPointerUp(clientX: number) {
    if (!dragging.current || pointerStart.current === null) return;
    const delta = clientX - pointerStart.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
    pointerStart.current = null;
    dragging.current = false;
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-2xl bg-ink-900/40"
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={() => {
          pointerStart.current = null;
          dragging.current = false;
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${active}-${current.url}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={current.url || null}
              alt={current.alt ?? name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-contain p-2 select-none sm:p-4"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-accent px-2.5 py-0.5 text-[11px] font-bold text-ink-950">
            {badge}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              disabled={active === 0}
              className="absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink-950/60 text-white/80 backdrop-blur-sm transition-opacity hover:bg-ink-950/80 disabled:opacity-30 sm:grid"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              disabled={active === count - 1}
              className="absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink-950/60 text-white/80 backdrop-blur-sm transition-opacity hover:bg-ink-950/80 disabled:opacity-30 sm:grid"
            >
              ›
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? "w-5 bg-white" : "w-1.5 bg-white/35"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function VariantColorPicker({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (variants.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-white/45">Colour</p>
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {variants.map((v) => {
          const active = v.id === selectedId;
          const out = !v.available;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              aria-pressed={active}
              title={out ? `${v.name} — out of stock` : v.name}
              className={`inline-flex shrink-0 items-center gap-2 rounded-pill border px-3 py-1.5 text-xs font-medium transition-all active:scale-[0.97] ${
                active
                  ? "border-brand bg-brand/15 text-white ring-1 ring-brand/30"
                  : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20"
              } ${out ? "opacity-55" : ""}`}
            >
              <span
                className={`h-3.5 w-3.5 rounded-full ring-1 ring-white/20 ${
                  out ? "grayscale" : ""
                }`}
                style={swatchStyle(v.colorHex, v.name)}
              />
              <span className={out ? "line-through decoration-white/30" : ""}>
                {v.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

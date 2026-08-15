"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductImage } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";

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
      {/* Compact portrait frame — not a full-bleed square */}
      <div
        className="relative mx-auto aspect-[4/5] w-full max-w-[19.5rem] touch-pan-y overflow-hidden rounded-[1.15rem] border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_72%)] shadow-card sm:max-w-md lg:mx-0 lg:max-w-none"
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
            key={active}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={current.url || null}
              alt={current.alt ?? name}
              fill
              sizes="(max-width: 1024px) 90vw, 28rem"
              className="pointer-events-none object-contain p-5 select-none sm:p-7"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-accent px-2.5 py-1 text-xs font-bold text-ink-950 shadow-accent-glow sm:left-4 sm:top-4 sm:px-3 sm:text-sm">
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
              className="absolute left-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-lg text-white/80 backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30 sm:left-3 sm:h-10 sm:w-10"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              disabled={active === count - 1}
              className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-950/70 text-lg text-white/80 backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-30 sm:right-3 sm:h-10 sm:w-10"
            >
              ›
            </button>
            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-pill bg-ink-950/75 px-3 py-1 text-[11px] font-semibold text-white/70 backdrop-blur-sm">
              Swipe · {active + 1}/{count}
            </p>
          </>
        )}
      </div>

      {count > 1 ? (
        <>
          <div className="mt-3 flex justify-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === active
                    ? "w-5 bg-brand"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {list.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === active}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_75%)] transition-all sm:h-16 sm:w-16 ${
                  i === active
                    ? "border-brand ring-2 ring-brand/30"
                    : "border-white/10 opacity-70 hover:opacity-100"
                }`}
              >
                <SafeImage
                  src={img.url || null}
                  alt={img.alt ?? `${name} ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

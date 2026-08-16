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
      <div
        className="relative mx-auto aspect-square w-full max-w-[20rem] touch-pan-y overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_72%)] shadow-card sm:max-w-md lg:mx-0 lg:max-w-none"
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
              className="pointer-events-none object-contain p-6 select-none sm:p-8"
              priority
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-pill bg-brand px-2.5 py-1 text-[11px] font-extrabold text-ink-950 shadow-brand-glow sm:left-4 sm:top-4 sm:text-xs">
            Save {badge.replace(/^-/, "")}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              disabled={active === 0}
              className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-ink-950/65 text-base text-white/75 backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-25 sm:left-3 sm:h-9 sm:w-9"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              disabled={active === count - 1}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-ink-950/65 text-base text-white/75 backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-25 sm:right-3 sm:h-9 sm:w-9"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Plug-style segment progress under the photo */}
      {count > 1 ? (
        <div className="mx-auto mt-3 flex max-w-[20rem] gap-1.5 sm:max-w-md lg:mx-0 lg:max-w-none">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i === active ? "bg-brand" : "bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      ) : null}

      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_75%)] transition-all sm:h-14 sm:w-14 ${
                i === active
                  ? "border-brand ring-2 ring-brand/25"
                  : "border-white/10 opacity-65 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={img.url || null}
                alt={img.alt ?? `${name} ${i + 1}`}
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

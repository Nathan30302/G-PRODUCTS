"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductImage, ProductVariant } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";
import { swatchStyle } from "@/lib/swatch";

const SWIPE = 42;

export function ProductGallery({
  images,
  name,
  badge,
  showingLabel
}: {
  images: ProductImage[];
  name: string;
  badge?: string | null;
  showingLabel?: string | null;
}) {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const moved = useRef(false);
  const widthRef = useRef(1);
  const frameRef = useRef<HTMLDivElement>(null);

  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const count = list.length;
  const index = Math.min(active, count - 1);

  useEffect(() => {
    setActive(0);
    setDragX(0);
  }, [images]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => Math.max(0, Math.min(count - 1, i + dir)));
      setDragX(0);
    },
    [count]
  );

  function onDown(clientX: number, clientY: number) {
    startX.current = clientX;
    startY.current = clientY;
    moved.current = false;
    setDragging(true);
    widthRef.current = frameRef.current?.offsetWidth || 1;
  }

  function onMove(clientX: number, clientY: number) {
    if (!dragging) return;
    const dx = clientX - startX.current;
    const dy = clientY - startY.current;
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved.current = true;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDragX(dx);
    }
  }

  function onUp(clientX: number) {
    if (!dragging) return;
    const dx = clientX - startX.current;
    setDragging(false);
    if (Math.abs(dx) >= SWIPE) {
      go(dx < 0 ? 1 : -1);
    } else {
      setDragX(0);
      if (!moved.current) setLightbox(true);
    }
  }

  const slidePct = 100 / count;
  const offset = -index * slidePct + (dragX / widthRef.current) * slidePct;

  return (
    <div className="w-full">
      {showingLabel ? (
        <p className="mb-2 text-xs font-medium text-white/55">
          Showing: <span className="text-white/85">{showingLabel}</span>
        </p>
      ) : null}

      <div
        ref={frameRef}
        className="relative aspect-square touch-pan-y overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-white"
        onTouchStart={(e) => onDown(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={(e) => onUp(e.changedTouches[0].clientX)}
        onMouseDown={(e) => onDown(e.clientX, e.clientY)}
        onMouseMove={(e) => onMove(e.clientX, e.clientY)}
        onMouseUp={(e) => onUp(e.clientX)}
        onMouseLeave={() => {
          if (dragging) {
            setDragging(false);
            setDragX(0);
          }
        }}
      >
        <div
          className="flex h-full"
          style={{
            width: `${count * 100}%`,
            transform: `translateX(${offset}%)`,
            transition: dragging ? "none" : "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {list.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="relative h-full shrink-0"
              style={{ width: `${100 / count}%` }}
            >
              <SafeImage
                src={img.url || null}
                alt={img.alt ?? name}
                fill
                sizes="(max-width: 640px) 80vw, 360px"
                className="pointer-events-none object-contain p-3 select-none sm:p-4"
                priority={i === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {badge && (
          <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-pill bg-accent px-2 py-0.5 text-[10px] font-bold text-ink-950">
            {badge}
          </span>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              disabled={index === 0}
              className="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink-950/55 text-lg text-white backdrop-blur-sm disabled:opacity-25"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              disabled={index === count - 1}
              className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ink-950/55 text-lg text-white backdrop-blur-sm disabled:opacity-25"
            >
              ›
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
              {list.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-ink-950" : "w-1.5 bg-ink-950/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <span className="pointer-events-none absolute right-2.5 top-2.5 rounded-pill bg-ink-950/55 px-2 py-0.5 text-[10px] font-semibold text-white/80">
          Tap to zoom
        </span>
      </div>

      {count > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          {list.map((img, i) => (
            <button
              key={`${img.url}-thumb-${i}`}
              type="button"
              aria-label={`View image ${i + 1}`}
              aria-current={i === index}
              onClick={() => {
                setActive(i);
                setDragX(0);
              }}
              className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white transition-all ${
                i === index
                  ? "border-brand ring-1 ring-brand/40"
                  : "border-white/10 opacity-70 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={img.url || null}
                alt=""
                fill
                sizes="48px"
                className="object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <PhotoLightbox
          images={list}
          name={name}
          start={index}
          onClose={() => setLightbox(false)}
          onIndex={setActive}
        />
      )}
    </div>
  );
}

function PhotoLightbox({
  images,
  name,
  start,
  onClose,
  onIndex
}: {
  images: ProductImage[];
  name: string;
  start: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const [i, setI] = useState(start);
  const [scale, setScale] = useState(1);
  const pinch0 = useRef(0);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function step(dir: -1 | 1) {
    setI((cur) => {
      const next = Math.max(0, Math.min(images.length - 1, cur + dir));
      onIndex(next);
      setScale(1);
      return next;
    });
  }

  function pinchDist(e: React.TouchEvent) {
    const a = e.touches[0];
    const b = e.touches[1];
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  const img = images[i];

  return (
    <div
      className="fixed inset-0 z-[80] bg-ink-950/95"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl text-white"
        aria-label="Close photos"
      >
        ×
      </button>
      <p className="absolute left-4 top-5 text-sm font-medium text-white/70">
        {i + 1} / {images.length}
      </p>

      <div
        className="flex h-full items-center justify-center px-3 pb-16 pt-16"
        onTouchStart={(e) => {
          if (e.touches.length === 2) pinch0.current = pinchDist(e);
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinch0.current) {
            e.preventDefault();
            const next = Math.min(3.2, Math.max(1, pinchDist(e) / pinch0.current));
            setScale(next);
          }
        }}
        onTouchEnd={() => {
          pinch0.current = 0;
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative h-full w-full max-w-3xl">
          <SafeImage
            src={img.url || null}
            alt={img.alt ?? name}
            fill
            sizes="100vw"
            className="object-contain"
            style={{ transform: `scale(${scale})`, transition: "transform 0.12s ease-out" }}
            unoptimized
          />
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            disabled={i === 0}
            onClick={() => step(-1)}
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white disabled:opacity-25"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={i === images.length - 1}
            onClick={() => step(1)}
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white disabled:opacity-25"
          >
            ›
          </button>
        </>
      )}
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
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="mt-4">
      <p className="text-xs font-medium text-white/45">
        {variants.length > 1 ? "Pick a colour" : "Colour"}
        {selected ? (
          <>
            {" "}
            · <span className="text-white/80">{selected.name}</span>
            {!selected.available ? " · Out of stock" : ""}
          </>
        ) : null}
      </p>
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

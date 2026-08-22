"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { animate, motion, useMotionValue, type PanInfo } from "framer-motion";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.85 };

export function ServiceGallery({
  images,
  name,
  badge
}: {
  images: string[];
  name: string;
  badge?: string | null;
}) {
  const list = images.filter(Boolean);
  const count = Math.max(list.length, 1);
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const index = Math.min(active, count - 1);

  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [images]);

  useEffect(() => {
    if (!width) return;
    animate(x, -index * width, SPRING);
  }, [index, width, x]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => Math.max(0, Math.min(count - 1, i + dir)));
    },
    [count]
  );

  function onDragEnd(_: unknown, info: PanInfo) {
    if (!width || count < 2) return;
    const swipe =
      Math.abs(info.offset.x) > width * 0.18 || Math.abs(info.velocity.x) > 450;
    if (swipe) {
      if (info.offset.x < 0 || info.velocity.x < -450) go(1);
      else go(-1);
    } else {
      animate(x, -index * width, SPRING);
    }
  }

  const src = list[index] ?? null;

  return (
    <div className="w-full">
      <div
        ref={frameRef}
        className="group relative aspect-[4/3] touch-pan-y overflow-hidden rounded-[1.35rem] border border-white/[0.08] bg-ink-850 shadow-card"
      >
        {list.length > 0 ? (
          <motion.div
            className="absolute inset-0 flex cursor-grab active:cursor-grabbing"
            style={{
              width: width ? width * count : "100%",
              x
            }}
            drag={count > 1 && width ? "x" : false}
            dragElastic={0.14}
            dragConstraints={
              width
                ? { left: -width * (count - 1), right: 0 }
                : undefined
            }
            onDragEnd={onDragEnd}
          >
            {list.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative h-full shrink-0"
                style={{ width: width || "100%" }}
              >
                <SafeImage
                  src={url}
                  alt={`${name} — photo ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="pointer-events-none select-none object-cover"
                  priority={i === 0}
                  draggable={false}
                  quality={90}
                />
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-ink-800 to-ink-950">
            <span className="text-sm text-white/40">No photos yet</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />

        {badge ? (
          <span className="absolute left-3 top-3 z-[2] rounded-pill bg-brand px-2.5 py-1 text-xs font-bold text-ink-950 shadow-brand-glow">
            {badge}
          </span>
        ) : null}

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              disabled={index === 0}
              onClick={() => go(-1)}
              className="absolute left-2.5 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-950/55 text-white shadow-lg backdrop-blur-md transition-opacity disabled:opacity-20"
            >
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              disabled={index === count - 1}
              onClick={() => go(1)}
              className="absolute right-2.5 top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-950/55 text-white shadow-lg backdrop-blur-md transition-opacity disabled:opacity-20"
            >
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 z-[2] flex justify-center gap-1.5">
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to photo ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-brand" : "w-1.5 bg-white/35"
                  }`}
                />
              ))}
            </div>
            <span className="pointer-events-none absolute right-3 top-3 z-[2] rounded-pill bg-ink-950/60 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white/85 backdrop-blur-sm">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {list.map((url, i) => (
            <button
              key={`thumb-${url}-${i}`}
              type="button"
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index}
              onClick={() => setActive(i)}
              className={`relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                i === index
                  ? "border-brand ring-2 ring-brand/35"
                  : "border-white/10 opacity-65 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={url || src}
                alt=""
                fill
                sizes="72px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  animate,
  type PanInfo
} from "framer-motion";
import { ProductImage, ProductVariant } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";
import { swatchStyle } from "@/lib/swatch";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.85 };

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
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const x = useMotionValue(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const count = list.length;
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

  useEffect(() => {
    thumbRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  }, [index]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setActive((i) => Math.max(0, Math.min(count - 1, i + dir)));
    },
    [count]
  );

  const jump = useCallback((i: number) => {
    setActive(Math.max(0, Math.min(count - 1, i)));
  }, [count]);

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

  return (
    <div className="w-full">
      {showingLabel ? (
        <p className="mb-2.5 text-xs font-medium text-white/50">
          Showing{" "}
          <span className="text-white/85">{showingLabel}</span>
        </p>
      ) : null}

      <div className="flex gap-3 lg:gap-4">
        {/* Desktop vertical filmstrip */}
        {count > 1 ? (
          <div className="hidden max-h-[min(100%,28rem)] w-[4.25rem] shrink-0 flex-col gap-2 overflow-y-auto py-0.5 no-scrollbar xl:flex">
            {list.map((img, i) => (
              <Thumb
                key={`${img.url}-v-${i}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                img={img}
                name={name}
                active={i === index}
                onSelect={() => jump(i)}
                size="lg"
              />
            ))}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          <div
            ref={frameRef}
            className="group relative aspect-[4/5] max-h-[min(72vw,22rem)] touch-pan-y overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-[#f4f4f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_16px_40px_-24px_rgba(0,0,0,0.5)] sm:max-h-[26rem] lg:max-h-[min(34rem,58vh)] lg:rounded-[1.5rem]"
          >
            {/* Soft studio wash */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#ffffff_0%,#ececeb_55%,#e2e2df_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,23,32,0.06)_100%)]" />

            <motion.div
              className="relative z-[1] flex h-full cursor-grab active:cursor-grabbing"
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
              onTap={() => setLightbox(true)}
            >
              {list.map((img, i) => (
                <div
                  key={`${img.url}-${i}`}
                  className="relative h-full shrink-0"
                  style={{ width: width || "100%" }}
                >
                  <SafeImage
                    src={img.url || null}
                    alt={img.alt ?? name}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1280px) 50vw, 560px"
                    className="pointer-events-none select-none object-contain p-4 sm:p-6 lg:p-8"
                    priority={i === 0}
                    draggable={false}
                    quality={90}
                  />
                </div>
              ))}
            </motion.div>

            {badge ? (
              <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-pill bg-accent px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink-950 shadow-sm">
                {badge}
              </span>
            ) : null}

            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="absolute bottom-3 right-3 z-[2] grid h-10 w-10 place-items-center rounded-full border border-ink-950/10 bg-ink-950/70 text-white shadow-lg backdrop-blur-md transition-all hover:bg-ink-950/85"
              aria-label="View full-size photo"
            >
              <Icon name="expand" className="h-4 w-4" />
            </button>

            {count > 1 ? (
              <>
                <NavBtn
                  side="left"
                  disabled={index === 0}
                  onClick={() => go(-1)}
                />
                <NavBtn
                  side="right"
                  disabled={index === count - 1}
                  onClick={() => go(1)}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[2] flex justify-center gap-1.5 xl:hidden">
                  {list.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === index
                          ? "w-6 bg-ink-950"
                          : "w-1.5 bg-ink-950/25"
                      }`}
                    />
                  ))}
                </div>

                <span className="pointer-events-none absolute left-3 bottom-3 z-[2] hidden rounded-pill bg-ink-950/55 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white/85 backdrop-blur-sm xl:inline">
                  {index + 1} / {count}
                </span>
              </>
            ) : null}
          </div>

          {/* Mobile / tablet horizontal filmstrip */}
          {count > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar xl:hidden">
              {list.map((img, i) => (
                <Thumb
                  key={`${img.url}-h-${i}`}
                  ref={(el) => {
                    thumbRefs.current[i] = el;
                  }}
                  img={img}
                  name={name}
                  active={i === index}
                  onSelect={() => jump(i)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {lightbox ? (
          <PhotoLightbox
            images={list}
            name={name}
            start={index}
            onClose={() => setLightbox(false)}
            onIndex={setActive}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function NavBtn({
  side,
  disabled,
  onClick
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`absolute top-1/2 z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-950/55 text-white shadow-lg backdrop-blur-md transition-all duration-300 disabled:opacity-20 lg:opacity-0 lg:group-hover:opacity-100 ${
        side === "left" ? "left-2.5" : "right-2.5"
      } opacity-100`}
    >
      <Icon
        name={side === "left" ? "chevron-left" : "chevron-right"}
        className="h-5 w-5"
      />
    </button>
  );
}

const Thumb = forwardRef<
  HTMLButtonElement,
  {
    img: ProductImage;
    name: string;
    active: boolean;
    onSelect: () => void;
    size?: "md" | "lg";
  }
>(function Thumb({ img, name, active, onSelect, size = "md" }, ref) {
  const dim = size === "lg" ? "h-[3.85rem] w-[3.85rem]" : "h-14 w-14";
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`View ${name} photo`}
      aria-current={active}
      onClick={onSelect}
      className={`relative ${dim} shrink-0 overflow-hidden rounded-xl border bg-[#f4f4f2] transition-all duration-300 ease-out-expo ${
        active
          ? "border-brand shadow-[0_0_0_1px_rgba(246,212,0,0.45)] ring-2 ring-brand/35"
          : "border-white/10 opacity-65 hover:opacity-100"
      }`}
    >
      <SafeImage
        src={img.url || null}
        alt=""
        fill
        sizes="64px"
        className="object-contain p-1"
      />
    </button>
  );
});

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const x = useMotionValue(0);

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

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!stageW) return;
    animate(x, -i * stageW, SPRING);
  }, [i, stageW, x]);

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

  function onDragEnd(_: unknown, info: PanInfo) {
    if (scale > 1.05 || !stageW || images.length < 2) {
      animate(x, -i * stageW, SPRING);
      return;
    }
    const swipe =
      Math.abs(info.offset.x) > stageW * 0.15 ||
      Math.abs(info.velocity.x) > 500;
    if (swipe) {
      if (info.offset.x < 0 || info.velocity.x < -500) step(1);
      else step(-1);
    } else {
      animate(x, -i * stageW, SPRING);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col bg-ink-950/92 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label={`${name} photos`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="relative z-10 flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Gallery
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white/80">
            {i + 1}{" "}
            <span className="text-white/35">/ {images.length}</span>
            <span className="mx-2 text-white/20">·</span>
            <span className="font-medium text-white/45">{name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScale((s) => (s > 1 ? 1 : 1.75))}
            className="rounded-pill border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/75 transition-colors hover:border-brand/40 hover:text-brand"
          >
            {scale > 1 ? "Reset zoom" : "Zoom"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Close photos"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        onTouchStart={(e) => {
          if (e.touches.length === 2) pinch0.current = pinchDist(e);
        }}
        onTouchMove={(e) => {
          if (e.touches.length === 2 && pinch0.current) {
            e.preventDefault();
            setScale(
              Math.min(3.2, Math.max(1, pinchDist(e) / pinch0.current))
            );
          }
        }}
        onTouchEnd={() => {
          pinch0.current = 0;
        }}
        onWheel={(e) => {
          if (!e.ctrlKey && Math.abs(e.deltaY) < 40) return;
          e.preventDefault();
          setScale((s) =>
            Math.min(3.2, Math.max(1, s + (e.deltaY < 0 ? 0.15 : -0.15)))
          );
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          className="flex h-full cursor-grab active:cursor-grabbing"
          style={{
            width: stageW ? stageW * images.length : "100%",
            x
          }}
          drag={images.length > 1 && stageW && scale <= 1.05 ? "x" : false}
          dragElastic={0.12}
          dragConstraints={
            stageW
              ? { left: -stageW * (images.length - 1), right: 0 }
              : undefined
          }
          onDragEnd={onDragEnd}
        >
          {images.map((img, idx) => (
            <div
              key={`${img.url}-lb-${idx}`}
              className="relative flex h-full shrink-0 items-center justify-center px-4 sm:px-10"
              style={{ width: stageW || "100%" }}
            >
              <motion.div
                className="relative h-[min(82vh,820px)] w-full max-w-5xl"
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              >
                <SafeImage
                  src={img.url || null}
                  alt={img.alt ?? name}
                  fill
                  sizes="100vw"
                  className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  unoptimized
                  quality={95}
                />
              </motion.div>
            </div>
          ))}
        </motion.div>

        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous"
              disabled={i === 0}
              onClick={() => step(-1)}
              className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-md disabled:opacity-25 sm:left-6"
            >
              <Icon name="chevron-left" className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Next"
              disabled={i === images.length - 1}
              onClick={() => step(1)}
              className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/[0.07] text-white backdrop-blur-md disabled:opacity-25 sm:right-6"
            >
              <Icon name="chevron-right" className="h-6 w-6" />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="relative z-10 flex justify-center gap-2 overflow-x-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={`${img.url}-film-${idx}`}
              type="button"
              aria-current={idx === i}
              onClick={() => {
                setI(idx);
                onIndex(idx);
                setScale(1);
              }}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[#f4f4f2] transition-all ${
                idx === i
                  ? "border-brand ring-2 ring-brand/40"
                  : "border-white/10 opacity-55 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={img.url || null}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      ) : null}
    </motion.div>
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

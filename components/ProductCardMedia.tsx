"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/lib/types";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";

const SWIPE_THRESHOLD = 36;

/** Compact product photo area — swipe when multiple images exist. */
export function ProductCardMedia({
  href,
  images,
  name,
  soldOut,
  priority,
  dealLabel
}: {
  href: string;
  images: ProductImage[];
  name: string;
  soldOut?: boolean;
  priority?: boolean;
  dealLabel?: string | null;
}) {
  const list = images.length > 0 ? images : [{ url: "", alt: name }];
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const locked = useRef(false);

  const current = list[Math.min(active, list.length - 1)];
  const multi = list.length > 1;

  function go(dir: -1 | 1) {
    setActive((i) => Math.max(0, Math.min(list.length - 1, i + dir)));
  }

  function onPointerDown(x: number) {
    if (!multi) return;
    startX.current = x;
    locked.current = false;
  }

  function onTouchMove(x: number) {
    if (startX.current === null || !multi) return;
    if (Math.abs(x - startX.current) > 10) {
      locked.current = true;
    }
  }

  function onPointerUp(x: number) {
    if (startX.current === null || !multi) return;
    const delta = x - startX.current;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
    startX.current = null;
  }

  return (
    <div className="relative block overflow-hidden">
      <Link
        href={href}
        className="relative block"
        onClick={(e) => {
          if (locked.current) {
            e.preventDefault();
            locked.current = false;
          }
        }}
        draggable={false}
      >
        {/* Shorter than square — Plug-style compact product frame */}
        <div
          className="relative aspect-[4/5] bg-[radial-gradient(ellipse_at_center,_#123b43_0%,_#06181c_70%)]"
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onTouchMove(e.touches[0].clientX)}
          onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
          onMouseDown={(e) => onPointerDown(e.clientX)}
          onMouseUp={(e) => onPointerUp(e.clientX)}
          onMouseLeave={() => {
            startX.current = null;
          }}
        >
          <SafeImage
            src={current.url || null}
            alt={current.alt ?? name}
            fill
            priority={priority}
            quality={78}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 13rem, 14rem"
            className={`object-contain p-3 transition-transform duration-500 ease-out-expo group-hover:scale-[1.03] sm:p-3.5 ${
              soldOut ? "opacity-55 saturate-50" : ""
            }`}
            draggable={false}
          />
        </div>
      </Link>

      {dealLabel ? (
        <span className="pointer-events-none absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-pill bg-gradient-to-r from-brand to-accent px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-950 sm:bottom-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[10px]">
          <Icon name="bolt" className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          {dealLabel}
        </span>
      ) : null}

      {multi ? (
        <div className="pointer-events-none absolute bottom-2.5 right-2.5 flex gap-1 sm:bottom-3 sm:right-3">
          {list.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === active ? "w-3.5 bg-brand" : "w-1 bg-white/35"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

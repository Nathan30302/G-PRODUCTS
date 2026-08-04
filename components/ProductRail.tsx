"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icons";

export function ProductRail({
  title,
  subtitle,
  products,
  href,
  hrefLabel = "View all",
  accent = "brand"
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  hrefLabel?: string;
  accent?: "brand" | "accent";
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (products.length === 0) return null;

  void accent;

  return (
    <section className="container-g mt-20 sm:mt-24">
      <div className="mb-6 flex flex-col items-center text-center">
        <h2 className="display text-2xl sm:text-3xl">{title}</h2>
        {subtitle ? (
          <p className="mt-2 max-w-md text-sm text-white/45">{subtitle}</p>
        ) : null}
        {href ? (
          <Link
            href={href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-white/45 transition-colors hover:text-brand"
          >
            {hrefLabel}
            <Icon name="chevron-right" className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-ink-950 to-transparent transition-opacity sm:w-12 ${
            atStart ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-ink-950 to-transparent transition-opacity sm:w-12 ${
            atEnd ? "opacity-0" : "opacity-100"
          }`}
        />
        <div className="absolute -top-12 right-0 hidden items-center gap-2 lg:flex">
          <button
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Scroll left"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="chevron-left" className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Scroll right"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-all hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Icon name="chevron-right" className="h-4 w-4" />
          </button>
        </div>
        <div
          ref={scroller}
          className="no-scrollbar snap-rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {products.map((p, i) => (
            <div
              key={p.id}
              className="snap-item w-[68vw] shrink-0 sm:w-64 lg:w-[19rem]"
            >
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

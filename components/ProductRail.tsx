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

  const eye =
    accent === "accent" ? "text-accent" : "text-brand/80";

  return (
    <section className="container-g mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${eye}`}>
            Catalogue
          </p>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-white/50">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {href && (
            <Link
              href={href}
              className="hidden shrink-0 items-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:border-brand/40 hover:text-brand sm:inline-flex"
            >
              {hrefLabel}
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          )}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Scroll left"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/80 transition-all hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="chevron-left" className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Scroll right"
              className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/80 transition-all hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Icon name="chevron-right" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar snap-rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-item w-[62vw] shrink-0 sm:w-64 lg:w-[19rem]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {href && (
        <div className="mt-5 sm:hidden">
          <Link
            href={href}
            className="flex items-center justify-center gap-1 rounded-pill border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-white/80"
          >
            {hrefLabel}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

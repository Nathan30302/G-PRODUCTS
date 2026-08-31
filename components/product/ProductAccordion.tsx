"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/Icons";

export function ProductAccordion({
  title,
  children,
  defaultOpen = false
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gp-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
      >
        <span className="text-base font-bold text-gp-text">{title}</span>
        <Icon
          name="chevron-down"
          className={`h-5 w-5 shrink-0 text-gp-text transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <div className="pb-5 text-sm leading-relaxed text-gp-text-muted">
          {children}
        </div>
      ) : null}
    </div>
  );
}

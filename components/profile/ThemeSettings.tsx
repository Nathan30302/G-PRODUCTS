"use client";

import { useTheme } from "@/lib/theme";
import { Icon } from "@/components/Icons";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <section className="gp-card mt-8 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
            <Icon name="sparkles" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display heading-section">Appearance</h2>
            <p className="text-subtitle mt-1">
              Light stays calm. Bloom is bright and moving. Words and photos stay easy to read.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-gp-border bg-gp-muted/60 p-1.5">
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-pressed={theme === "light"}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            theme === "light"
              ? "bg-gp-surface text-gp-text shadow-card ring-1 ring-gp-border/80"
              : "text-gp-text-muted hover:text-gp-text"
          }`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme("bloom")}
          aria-pressed={theme === "bloom"}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            theme === "bloom"
              ? "bg-brand/30 text-ink-950 shadow-card ring-1 ring-brand/50"
              : "text-gp-text-muted hover:text-gp-text"
          }`}
        >
          Bloom
        </button>
      </div>
    </section>
  );
}

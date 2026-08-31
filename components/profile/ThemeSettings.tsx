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
              Switch between light and dark. Text and buttons stay readable in
              both modes.
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
          onClick={() => setTheme("dark")}
          aria-pressed={theme === "dark"}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
            theme === "dark"
              ? "bg-gp-muted text-gp-text shadow-card ring-1 ring-gp-border/80"
              : "text-gp-text-muted hover:text-gp-text"
          }`}
        >
          Dark
        </button>
      </div>
    </section>
  );
}

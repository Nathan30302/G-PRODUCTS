"use client";

import { useDeskTheme, type DeskThemeMode } from "@/lib/desk-theme";

const options: {
  id: DeskThemeMode;
  label: string;
  hint: string;
  swatch: string;
}[] = [
  {
    id: "day",
    label: "Day",
    hint: "Bright & clean",
    swatch: "bg-[#f7f8f6] ring-1 ring-[#d8ddd9]"
  },
  {
    id: "midnight",
    label: "Midnight",
    hint: "Soft dark green",
    swatch: "bg-[#0f1614] ring-1 ring-[#3a4a45]"
  },
  {
    id: "ink",
    label: "Ink Live",
    hint: "Navy + moving light",
    swatch: "bg-[#0d1822] ring-1 ring-[#E5F34F]/60"
  },
  {
    id: "studio",
    label: "Studio Live",
    hint: "Warm light in motion",
    swatch: "bg-[#e8e0d4] ring-1 ring-[#c8a45a]/50"
  }
];

export function DeskThemeSettings({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useDeskTheme();

  return (
    <section className={compact ? "" : "gp-card shadow-card"}>
      {!compact ? (
        <div>
          <h2 className="display heading-section">Desk appearance</h2>
          <p className="text-subtitle mt-1">
            Four looks for the provider desk. Day and Midnight stay calm. Ink
            Live and Studio Live add soft motion — text stays easy to read in
            every mode.
          </p>
        </div>
      ) : (
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
          Desk theme
        </p>
      )}

      <div
        className={`grid grid-cols-2 gap-2 ${compact ? "mt-2" : "mt-5"}`}
      >
        {options.map((opt) => {
          const active = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={active}
              className={`rounded-2xl border px-2.5 py-3 text-left transition-all duration-200 ease-out-expo active:scale-[0.98] ${
                active
                  ? "border-brand/60 bg-brand/15 shadow-sm ring-1 ring-brand/30"
                  : "border-gp-border bg-gp-muted/40 hover:border-ink-700/25 hover:bg-gp-muted"
              }`}
            >
              <span
                className={`mb-2 block h-8 w-full rounded-xl ${opt.swatch}`}
              />
              <span className="block text-xs font-bold text-gp-text sm:text-sm">
                {opt.label}
              </span>
              {!compact ? (
                <span className="mt-0.5 block text-[10px] leading-snug text-gp-text-muted">
                  {opt.hint}
                </span>
              ) : (
                <span className="mt-0.5 block text-[10px] text-gp-text-subtle">
                  {opt.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useDeskTheme, type DeskThemeMode } from "@/lib/desk-theme";
import { Icon } from "@/components/Icons";

const options: {
  id: DeskThemeMode;
  label: string;
  hint: string;
  swatch: string;
}[] = [
  {
    id: "light",
    label: "Light",
    hint: "Clean white desk",
    swatch: "bg-white ring-gp-border"
  },
  {
    id: "dark",
    label: "Dark",
    hint: "Easy on the eyes",
    swatch: "bg-[#121a18] ring-gp-border"
  },
  {
    id: "brand",
    label: "G-Products",
    hint: "Slate green brand",
    swatch: "bg-[#233746] ring-brand/40"
  }
];

export function DeskThemeSettings({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useDeskTheme();

  return (
    <section className={compact ? "" : "gp-card shadow-card"}>
      {!compact ? (
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gp-muted text-ink-700 ring-1 ring-gp-border">
            <Icon name="sparkles" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="display heading-section">Desk appearance</h2>
            <p className="text-subtitle mt-1">
              Choose light, dark, or G-Products green. Text stays readable in
              every mode.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gp-text-subtle">
          Desk theme
        </p>
      )}

      <div
        className={`grid grid-cols-3 gap-2 rounded-2xl border border-gp-border bg-gp-muted/60 p-1.5 ${
          compact ? "mt-2" : "mt-5"
        }`}
      >
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setTheme(opt.id)}
            aria-pressed={theme === opt.id}
            className={`rounded-xl px-2 py-3 text-center transition-all sm:px-3 ${
              theme === opt.id
                ? "bg-gp-surface text-gp-text shadow-card ring-1 ring-gp-border/80"
                : "text-gp-text-muted hover:text-gp-text"
            }`}
          >
            <span
              className={`mx-auto mb-2 block h-7 w-7 rounded-full ring-1 ${opt.swatch}`}
            />
            <span className="block text-xs font-bold sm:text-sm">{opt.label}</span>
            {!compact ? (
              <span className="mt-0.5 block text-[10px] leading-snug text-gp-text-subtle">
                {opt.hint}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}

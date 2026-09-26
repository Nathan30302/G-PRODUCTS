"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

/** Four bright desk looks — dark text on light surfaces. */
export type DeskThemeMode = "day" | "glow" | "fresh" | "studio";

const STORAGE_KEY = "gp-desk-theme";

const VALID: DeskThemeMode[] = ["day", "glow", "fresh", "studio"];

function normalizeTheme(raw: string | null): DeskThemeMode {
  if (!raw) return "day";
  if (raw === "light") return "day";
  if (raw === "dark" || raw === "midnight") return "glow";
  if (raw === "brand" || raw === "ink") return "fresh";
  if (VALID.includes(raw as DeskThemeMode)) return raw as DeskThemeMode;
  return "day";
}

type DeskThemeContextValue = {
  theme: DeskThemeMode;
  setTheme: (theme: DeskThemeMode) => void;
};

const DeskThemeContext = createContext<DeskThemeContextValue | null>(null);

export function DeskThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DeskThemeMode>("day");

  useEffect(() => {
    try {
      const next = normalizeTheme(localStorage.getItem(STORAGE_KEY));
      setThemeState(next);
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private browsing */
    }
  }, []);

  const setTheme = useCallback((next: DeskThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private browsing */
    }
  }, []);

  return (
    <DeskThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </DeskThemeContext.Provider>
  );
}

export function useDeskTheme() {
  const ctx = useContext(DeskThemeContext);
  if (!ctx) {
    throw new Error("useDeskTheme must be used within DeskThemeProvider");
  }
  return ctx;
}

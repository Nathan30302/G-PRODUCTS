"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

/** Four desk looks — every mode keeps high-contrast text. */
export type DeskThemeMode = "day" | "midnight" | "ink" | "studio";

const STORAGE_KEY = "gp-desk-theme";

const VALID: DeskThemeMode[] = ["day", "midnight", "ink", "studio"];

function normalizeTheme(raw: string | null): DeskThemeMode {
  if (!raw) return "day";
  if (raw === "light") return "day";
  if (raw === "dark") return "midnight";
  if (raw === "brand") return "ink";
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
      setThemeState(normalizeTheme(localStorage.getItem(STORAGE_KEY)));
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

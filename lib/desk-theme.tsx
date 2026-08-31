"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

export type DeskThemeMode = "light" | "dark" | "brand";

const STORAGE_KEY = "gp-desk-theme";

type DeskThemeContextValue = {
  theme: DeskThemeMode;
  setTheme: (theme: DeskThemeMode) => void;
};

const DeskThemeContext = createContext<DeskThemeContextValue | null>(null);

export function DeskThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<DeskThemeMode>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const initial: DeskThemeMode =
        stored === "dark" || stored === "brand" ? stored : "light";
      setThemeState(initial);
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

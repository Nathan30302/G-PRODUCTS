"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/Icons";
import { SafeImage } from "@/components/SafeImage";

type Toast = {
  id: number;
  title: string;
  description?: string;
  image?: string;
  href?: string;
  hrefLabel?: string;
};

type ToastInput = Omit<Toast, "id">;

type ToastContextValue = {
  toast: (t: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: ToastInput) => {
      const id = ++idRef.current;
      setToasts((list) => [...list.slice(-2), { ...t, id }]);
      setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--mobile-nav-offset)+1rem)] z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:left-auto md:right-6 md:items-end md:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-ink-850/95 p-3 pr-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.04] backdrop-blur-xl"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                {t.image ? (
                  <span className="relative h-10 w-10 overflow-hidden rounded-full">
                    <SafeImage
                      src={t.image}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <Icon name="check" className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {t.title}
                </p>
                {t.description && (
                  <p className="truncate text-xs text-white/50">
                    {t.description}
                  </p>
                )}
              </div>
              {t.href && (
                <Link
                  href={t.href}
                  className="shrink-0 rounded-pill bg-brand px-3 py-1.5 text-xs font-bold text-ink-950 transition-colors hover:bg-brand-soft"
                >
                  {t.hrefLabel ?? "View"}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

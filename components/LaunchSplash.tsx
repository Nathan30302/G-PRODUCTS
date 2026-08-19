"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const STORAGE = {
  shop: "gproducts-splash-v1",
  admin: "gproducts-admin-splash-v1"
} as const;

const COPY = {
  shop: {
    eyebrow: "Welcome to",
    title: siteConfig.name,
    line: siteConfig.tagline
  },
  admin: {
    eyebrow: "Provider desk",
    title: siteConfig.name,
    line: "Manage your catalogue with confidence"
  }
} as const;

function VisualizerBars() {
  return (
    <div
      className="flex h-16 items-end justify-center gap-[3px] px-8 opacity-70 sm:h-20"
      aria-hidden
    >
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-brand/20 via-brand/70 to-accent/80 sm:w-1"
          initial={{ height: "18%" }}
          animate={{
            height: [
              `${14 + (i % 5) * 8}%`,
              `${55 + (i % 7) * 5}%`,
              `${22 + (i % 4) * 10}%`,
              `${40 + (i % 6) * 6}%`
            ]
          }}
          transition={{
            duration: 1.1 + (i % 8) * 0.08,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: i * 0.03
          }}
        />
      ))}
    </div>
  );
}

function AmbientOrbs() {
  return (
    <>
      <motion.div
        className="absolute -left-[15%] top-[8%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full bg-brand/25 blur-[90px]"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 24, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[10%] top-[28%] h-[min(55vw,22rem)] w-[min(55vw,22rem)] rounded-full bg-accent/20 blur-[80px]"
        animate={{ x: [0, -36, 18, 0], y: [0, 28, -18, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[20%] h-[min(45vw,18rem)] w-[min(45vw,18rem)] rounded-full bg-teal-400/15 blur-[70px]"
        animate={{ x: [0, 24, -28, 0], y: [0, -22, 16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 120%, rgba(246,212,0,0.12), transparent 55%)"
        }}
        animate={{ opacity: [0.25, 0.45, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
      />
    </>
  );
}

export function LaunchSplash({ variant }: { variant: "shop" | "admin" }) {
  const [phase, setPhase] = useState<"idle" | "show" | "exit" | "done">("idle");
  const copy = COPY[variant];

  useEffect(() => {
    const key = STORAGE[variant];
    try {
      if (sessionStorage.getItem(key) === "1") {
        setPhase("done");
        return;
      }
    } catch {
      setPhase("done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
      return;
    }

    setPhase("show");
    document.documentElement.classList.add("splash-open");

    const exitTimer = window.setTimeout(() => setPhase("exit"), 2600);
    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
      document.documentElement.classList.remove("splash-open");
    }, 3400);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.documentElement.classList.remove("splash-open");
    };
  }, [variant]);

  function skip() {
    try {
      sessionStorage.setItem(STORAGE[variant], "1");
    } catch {
      /* ignore */
    }
    setPhase("exit");
    window.setTimeout(() => {
      setPhase("done");
      document.documentElement.classList.remove("splash-open");
    }, 500);
  }

  if (phase === "idle" || phase === "done") return null;

  return (
    <AnimatePresence mode="wait">
      {(phase === "show" || phase === "exit") && (
        <motion.div
          key="splash"
          role="dialog"
          aria-modal="true"
          aria-label={`${siteConfig.name} welcome`}
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "exit" ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <AmbientOrbs />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "48px 48px"
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{
              opacity: phase === "exit" ? 0 : 1,
              y: phase === "exit" ? -16 : 0,
              scale: phase === "exit" ? 1.04 : 1
            }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-8 rounded-full bg-brand/15 blur-3xl" />
              <div className="relative rounded-[1.75rem] border border-white/10 bg-ink-900/50 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5">
                <Logo size="hero" priority withText />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 text-[11px] font-bold uppercase tracking-[0.28em] text-brand/90"
            >
              {copy.eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="display mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl"
            >
              {copy.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="mt-2 max-w-xs text-sm text-white/50 sm:text-base"
            >
              {copy.line}
            </motion.p>
          </motion.div>

          <div className="absolute bottom-[max(2.5rem,env(safe-area-inset-bottom))] left-0 right-0 z-10">
            <VisualizerBars />
          </div>

          <button
            type="button"
            onClick={skip}
            className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-pill border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white/50 transition-colors hover:border-white/20 hover:text-white/80"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

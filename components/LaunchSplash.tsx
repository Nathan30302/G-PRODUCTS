"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

/** From tailwind / logo — brand yellow, accent green, ink base */
const BRAND = {
  yellow: "#f6d400",
  yellowSoft: "#ffe24d",
  green: "#22c98a",
  greenSoft: "#4ade9f",
  ink: "#06181c"
} as const;

const STORAGE = {
  shop: "gproducts-splash-v2",
  admin: "gproducts-admin-splash-v2"
} as const;

const MIN_MS = 1800;
const MAX_MS = 3000;
const EXIT_MS = 720;

const COPY = {
  shop: {
    title: siteConfig.name,
    line: siteConfig.tagline
  },
  admin: {
    title: siteConfig.name,
    line: "Provider desk"
  }
} as const;

function AnimatedBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${BRAND.yellow}18, transparent 55%), radial-gradient(ellipse at 80% 20%, ${BRAND.green}14, transparent 45%), ${BRAND.ink}`
        }}
      />

      <div
        className="splash-blob splash-blob-a absolute -left-[20%] top-[5%] h-[min(85vw,32rem)] w-[min(85vw,32rem)] rounded-full opacity-50 blur-[100px]"
        style={{ backgroundColor: `${BRAND.yellow}55` }}
      />
      <div
        className="splash-blob splash-blob-b absolute -right-[18%] top-[18%] h-[min(70vw,26rem)] w-[min(70vw,26rem)] rounded-full opacity-45 blur-[95px]"
        style={{ backgroundColor: `${BRAND.green}50` }}
      />
      <div
        className="splash-blob splash-blob-c absolute bottom-[8%] left-[10%] h-[min(60vw,22rem)] w-[min(60vw,22rem)] rounded-full opacity-35 blur-[90px]"
        style={{ backgroundColor: `${BRAND.yellowSoft}40` }}
      />
      <div
        className="splash-blob splash-blob-d absolute left-1/2 top-[42%] h-[min(50vw,18rem)] w-[min(50vw,18rem)] rounded-full blur-[110px]"
        style={{ backgroundColor: `${BRAND.greenSoft}35` }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.9), transparent 42%)"
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/20 via-transparent to-ink-950/50" />
    </div>
  );
}

function StaticBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${BRAND.ink} 0%, #0a2429 40%, ${BRAND.ink} 100%)`
        }}
      />
      <div
        className="absolute -left-[15%] top-[10%] h-[55vw] max-h-80 w-[55vw] max-w-80 rounded-full opacity-40 blur-[90px]"
        style={{ backgroundColor: `${BRAND.yellow}44` }}
      />
      <div
        className="absolute -right-[10%] bottom-[15%] h-[45vw] max-h-72 w-[45vw] max-w-72 rounded-full opacity-35 blur-[85px]"
        style={{ backgroundColor: `${BRAND.green}40` }}
      />
    </div>
  );
}

export function LaunchSplash({ variant }: { variant: "shop" | "admin" }) {
  const [phase, setPhase] = useState<"idle" | "show" | "exit" | "done">("idle");
  const [reducedMotion, setReducedMotion] = useState(false);
  const exitedRef = useRef(false);
  const copy = COPY[variant];

  const finish = useCallback(() => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    setPhase("exit");
    window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE[variant], "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
      document.documentElement.classList.remove("splash-open");
    }, EXIT_MS);
  }, [variant]);

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
    setReducedMotion(reduced);
    setPhase("show");
    document.documentElement.classList.add("splash-open");

    const start = Date.now();
    let loaded = document.readyState === "complete";

    const maybeFinish = () => {
      const elapsed = Date.now() - start;
      if (elapsed >= MAX_MS) {
        finish();
        return true;
      }
      if (loaded && elapsed >= MIN_MS) {
        finish();
        return true;
      }
      return false;
    };

    const onLoad = () => {
      loaded = true;
      maybeFinish();
    };

    if (!loaded) {
      window.addEventListener("load", onLoad, { once: true });
    }

    const tick = window.setInterval(() => {
      if (maybeFinish()) window.clearInterval(tick);
    }, 80);

    const hardMax = window.setTimeout(() => {
      window.clearInterval(tick);
      finish();
    }, MAX_MS + 50);

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearInterval(tick);
      window.clearTimeout(hardMax);
      document.documentElement.classList.remove("splash-open");
    };
  }, [variant, finish]);

  function skip() {
    finish();
  }

  if (phase === "idle" || phase === "done") return null;

  const exiting = phase === "exit";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${siteConfig.name} welcome`}
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.02 : 1
      }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-ink-950"
    >
        {reducedMotion ? <StaticBackdrop /> : <AnimatedBackdrop />}

        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{
            opacity: exiting ? 0 : 1,
            scale: exiting ? 1.05 : 1,
            y: exiting ? -12 : 0
          }}
          transition={{
            duration: reducedMotion ? 0.4 : 0.9,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative z-10 flex flex-col items-center px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              className="absolute -inset-10 rounded-full blur-3xl"
              style={{ backgroundColor: `${BRAND.yellow}22` }}
            />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-5">
              <Logo size="lg" priority withText={false} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="display mt-8 text-3xl font-black tracking-tight text-white sm:text-4xl"
          >
            {copy.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 max-w-xs text-sm font-medium text-white/55 sm:text-base"
          >
            {copy.line}
          </motion.p>
        </motion.div>

        {!reducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: exiting ? 0 : 0.6 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 h-1 w-16 -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
            aria-hidden
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: BRAND.yellow }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: MAX_MS / 1000, ease: "linear" }}
            />
          </motion.div>
        )}

        <button
          type="button"
          onClick={skip}
          className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-pill border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white/45 transition-colors hover:border-white/20 hover:text-white/75"
        >
          Skip
        </button>
    </motion.div>
  );
}

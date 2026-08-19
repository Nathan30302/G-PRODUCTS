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
  shop: "gproducts-splash-v4",
  admin: "gproducts-admin-splash-v4"
} as const;

const MIN_MS = 2200;
const MAX_MS = 3000;
const EXIT_MS = 750;

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
    <div className="splash-backdrop pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="splash-blob splash-blob-1"
        style={{ backgroundColor: BRAND.green }}
      />
      <div
        className="splash-blob splash-blob-2"
        style={{ backgroundColor: BRAND.yellow }}
      />
      <div className="splash-blob splash-blob-3" />
      <div
        className="splash-blob splash-blob-4"
        style={{ backgroundColor: BRAND.greenSoft }}
      />
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
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: BRAND.ink }}
    >
        {reducedMotion ? <StaticBackdrop /> : <AnimatedBackdrop />}

        <div
          className={`relative z-10 flex flex-col items-center px-8 text-center ${
            reducedMotion ? "" : "splash-content"
          } ${exiting ? "splash-content-exit" : ""}`}
        >
          <div className={reducedMotion ? "relative" : "splash-logo-wrap relative"}>
            <div
              className="absolute -inset-10 rounded-full blur-3xl"
              style={{ backgroundColor: `${BRAND.yellow}22` }}
            />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-5">
              <Logo size="lg" priority withText={false} />
            </div>
          </div>

          <h1
            className={`display mt-8 text-3xl font-black tracking-tight text-white sm:text-4xl ${
              reducedMotion ? "" : "splash-title"
            }`}
          >
            {copy.title}
          </h1>

          <p
            className={`mt-2 max-w-xs text-sm font-medium text-white/55 sm:text-base ${
              reducedMotion ? "" : "splash-tagline"
            }`}
          >
            {copy.line}
          </p>
        </div>

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

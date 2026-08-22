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
  ink: "#06181c",
  inkMid: "#0a2429",
  inkLift: "#0e2e34"
} as const;

const STORAGE = {
  shop: "gproducts-splash-v7",
  admin: "gproducts-admin-splash-v7"
} as const;

/** Hold ~4.2–5s so the opening feels intentional, then exit. */
const MIN_MS = 4200;
const MAX_MS = 5000;
const EXIT_MS = 820;

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

function AnimatedBackdrop({ variant }: { variant: "shop" | "admin" }) {
  const shopLed = variant === "shop";

  return (
    <div
      className={`splash-backdrop pointer-events-none absolute inset-0 overflow-hidden ${
        shopLed ? "splash-backdrop-shop" : "splash-backdrop-admin"
      }`}
    >
      {/* Depth base — multi-stop ink plane */}
      <div className="splash-depth absolute inset-0" />

      {/* Soft radial wells */}
      <div className="splash-well splash-well-a" />
      <div className="splash-well splash-well-b" />
      <div className="splash-well splash-well-c" />

      {/* Drifting brand light */}
      <div
        className="splash-blob splash-blob-1"
        style={{ backgroundColor: shopLed ? BRAND.yellow : BRAND.green }}
      />
      <div
        className="splash-blob splash-blob-2"
        style={{ backgroundColor: shopLed ? BRAND.green : BRAND.yellow }}
      />
      <div className="splash-blob splash-blob-3" />
      <div
        className="splash-blob splash-blob-4"
        style={{
          backgroundColor: shopLed ? BRAND.yellowSoft : BRAND.greenSoft
        }}
      />
      <div
        className="splash-blob splash-blob-5"
        style={{
          backgroundColor: shopLed ? BRAND.greenSoft : BRAND.yellow
        }}
      />

      {/* Center stage glow behind the mark — ambient only, not a logo frame */}
      <div className="splash-stage" />

      {/* Edge vignette + fine grain */}
      <div className="splash-vignette absolute inset-0" />
      <div className="splash-grain absolute inset-0" aria-hidden />
    </div>
  );
}

function StaticBackdrop({ variant }: { variant: "shop" | "admin" }) {
  const shopLed = variant === "shop";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: shopLed
            ? `radial-gradient(ellipse 90% 70% at 50% 38%, ${BRAND.inkLift} 0%, ${BRAND.inkMid} 45%, ${BRAND.ink} 100%)`
            : `radial-gradient(ellipse 90% 70% at 50% 38%, #0c333a 0%, ${BRAND.inkMid} 48%, ${BRAND.ink} 100%)`
        }}
      />
      <div
        className="absolute left-1/2 top-[32%] h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-[100px]"
        style={{
          backgroundColor: shopLed ? `${BRAND.yellow}33` : `${BRAND.green}30`
        }}
      />
      <div
        className="absolute -left-[12%] top-[8%] h-[min(55vw,22rem)] w-[min(55vw,22rem)] rounded-full opacity-35 blur-[90px]"
        style={{
          backgroundColor: shopLed ? `${BRAND.yellow}40` : `${BRAND.green}38`
        }}
      />
      <div
        className="absolute -right-[8%] bottom-[10%] h-[min(50vw,20rem)] w-[min(50vw,20rem)] rounded-full opacity-30 blur-[88px]"
        style={{
          backgroundColor: shopLed ? `${BRAND.green}3a` : `${BRAND.yellow}36`
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 35%, rgba(6,24,28,0.72) 100%)"
        }}
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
      data-splash={variant}
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.025 : 1
      }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: BRAND.ink }}
    >
      {reducedMotion ? (
        <StaticBackdrop variant={variant} />
      ) : (
        <AnimatedBackdrop variant={variant} />
      )}

      <div
        className={`relative z-10 flex w-full max-w-lg flex-col items-center px-6 text-center sm:px-10 ${
          reducedMotion ? "" : "splash-content"
        } ${exiting ? "splash-content-exit" : ""}`}
      >
        <div className={reducedMotion ? undefined : "splash-logo-wrap"}>
          <Logo size="splash" priority />
        </div>

        <h1
          className={`display mt-7 text-[1.85rem] font-black leading-none tracking-tight text-white sm:mt-9 sm:text-5xl ${
            reducedMotion ? "" : "splash-title"
          }`}
        >
          {copy.title}
        </h1>

        <div
          className={`splash-rule mt-4 h-px w-10 sm:mt-5 sm:w-12 ${
            reducedMotion ? "opacity-70" : ""
          }`}
          style={{
            background:
              variant === "shop"
                ? `linear-gradient(90deg, transparent, ${BRAND.yellow}, transparent)`
                : `linear-gradient(90deg, transparent, ${BRAND.green}, transparent)`
          }}
          aria-hidden
        />

        <p
          className={`mt-3 max-w-[16rem] text-sm font-medium tracking-wide text-white/55 sm:mt-4 sm:max-w-xs sm:text-base ${
            reducedMotion ? "" : "splash-tagline"
          }`}
        >
          {copy.line}
        </p>
      </div>

      {!reducedMotion && !exiting ? (
        <div className="splash-progress absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-1/2 z-20 h-[2px] w-16 -translate-x-1/2 overflow-hidden rounded-full bg-white/10 sm:w-20">
          <div className="splash-progress-bar h-full w-full origin-left rounded-full bg-brand/80" />
        </div>
      ) : null}

      <button
        type="button"
        onClick={skip}
        className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-pill border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-semibold text-white/45 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white/75 sm:right-6 sm:top-[max(1.25rem,env(safe-area-inset-top))]"
      >
        Skip
      </button>
    </motion.div>
  );
}

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
  shop: "gproducts-splash-v11",
  admin: "gproducts-admin-splash-v11"
} as const;

/** Hold ~4–4.8s so the opening feels intentional, then exit. */
const MIN_MS = 4000;
const MAX_MS = 4800;
const EXIT_MS = 780;

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
      <div className="splash-depth absolute inset-0" />

      {/* Soft radial wells — depth without clutter */}
      <div className="splash-well splash-well-a" />
      <div className="splash-well splash-well-b" />
      <div className="splash-well splash-well-c" />

      {/* Two drifting brand lights (intentional motion) */}
      <div
        className="splash-blob splash-blob-1"
        style={{ backgroundColor: shopLed ? BRAND.yellow : BRAND.green }}
      />
      <div
        className="splash-blob splash-blob-2"
        style={{ backgroundColor: shopLed ? BRAND.green : BRAND.yellow }}
      />

      {/* Fine grid + vignette + grain for HD atmosphere (grain masked off the mark) */}
      <div className="splash-mesh absolute inset-0" aria-hidden />
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
            ? `radial-gradient(ellipse 90% 70% at 50% 40%, ${BRAND.inkLift} 0%, ${BRAND.inkMid} 45%, ${BRAND.ink} 100%)`
            : `radial-gradient(ellipse 90% 70% at 50% 40%, #0c333a 0%, ${BRAND.inkMid} 48%, ${BRAND.ink} 100%)`
        }}
      />
      <div
        className="absolute -left-[10%] top-[6%] h-[min(50vw,20rem)] w-[min(50vw,20rem)] rounded-full opacity-32 blur-[88px]"
        style={{
          backgroundColor: shopLed ? `${BRAND.yellow}3a` : `${BRAND.green}36`
        }}
      />
      <div
        className="absolute -right-[6%] bottom-[8%] h-[min(48vw,18rem)] w-[min(48vw,18rem)] rounded-full opacity-28 blur-[86px]"
        style={{
          backgroundColor: shopLed ? `${BRAND.green}38` : `${BRAND.yellow}34`
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 48%, transparent 32%, rgba(6,24,28,0.78) 100%)"
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
  const accent = variant === "shop" ? BRAND.yellow : BRAND.green;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${siteConfig.name} welcome`}
      data-splash={variant}
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.02 : 1
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
        className={`relative z-10 flex w-full max-w-[min(100%,20.5rem)] flex-col items-center px-5 text-center sm:max-w-md sm:px-8 md:max-w-xl ${
          reducedMotion ? "" : "splash-content"
        } ${exiting ? "splash-content-exit" : ""}`}
      >
        <div
          className={`relative isolate ${reducedMotion ? "" : "splash-logo-wrap"}`}
        >
          <Logo size="splash" priority />
        </div>

        <h1
          className={`display splash-heading mt-6 whitespace-nowrap font-black leading-[0.95] tracking-tight text-white sm:mt-8 ${
            reducedMotion ? "" : "splash-title"
          }`}
        >
          {copy.title}
        </h1>

        <div
          className={`splash-rule mt-3.5 h-px w-11 sm:mt-4 sm:w-14 ${
            reducedMotion ? "opacity-80" : ""
          }`}
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`
          }}
          aria-hidden
        />

        <p
          className={`splash-line mt-3 max-w-[15.5rem] font-medium tracking-[0.02em] text-white/58 sm:mt-3.5 sm:max-w-xs ${
            reducedMotion ? "" : "splash-tagline"
          }`}
        >
          {copy.line}
        </p>
      </div>

      {!reducedMotion && !exiting ? (
        <div className="splash-progress absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 h-[2px] w-[4.5rem] -translate-x-1/2 overflow-hidden rounded-full bg-white/10 sm:w-20">
          <div
            className="splash-progress-bar h-full w-full origin-left rounded-full"
            style={{ backgroundColor: `${accent}cc` }}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={skip}
        className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-pill border border-white/12 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-white/50 backdrop-blur-md transition-colors hover:border-white/22 hover:text-white/80 sm:right-6 sm:top-[max(1.25rem,env(safe-area-inset-top))]"
      >
        Skip
      </button>
    </motion.div>
  );
}

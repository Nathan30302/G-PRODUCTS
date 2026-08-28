"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";

const BRAND = {
  yellow: "#f6d400",
  yellowSoft: "#ffe24d",
  green: "#22c98a",
  greenSoft: "#4ade9f",
  mint: "#7decc0",
  ink: "#06181c"
} as const;

const STORAGE = {
  shop: "gproducts-splash-v15",
  admin: "gproducts-admin-splash-v15"
} as const;

const MIN_MS = 2800;
const MAX_MS = 3400;
const EXIT_MS = 720;

const COPY = {
  shop: {
    brand: siteConfig.name,
    tagline: siteConfig.tagline,
    line: siteConfig.splashLine
  },
  admin: {
    brand: siteConfig.name,
    tagline: "Provider desk",
    line: "Manage products, orders & services"
  }
} as const;

/** Shop: clean white electronics feel — yellow + green accents only. */
function ShopSplashBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#fafafa]">
        <div
          className="absolute left-1/2 top-[38%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[80px]"
          style={{ backgroundColor: BRAND.yellow }}
        />
        <div
          className="absolute -right-8 top-[18%] h-48 w-48 rounded-full opacity-20 blur-[70px]"
          style={{ backgroundColor: BRAND.green }}
        />
      </div>
    );
  }

  return (
    <div className="splash-backdrop-shop-light pointer-events-none absolute inset-0 overflow-hidden">
      <div className="splash-shop-light-base absolute inset-0" />
      <div className="splash-fluid splash-fluid-a splash-fluid-yellow splash-fluid-on-light" />
      <div className="splash-fluid splash-fluid-b splash-fluid-green splash-fluid-on-light" />
      <div className="splash-fluid splash-fluid-c splash-fluid-yellow-soft splash-fluid-on-light" />
      <div className="splash-fluid splash-fluid-d splash-fluid-green-soft splash-fluid-on-light" />
      <div className="splash-ethereal-veil-light absolute inset-0" aria-hidden />
    </div>
  );
}

function AdminAnimatedBackdrop() {
  return (
    <div className="splash-backdrop pointer-events-none absolute inset-0 overflow-hidden splash-backdrop-admin">
      <div className="splash-ethereal-base absolute inset-0" />
      <div className="splash-fluid splash-fluid-a splash-fluid-green" />
      <div className="splash-fluid splash-fluid-b splash-fluid-yellow" />
      <div className="splash-fluid splash-fluid-c splash-fluid-mint" />
      <div className="splash-fluid splash-fluid-d splash-fluid-green-soft" />
      <div className="splash-fluid splash-fluid-e splash-fluid-yellow-soft" />
      <div className="splash-ethereal-veil absolute inset-0" aria-hidden />
    </div>
  );
}

function AdminStaticBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: BRAND.ink }}
    >
      <div
        className="absolute left-1/2 top-[34%] h-[min(90vw,28rem)] w-[min(90vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[120px]"
        style={{ backgroundColor: BRAND.green }}
      />
      <div
        className="absolute -left-[15%] top-[8%] h-[min(70vw,22rem)] w-[min(70vw,22rem)] rounded-full opacity-35 blur-[110px]"
        style={{ backgroundColor: BRAND.yellow }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 25%, rgba(6,24,28,0.75) 100%)"
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
  const isShop = variant === "shop";

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
  const accent = isShop ? BRAND.yellow : BRAND.green;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${siteConfig.name} welcome`}
      data-splash={variant}
      initial={{ opacity: 1 }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.012 : 1
      }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden ${
        isShop ? "bg-[#fafafa]" : ""
      }`}
      style={isShop ? undefined : { backgroundColor: BRAND.ink }}
    >
      {isShop ? (
        <ShopSplashBackdrop reducedMotion={reducedMotion} />
      ) : reducedMotion ? (
        <AdminStaticBackdrop />
      ) : (
        <AdminAnimatedBackdrop />
      )}

      <div
        className={`relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center sm:max-w-lg sm:px-8 ${
          reducedMotion ? "" : "splash-content"
        } ${exiting ? "splash-content-exit" : ""}`}
      >
        <div className={`relative isolate ${reducedMotion ? "" : "splash-logo-wrap"}`}>
          <Logo size="splash" priority />
        </div>

        {isShop ? (
          <>
            <p
              className={`mt-6 text-sm font-bold uppercase tracking-[0.16em] text-ink-700 sm:mt-8 ${
                reducedMotion ? "" : "splash-title"
              }`}
            >
              {copy.brand}
            </p>

            <div
              className={`splash-tagline-card mt-5 w-full rounded-[1.75rem] px-6 py-7 shadow-[0_24px_60px_rgba(6,24,28,0.18)] sm:mt-6 sm:px-8 sm:py-8 ${
                reducedMotion ? "" : "splash-title"
              }`}
            >
              <h1 className="display splash-tagline-white text-[1.65rem] leading-[1.12] text-white sm:text-[2.15rem]">
                {copy.tagline}
              </h1>
            </div>

            <p
              className={`splash-line mt-5 text-lg font-semibold text-brand-dark sm:text-xl ${
                reducedMotion ? "" : "splash-tagline"
              }`}
            >
              {copy.line}
            </p>
            <p className="mt-2 text-sm text-ink-600/80">
              Electronics · phone accessories · stationery
            </p>
          </>
        ) : (
          <>
            <h1
              className={`display splash-heading mt-6 font-extrabold text-white sm:mt-8 ${
                reducedMotion ? "" : "splash-title"
              }`}
            >
              {copy.brand}
            </h1>
            <div
              className={`splash-rule mt-3.5 h-px w-11 sm:mt-4 sm:w-14 ${
                reducedMotion ? "" : ""
              }`}
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`
              }}
              aria-hidden
            />
            <p
              className={`splash-line mt-3 max-w-sm font-normal leading-relaxed text-white/60 sm:mt-3.5 ${
                reducedMotion ? "" : "splash-tagline"
              }`}
            >
              {copy.tagline}
            </p>
            <p className="mt-1 text-sm text-white/45">{copy.line}</p>
          </>
        )}
      </div>

      {!reducedMotion && !exiting ? (
        <div
          className={`splash-progress absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 h-[2px] w-[4.5rem] -translate-x-1/2 overflow-hidden rounded-full sm:w-20 ${
            isShop ? "bg-ink-950/10" : "bg-white/15"
          }`}
        >
          <div
            className="splash-progress-bar h-full w-full origin-left rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={skip}
        className={`absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-20 rounded-pill border px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors sm:right-6 sm:top-[max(1.25rem,env(safe-area-inset-top))] ${
          isShop
            ? "border-ink-950/10 bg-white/80 text-ink-600 hover:border-ink-950/20 hover:text-ink-900"
            : "border-white/15 bg-white/10 text-white/55 hover:border-white/25 hover:text-white/85"
        }`}
      >
        Skip
      </button>
    </motion.div>
  );
}

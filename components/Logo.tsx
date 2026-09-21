import Image from "next/image";
import { siteConfig } from "@/config/site";

/** Transparent lockup PNG aspect (G + wordmark, no navy field). */
const LOCKUP_ASPECT = 697 / 586;

const markHeights = {
  sm: 36,
  md: 48,
  lg: 56,
  xl: 64,
  xxl: 96
} as const;

const lockupHeights = {
  sm: 40,
  md: 48,
  lg: 88,
  xl: 128,
  splash: 200
} as const;

export type LogoVariant = "mark" | "lockup" | "lockupNavy";

const variantSrc: Record<LogoVariant, string> = {
  mark: siteConfig.logoMark,
  lockup: siteConfig.logoLockup,
  lockupNavy: siteConfig.logoLockupNavy
};

/**
 * Official G-Products logo — unmodified PNG assets only.
 * Default is the navy lockup so petrol, lime G, white G-PRODUCTS and
 * yellow AND SERVICES all read on light chrome (not the G alone).
 */
export function Logo({
  variant = "lockupNavy",
  size = "md",
  className = "",
  priority = false,
  /** @deprecated Kept for call-site compatibility. Use `variant`. */
  withText,
  /** @deprecated No presentation-specific styling is applied. */
  presentation
}: {
  variant?: LogoVariant;
  size?: keyof typeof markHeights | keyof typeof lockupHeights;
  className?: string;
  priority?: boolean;
  withText?: boolean;
  presentation?: "default" | "auth" | "splash";
}) {
  void withText;
  void presentation;

  const src = variantSrc[variant];

  if (variant === "mark") {
    const px = markHeights[size as keyof typeof markHeights] ?? markHeights.md;

    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#243F50] shadow-[0_8px_18px_rgba(36,63,80,0.28)] ring-2 ring-[#E5F34F]/70 ${className}`}
        style={{ width: px, height: px }}
      >
        <Image
          src={src}
          alt="G-Products"
          width={px}
          height={px}
          priority={priority}
          unoptimized
          className="h-[88%] w-[88%] object-contain select-none"
          draggable={false}
        />
      </span>
    );
  }

  const height =
    lockupHeights[
      (size in lockupHeights ? size : "xl") as keyof typeof lockupHeights
    ];
  const width =
    variant === "lockupNavy" ? height : Math.round(height * LOCKUP_ASPECT);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${
        variant === "lockupNavy" ? "rounded-xl shadow-sm sm:rounded-2xl" : ""
      } ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt="G-Products and Services"
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="h-full w-full object-cover select-none"
        draggable={false}
      />
    </span>
  );
}

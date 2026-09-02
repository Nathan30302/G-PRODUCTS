import Image from "next/image";
import { siteConfig } from "@/config/site";

/** Full lockup aspect ratio from the official source file. */
const LOCKUP_ASPECT = 697 / 586;

const markHeights = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  xxl: 96
} as const;

const lockupHeights = {
  sm: 44,
  md: 52,
  lg: 72,
  xl: 112,
  splash: 168
} as const;

export type LogoVariant = "mark" | "lockup" | "lockupNavy";

const variantSrc: Record<LogoVariant, string> = {
  mark: siteConfig.logoMark,
  lockup: siteConfig.logoLockup,
  lockupNavy: siteConfig.logoLockupNavy
};

/**
 * Official G-Products logo — unmodified PNG assets only.
 * Use `mark` in compact chrome; `lockup` on light backgrounds; `lockupNavy` on splash/hero blocks.
 */
export function Logo({
  variant = "mark",
  size = "md",
  className = "",
  priority = false,
  /** @deprecated Kept for call-site compatibility. Use `variant="lockup"`. */
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
    const px = markHeights[size as keyof typeof markHeights];
    const mdBox = size === "md";

    return (
      <span
        className={`relative inline-flex shrink-0 items-center justify-center ${
          mdBox ? "h-10 w-10 sm:h-11 sm:w-11" : ""
        } ${className}`}
        style={mdBox ? undefined : { width: px, height: px }}
      >
        <Image
          src={src}
          alt="G-Products"
          width={px}
          height={px}
          priority={priority}
          unoptimized
          className="h-full w-full object-contain select-none"
          draggable={false}
        />
      </span>
    );
  }

  const height =
    lockupHeights[
      (size in lockupHeights ? size : "xl") as keyof typeof lockupHeights
    ];
  const width = Math.round(height * LOCKUP_ASPECT);

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <Image
        src={src}
        alt="G-Products and Services"
        width={width}
        height={height}
        priority={priority}
        unoptimized
        className="h-full w-full object-contain select-none"
        draggable={false}
      />
    </span>
  );
}

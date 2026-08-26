import Image from "next/image";
import { siteConfig } from "@/config/site";

const MARK_SRC = siteConfig.logoMark;

/** Pixel box for the G mark — same clean symbol used in the nav. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 112,
  /**
   * Splash displays via CSS clamp; pass full 1024 intrinsic so phones
   * and Retina screens get the original PNG detail (not redesigned).
   */
  splash: 1024
} as const;

/**
 * Brand mark only (G + teardrop). Uses the original PNG asset — do not
 * replace with a redrawn SVG. Used in nav, splash, auth, and desk.
 */
export function Logo({
  size = "md",
  className = "",
  priority = false
}: {
  /** @deprecated Kept for call-site compatibility; UI always shows the G mark. */
  withText?: boolean;
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}) {
  const px = sizes[size];
  const isLarge = size === "splash";
  const mdBox = size === "md" && !isLarge;

  return (
    <span
      className={`relative inline-flex shrink-0 ${isLarge ? "splash-mark" : ""} ${
        mdBox ? "h-10 w-10 sm:h-11 sm:w-11" : ""
      } ${className}`}
      style={isLarge || mdBox ? undefined : { width: px, height: px }}
    >
      <Image
        src={MARK_SRC}
        alt="G-Products"
        width={px}
        height={px}
        priority={priority}
        quality={100}
        unoptimized
        className={`h-full w-full object-contain ${isLarge ? "" : "p-[4%]"}`}
      />
    </span>
  );
}

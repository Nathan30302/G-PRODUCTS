import Image from "next/image";
import { siteConfig } from "@/config/site";

const MARK_SRC = siteConfig.logoMark;

/** Pixel box for the G mark — same clean symbol used in the nav. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 112,
  /**
   * Splash displays via CSS clamp; pass a large intrinsic size so Retina
   * screens get the full 1024 PNG detail (original mark, not redesigned).
   */
  splash: 640
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

  return (
    <span
      className={`relative inline-flex shrink-0 ${isLarge ? "splash-mark" : ""} ${className}`}
      style={isLarge ? undefined : { width: px, height: px }}
    >
      <Image
        src={MARK_SRC}
        alt="G-Products"
        width={px}
        height={px}
        priority={priority}
        quality={100}
        unoptimized
        className={`h-full w-full object-contain ${isLarge ? "p-[1.5%]" : "p-[4%]"}`}
      />
    </span>
  );
}

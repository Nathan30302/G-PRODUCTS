import Image from "next/image";
import { siteConfig } from "@/config/site";

const MARK_SRC = siteConfig.logoMark;

/** Pixel box for the G mark — original PNG only, no redraw or overlays. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 96,
  xl: 128
} as const;

/**
 * Clean G-Products mark — the official PNG only.
 * Do not wrap with rings, glows, gradients, badges, or emoji.
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
  const mdBox = size === "md";

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${
        mdBox ? "h-10 w-10 sm:h-11 sm:w-11" : ""
      } ${className}`}
      style={mdBox ? undefined : { width: px, height: px }}
    >
      <Image
        src={MARK_SRC}
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

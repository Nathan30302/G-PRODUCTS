import Image from "next/image";
import { siteConfig } from "@/config/site";

const MARK_SRC = siteConfig.logoMark;

/** Pixel box for the G mark — same clean symbol used in the nav. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 112,
  splash: 176
} as const;

/**
 * Brand mark only (G + teardrop). No framed/navy chrome — mark sits on the
 * surrounding surface. Used in nav, splash, auth, and desk.
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
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={MARK_SRC}
        alt="G-Products"
        width={px}
        height={px}
        priority={priority}
        quality={100}
        unoptimized
        className={`h-full w-full object-contain ${isLarge ? "p-[2%]" : "p-[4%]"}`}
      />
    </span>
  );
}

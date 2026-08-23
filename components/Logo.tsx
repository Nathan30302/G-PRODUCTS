import { BrandMark } from "@/components/BrandMark";
import { siteConfig } from "@/config/site";

/** Pixel box for the G mark — same clean symbol used in the nav. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 112,
  /** Intrinsic layout size; splash uses CSS clamp for phone/desktop. */
  splash: 320
} as const;

/**
 * Brand mark only (G + teardrop). Crisp inline SVG for all UI sizes.
 * Raster PNG remains available via siteConfig.logoMarkPng for favicons / OG.
 */
export function Logo({
  size = "md",
  className = "",
  priority: _priority = false
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
      className={`relative inline-flex shrink-0 items-center justify-center ${isLarge ? "splash-mark" : ""} ${className}`}
      style={isLarge ? undefined : { width: px, height: px }}
    >
      <BrandMark
        title={siteConfig.name}
        className={`h-full w-full ${isLarge ? "p-[1.5%]" : "p-[4%]"}`}
      />
    </span>
  );
}

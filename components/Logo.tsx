import Image from "next/image";
import { siteConfig } from "@/config/site";

const LOGO_SRC = siteConfig.logo;
const LOGO_SM_SRC = siteConfig.logoSm;
const MARK_SRC = siteConfig.logoMark;

/** Pixel box for the rendered mark / lockup. Full wordmark needs more room. */
const sizes = {
  sm: 36,
  md: 44,
  lg: 120,
  splash: 184,
  hero: 304
} as const;

export function Logo({
  withText = true,
  size = "md",
  className = "",
  priority = false
}: {
  /** Full lockup when there’s room; compact sizes use the balanced G mark. */
  withText?: boolean;
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}) {
  const compact = size === "sm" || size === "md";
  // Small chrome (nav) always uses the mark so proportions stay true —
  // object-cover on the full lockup was zooming the G and throwing it off.
  const useLockup = withText && !compact;
  const src = useLockup
    ? size === "lg"
      ? LOGO_SM_SRC
      : LOGO_SRC
    : MARK_SRC;
  const alt = useLockup ? "G-Products and Services" : "G-Products";

  if (size === "hero") {
    return (
      <span
        className={`relative block aspect-square w-[min(76vw,19rem)] overflow-hidden rounded-[1.75rem] sm:w-[19.5rem] lg:w-[21rem] ${className}`}
        style={{ backgroundColor: "#092742" }}
      >
        <Image
          src={LOGO_SRC}
          alt={alt}
          fill
          sizes="(max-width: 640px) 72vw, 320px"
          priority={priority}
          quality={100}
          unoptimized
          className="object-contain p-[6%]"
        />
      </span>
    );
  }

  const px = sizes[size];

  if (useLockup) {
    return (
      <span
        className={`relative inline-flex shrink-0 overflow-hidden rounded-2xl ${className}`}
        style={{
          width: px,
          height: px,
          backgroundColor: "#092742"
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          priority={priority}
          quality={100}
          unoptimized
          className="h-full w-full object-contain p-[5%]"
        />
      </span>
    );
  }

  // Mark — balanced crop of the real lockup icon (exact brand, not redrawn)
  return (
    <span
      className={`relative inline-flex shrink-0 ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={MARK_SRC}
        alt={alt}
        width={px}
        height={px}
        priority={priority}
        quality={100}
        unoptimized
        className="h-full w-full object-contain p-[4%]"
      />
    </span>
  );
}

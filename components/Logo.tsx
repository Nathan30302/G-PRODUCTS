import Image from "next/image";

const LOGO_SRC = "/brand/g-products-logo.png";
const MARK_SRC = "/brand/g-products-mark.png";

const sizes = {
  sm: 40,
  md: 48,
  lg: 120,
  hero: 220
} as const;

export function Logo({
  withText = true,
  size = "md",
  className = "",
  priority = false
}: {
  /** When false, shows only the G mark (still from the official logo). */
  withText?: boolean;
  size?: keyof typeof sizes;
  className?: string;
  priority?: boolean;
}) {
  const px = sizes[size];
  const src = withText ? LOGO_SRC : MARK_SRC;
  const alt = withText
    ? "G-Products and Services"
    : "G-Products";

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-2xl ${className}`}
      style={{ width: px, height: px }}
    >
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        priority={priority}
        quality={100}
        unoptimized
        className="h-full w-full object-cover"
      />
    </span>
  );
}

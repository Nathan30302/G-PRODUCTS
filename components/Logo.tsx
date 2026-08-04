import Image from "next/image";

const LOGO_SRC = "/brand/g-products-logo.png";
const MARK_SRC = "/brand/g-products-mark.png";

const sizes = {
  sm: 40,
  md: 44,
  lg: 112,
  hero: 288
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
  const src = withText ? LOGO_SRC : MARK_SRC;
  const alt = withText ? "G-Products and Services" : "G-Products";

  if (size === "hero") {
    return (
      <span
        className={`relative block aspect-square w-[min(72vw,17.5rem)] overflow-hidden sm:w-[18rem] lg:w-[20rem] ${className}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 72vw, 320px"
          priority={priority}
          quality={100}
          unoptimized
          className="object-cover"
        />
      </span>
    );
  }

  const px = sizes[size];

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden rounded-xl ${className}`}
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

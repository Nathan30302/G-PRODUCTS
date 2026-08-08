"use client";

import Image, { type ImageProps } from "next/image";

/**
 * Safe product/service image — never crashes when src is missing, and skips
 * the optimizer for uploaded /api/media photos (more reliable on Railway).
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...rest
}: Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackClassName?: string;
}) {
  if (!src) {
    return (
      <div
        className={
          fallbackClassName ??
          `grid place-items-center bg-ink-850 text-[10px] font-bold uppercase tracking-wide text-white/25 ${className ?? ""}`
        }
        aria-label={alt}
      >
        No photo
      </div>
    );
  }

  const uploaded =
    src.startsWith("/api/media/") || src.startsWith("/uploads/");

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      unoptimized={uploaded || rest.unoptimized}
      {...rest}
    />
  );
}

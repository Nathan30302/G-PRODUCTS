"use client";

import { useEffect, useState } from "react";

/** Full-bleed catalogue photo. Starts on today's picture, then moves through the set. */
export function DeskPhotoBackdrop({
  photos,
  startIndex
}: {
  photos: string[];
  startIndex: number;
}) {
  const count = photos.length;
  const [index, setIndex] = useState(count ? startIndex % count : 0);

  useEffect(() => {
    if (count < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <div className="desk-stage-photos" aria-hidden>
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element -- real catalogue photos
        <img
          key={src}
          src={src}
          alt=""
          className={i === index ? "is-on" : undefined}
        />
      ))}
      <span className="desk-stage-shade" />
    </div>
  );
}

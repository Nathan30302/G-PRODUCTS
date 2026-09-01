#!/usr/bin/env python3
"""Regenerate official G-Products logo variants from the source lockup JPG."""

from __future__ import annotations

import os
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "g-products-logo-source.jpg"
OUT = ROOT / "public" / "brand"
ICON = ROOT / "app" / "icon.png"

# Sampled from the official logo file border pixels
NAVY = (36, 63, 80, 255)
THRESH = 42


def color_dist(c1: tuple[int, ...], c2: tuple[int, ...]) -> float:
    return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5


def is_background(r: int, g: int, b: int) -> bool:
    return color_dist((r, g, b), NAVY[:3]) <= THRESH


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source file: {SRC}")

    ref = Image.open(SRC).convert("RGBA")
    w, h = ref.size
    px = ref.load()

    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if not is_background(r, g, b):
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)

    pad = 24
    minx = max(0, minx - pad)
    miny = max(0, miny - pad)
    maxx = min(w - 1, maxx + pad)
    maxy = min(h - 1, maxy + pad)
    lockup = ref.crop((minx, miny, maxx + 1, maxy + 1))
    tw, th = lockup.size

    transparent = Image.new("RGBA", lockup.size, (0, 0, 0, 0))
    tpx = transparent.load()
    cpx = lockup.load()
    for y in range(th):
        for x in range(tw):
            r, g, b, _ = cpx[x, y]
            tpx[x, y] = (0, 0, 0, 0) if is_background(r, g, b) else (r, g, b, 255)

    canvas_size = max(tw, th) + 80
    navy_lockup = Image.new("RGBA", (canvas_size, canvas_size), NAVY)
    ox = (canvas_size - tw) // 2
    oy = (canvas_size - th) // 2
    navy_lockup.paste(transparent, (ox, oy), transparent)

    icon_cut = int(th * 0.58)
    icon = transparent.crop((0, 0, tw, icon_cut))
    icon_bbox = icon.split()[3].getbbox()
    if icon_bbox:
        icon = icon.crop(icon_bbox)
    iw, ih = icon.size
    icon_size = max(iw, ih) + 40
    icon_canvas = Image.new("RGBA", (icon_size, icon_size), (0, 0, 0, 0))
    icon_canvas.paste(icon, ((icon_size - iw) // 2, (icon_size - ih) // 2), icon)

    OUT.mkdir(parents=True, exist_ok=True)
    outputs = {
        "g-products-lockup-transparent.png": transparent,
        "g-products-lockup-navy.png": navy_lockup,
        "g-products-mark-transparent.png": icon_canvas,
        "g-products-logo.png": transparent,
        "g-products-mark.png": icon_canvas,
        "g-products-logo-navy.png": navy_lockup,
    }
    for name, image in outputs.items():
        image.save(OUT / name, optimize=True)

    for scale, suffix in [(0.5, "-sm"), (0.25, "-xs")]:
        for base in ["g-products-lockup-transparent", "g-products-mark-transparent"]:
            im = Image.open(OUT / f"{base}.png")
            nw, nh = int(im.width * scale), int(im.height * scale)
            im.resize((nw, nh), Image.Resampling.LANCZOS).save(
                OUT / f"{base}{suffix}.png", optimize=True
            )

    icon512 = Image.new("RGBA", (512, 512), NAVY)
    mark = Image.open(OUT / "g-products-mark-transparent.png")
    scale = min(380 / mark.width, 380 / mark.height)
    nw, nh = int(mark.width * scale), int(mark.height * scale)
    mark_r = mark.resize((nw, nh), Image.Resampling.LANCZOS)
    icon512.paste(mark_r, ((512 - nw) // 2, (512 - nh) // 2 - 10), mark_r)
    icon512.save(ICON, optimize=True)

    print("Generated brand assets in", OUT)


if __name__ == "__main__":
    main()

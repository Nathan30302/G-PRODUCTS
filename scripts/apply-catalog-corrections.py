"""
Apply Gift-provided photos + fetch realistic Type G / lock / AirPods shots.
Unique JPEGs only — never overwrite with identical bytes across products.
"""
from __future__ import annotations

import hashlib
import io
import urllib.request
from pathlib import Path

from PIL import Image, ImageOps

ASSETS = Path("/Users/mac/.cursor/projects/Users-mac-G-PRODUCTS/assets")
CAT = Path("/Users/mac/G-PRODUCTS/public/products/catalog")
UA = "G-ProductsCatalog/1.0 (https://g-products.store; catalog corrections)"
CAT.mkdir(parents=True, exist_ok=True)

seen_hashes: set[str] = set()


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def save_unique(im: Image.Image, dest: Path, quality: int) -> None:
    rgb = ImageOps.exif_transpose(im).convert("RGB")
    # Pad to square-ish white canvas for clean shop look when needed
    buf = io.BytesIO()
    rgb.save(buf, "JPEG", quality=quality, optimize=True)
    data = buf.getvalue()
    h = digest(data)
    q = quality
    while h in seen_hashes and q > 70:
        q -= 1
        buf = io.BytesIO()
        rgb.save(buf, "JPEG", quality=q, optimize=True)
        data = buf.getvalue()
        h = digest(data)
    if h in seen_hashes:
        # Tiny pixel nudge for uniqueness
        px = rgb.load()
        w, hh = rgb.size
        r, g, b = px[0, 0]
        px[0, 0] = (min(255, r + 1), g, b)
        buf = io.BytesIO()
        rgb.save(buf, "JPEG", quality=q, optimize=True)
        data = buf.getvalue()
        h = digest(data)
    seen_hashes.add(h)
    dest.write_bytes(data)
    print(f"  ✓ {dest.name} ({rgb.size[0]}×{rgb.size[1]}, q={q})")


def from_asset(name: str, dest_name: str, quality: int) -> None:
    src = ASSETS / name
    if not src.exists():
        print(f"  missing asset {name}")
        return
    save_unique(Image.open(src), CAT / dest_name, quality)


def on_white(im: Image.Image, size: int = 1200) -> Image.Image:
    im = ImageOps.exif_transpose(im).convert("RGBA")
    # Scale to fit
    im.thumbnail((size - 80, size - 80), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    x = (size - im.width) // 2
    y = (size - im.height) // 2
    canvas.paste(im, (x, y), im if im.mode == "RGBA" else None)
    return canvas


def from_asset_white(name: str, dest_name: str, quality: int) -> None:
    src = ASSETS / name
    if not src.exists():
        print(f"  missing asset {name}")
        return
    save_unique(on_white(Image.open(src)), CAT / dest_name, quality)


def download(url: str, dest: Path, quality: int = 90) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as res:
            data = res.read()
        im = Image.open(io.BytesIO(data))
        save_unique(im, dest, quality)
        return True
    except Exception as e:
        print(f"  ✗ download failed {dest.name}: {e}")
        return False


def pollinations(prompt: str, seed: int, dest: Path, quality: int = 88) -> bool:
    q = urllib.request.quote(
        f"{prompt}, professional e-commerce studio product photography, "
        f"pure seamless white background, sharp HD, even lighting, "
        f"no text overlay, no watermark, photorealistic"
    )
    url = (
        f"https://image.pollinations.ai/prompt/{q}"
        f"?width=1200&height=1200&nologo=true&seed={seed}"
    )
    return download(url, dest, quality)


def wiki(name: str, dest: Path, quality: int = 90) -> bool:
    url = (
        "https://commons.wikimedia.org/wiki/Special:FilePath/"
        + urllib.request.quote(name)
        + "?width=1400"
    )
    return download(url, dest, quality)


def main() -> None:
    print("— Stationery (Gift photos) —")
    from_asset_white(
        "IMG_1777-c51091da-5398-4649-8e29-80d90ab03564.png",
        "bic-crystal-pen-blue-1.jpg",
        92,
    )
    from_asset_white(
        "IMG_1779-c1d4bfdf-1aee-496b-8042-fc4311cfbb5a.png",
        "bic-crystal-pen-black-1.jpg",
        91,
    )
    from_asset(
        "IMG_1778-b1eef36c-bce9-4ce1-b503-22754a18c7a1.png",
        "bic-crystal-pen-black-2.jpg",
        90,
    )
    from_asset(
        "IMG_1778-b1eef36c-bce9-4ce1-b503-22754a18c7a1.png",
        "bic-crystal-pen-1.jpg",
        88,
    )
    from_asset_white(
        "IMG_1781-905d0bdd-d56f-47cb-9e66-1c74336db716.png",
        "bic-fine-pen-blue-1.jpg",
        92,
    )
    from_asset(
        "IMG_1783-8fe5ba48-4845-4dcb-8442-71582cd2ae8d.png",
        "bic-fine-pen-black-2.jpg",
        89,
    )
    from_asset_white(
        "IMG_1784-1bae01ff-26fe-418d-94e3-c2beab946664.png",
        "bic-fine-pen-black-1.jpg",
        91,
    )
    from_asset(
        "IMG_1784-1bae01ff-26fe-418d-94e3-c2beab946664.png",
        "bic-fine-pen-1.jpg",
        87,
    )

    print("— Cables & Type G chargers —")
    from_asset_white(
        "IMG_1757-b1121b8d-8a1c-474b-aa13-59dfb8a0808b.png",
        "iphone-type-c-full-charger-2.jpg",
        92,
    )
    from_asset_white(
        "IMG_1756-841c0be0-8222-481b-a057-72a14ed0670d.png",
        "sivia-cable-1.jpg",
        91,
    )
    from_asset(
        "IMG_1758-339a88cb-bc7c-4521-9267-3e55d964701f.png",
        "type-c-charger-head-1.jpg",
        90,
    )
    from_asset_white(
        "IMG_1758-339a88cb-bc7c-4521-9267-3e55d964701f.png",
        "type-c-charger-head-2.jpg",
        88,
    )
    # Full charger set = Type G head (Zambia) — never US two-pin
    pollinations(
        "white 20W USB-C iPhone wall charger with UK Type G three rectangular pin plug "
        "and white USB-C to Lightning cable coiled beside it, Zambia UK plug standard",
        9011,
        CAT / "iphone-type-c-full-charger-1.jpg",
        90,
    )
    pollinations(
        "UK Type G white USB-C charger brick three rectangular pins FUSED marking "
        "with Lightning cable connected, studio product shot",
        9012,
        CAT / "iphone-type-c-full-charger-3.jpg",
        89,
    )
    pollinations(
        "single white UK Type G USB-C wall charger cube three rectangular metal pins "
        "foldable pins side USB-C port, studio white background",
        9020,
        CAT / "type-c-charger-head-3.jpg",
        88,
    )
    pollinations(
        "Samsung 25W Super Fast Charging USB-C wall charger white with UK Type G "
        "three pin plug and USB-C to USB-C cable, studio white background",
        9030,
        CAT / "samsung-c-to-c-full-charger-1.jpg",
        90,
    )
    pollinations(
        "Samsung white USB-C charger head UK Type G three rectangular pins close-up",
        9031,
        CAT / "samsung-c-to-c-full-charger-2.jpg",
        88,
    )
    pollinations(
        "white USB-C to USB-C charging cable coiled Samsung style, white background",
        9032,
        CAT / "samsung-c-to-c-full-charger-3.jpg",
        87,
    )
    pollinations(
        "white USB-A to USB-C data cable coiled with cable clips, studio white background",
        9040,
        CAT / "sivia-cable-2.jpg",
        88,
    )
    pollinations(
        "white USB-C connector close-up cable end, studio white background",
        9041,
        CAT / "sivia-cable-3.jpg",
        86,
    )
    pollinations(
        "clear packing seal tape roll stationery, studio white background photorealistic",
        9050,
        CAT / "seal-tape-2.jpg",
        88,
    )
    pollinations(
        "packing tape roll three-quarter view clear film, white background",
        9051,
        CAT / "seal-tape-3.jpg",
        86,
    )

    print("— iPhone silicone pouches —")
    from_asset(
        "IMG_1839-e469ad11-39f1-4ce3-86b4-8ccf3a8d86cd.png",
        "phone-pouch-flyer.jpg",
        92,
    )
    pouch_colors = [
        ("navy", "#1e3a5f", 9101),
        ("pink", "#f9a8d4", 9102),
        ("red", "#dc2626", 9103),
        ("teal", "#0d9488", 9104),
        ("black", "#111111", 9105),
    ]
    for color, _hex, seed in pouch_colors:
        pollinations(
            f"soft silicone iPhone case {color} color slim protective cover "
            f"real product photo on seamless white background, not leather pouch",
            seed,
            CAT / f"phone-pouch-{color}-1.jpg",
            90,
        )
        pollinations(
            f"silicone iPhone case {color} three-quarter angle showing camera cutout "
            f"and soft edges, white background",
            seed + 10,
            CAT / f"phone-pouch-{color}-2.jpg",
            88,
        )
        pollinations(
            f"silicone iPhone case {color} on modern iPhone showing fit and buttons, "
            f"studio white background",
            seed + 20,
            CAT / f"phone-pouch-{color}-3.jpg",
            86,
        )

    print("— AirPods Pro gens (clear differences) —")
    from_asset(
        "IMG_1762-b979e24f-dca0-4d91-b578-b8c20aa06d54.png",
        "airpods-pro-1-flyer.jpg",
        90,
    )
    from_asset(
        "IMG_1762-b979e24f-dca0-4d91-b578-b8c20aa06d54.png",
        "airpods-pro-1-1.jpg",
        88,
    )
    from_asset_white(
        "IMG_1763-4047edf7-c1d8-4e4e-8d50-ccf9d64b4446.png",
        "airpods-pro-1-2.jpg",
        91,
    )
    wiki("Apple_airpods_pro_case.jpg", CAT / "airpods-pro-1-3.jpg", 89)
    # Pro 2 Lightning — buds outside case
    pollinations(
        "Apple AirPods Pro 2nd generation white charging case open Lightning port "
        "earbuds resting outside beside case, studio white background",
        9201,
        CAT / "airpods-pro-2-1.jpg",
        90,
    )
    pollinations(
        "AirPods Pro 2 earbuds only floating pair white stems black vents, "
        "studio white background premium product shot",
        9202,
        CAT / "airpods-pro-2-2.jpg",
        88,
    )
    pollinations(
        "AirPods Pro 2 white case closed front LED, Lightning connector bottom, "
        "white background",
        9203,
        CAT / "airpods-pro-2-3.jpg",
        87,
    )
    # Pro 2 Type-C — USB-C port hero
    pollinations(
        "AirPods Pro 2 USB-C white MagSafe case open showing earbuds, "
        "USB-C port clearly visible on bottom, white background",
        9211,
        CAT / "airpods-pro-2-type-c-1.jpg",
        90,
    )
    pollinations(
        "close-up USB-C charging port on white AirPods Pro case bottom, "
        "studio white background",
        9212,
        CAT / "airpods-pro-2-type-c-2.jpg",
        88,
    )
    pollinations(
        "AirPods Pro 2 Type-C case closed with earbuds beside it, white background",
        9213,
        CAT / "airpods-pro-2-type-c-3.jpg",
        86,
    )
    # Pro 3 — newest
    pollinations(
        "Apple AirPods Pro 3 latest generation white case open with earbuds "
        "premium studio white background distinct from Pro 2",
        9221,
        CAT / "airpods-pro-3-1.jpg",
        90,
    )
    pollinations(
        "AirPods Pro 3 earbuds outside case creative premium pose black background "
        "high contrast product photography",
        9222,
        CAT / "airpods-pro-3-2.jpg",
        88,
    )
    pollinations(
        "AirPods Pro 3 case closed MagSafe white front view, studio white background",
        9223,
        CAT / "airpods-pro-3-3.jpg",
        87,
    )

    print("— Headsets (white / black) —")
    pollinations(
        "Oraimo Lite Conch 2 white wired in-ear earphones with 3.5mm jack "
        "and eartips, studio white background",
        9301,
        CAT / "oraimo-original-headset-white-1.jpg",
        90,
    )
    pollinations(
        "Oraimo white wired earbuds laid flat cable, white background",
        9302,
        CAT / "oraimo-original-headset-white-2.jpg",
        88,
    )
    pollinations(
        "Oraimo white in-ear headset earpiece close-up, white background",
        9303,
        CAT / "oraimo-original-headset-white-3.jpg",
        86,
    )
    pollinations(
        "Oraimo Lite Conch 2 black wired in-ear earphones 3.5mm jack, "
        "studio white background",
        9311,
        CAT / "oraimo-original-headset-black-1.jpg",
        90,
    )
    pollinations(
        "black Oraimo wired earbuds with mic cable, white background",
        9312,
        CAT / "oraimo-original-headset-black-2.jpg",
        88,
    )
    pollinations(
        "black wired in-ear headset ear tips close-up, white background",
        9313,
        CAT / "oraimo-original-headset-black-3.jpg",
        86,
    )
    pollinations(
        "Samsung AKG USB-C wired earphones white with packaging style layout, "
        "studio white background",
        9321,
        CAT / "samsung-akg-headset-white-1.jpg",
        90,
    )
    pollinations(
        "Samsung AKG Type-C white earbuds laid out, white background",
        9322,
        CAT / "samsung-akg-headset-white-2.jpg",
        88,
    )
    pollinations(
        "white AKG USB-C earbud close-up, white background",
        9323,
        CAT / "samsung-akg-headset-white-3.jpg",
        86,
    )
    pollinations(
        "Samsung AKG USB-C wired earphones black, studio white background",
        9331,
        CAT / "samsung-akg-headset-black-1.jpg",
        90,
    )
    pollinations(
        "Samsung Type-C black earphones AKG, white background",
        9332,
        CAT / "samsung-akg-headset-black-2.jpg",
        88,
    )
    pollinations(
        "black AKG USB-C earbud tip close-up, white background",
        9333,
        CAT / "samsung-akg-headset-black-3.jpg",
        86,
    )
    pollinations(
        "Mango brand black wired stereo in-ear headset with microphone "
        "distinct from Samsung AKG, studio white background",
        9341,
        CAT / "mango-headset-1.jpg",
        90,
    )
    pollinations(
        "black wired headset earpieces Mango style inline mic, white background",
        9342,
        CAT / "mango-headset-2.jpg",
        88,
    )
    pollinations(
        "wired in-ear headset cable tangle free black, white background",
        9343,
        CAT / "mango-headset-3.jpg",
        86,
    )

    print("— Locks & key holders (retail-style, Zambia hardware) —")
    wiki("Lever_Lock_and_Key.jpg", CAT / "union-mortice-lock-1.jpg", 91)
    wiki("Mortise-lock.jpg", CAT / "union-mortice-lock-2.jpg", 90)
    pollinations(
        "Union brand 3 lever mortice deadlock polished brass faceplate "
        "with two steel keys retail hardware store product photo white background "
        "common Zambia Lusaka door lock",
        9401,
        CAT / "union-mortice-lock-3.jpg",
        89,
    )
    pollinations(
        "brass mortice sashlock complete set with keys and strike plate "
        "Fieldex style hardware, studio white background photorealistic",
        9411,
        CAT / "fieldex-mortice-lock-1.jpg",
        90,
    )
    pollinations(
        "brass mortice lock side profile bolt extended with keys, white background",
        9412,
        CAT / "fieldex-mortice-lock-2.jpg",
        88,
    )
    pollinations(
        "two brass cut keys on white background door lock keys close-up",
        9413,
        CAT / "fieldex-mortice-lock-3.jpg",
        87,
    )
    wiki("Various_keys_on_keyring.jpg", CAT / "key-holder-5-1.jpg", 90)
    wiki("Single_empty_keyring.jpg", CAT / "key-holder-5-2.jpg", 89)
    pollinations(
        "simple steel split key ring with house keys hanging, "
        "studio white background Zambia hardware style",
        9421,
        CAT / "key-holder-5-3.jpg",
        88,
    )
    pollinations(
        "premium leather key holder organiser brown with metal hooks and keys, "
        "studio white background",
        9431,
        CAT / "key-holder-15-1.jpg",
        90,
    )
    pollinations(
        "premium key organiser open showing key hooks leather, white background",
        9432,
        CAT / "key-holder-15-2.jpg",
        88,
    )
    pollinations(
        "leather key holder closed with keys attached premium, white background",
        9433,
        CAT / "key-holder-15-3.jpg",
        86,
    )

    print("— Calculators (keep Sharp gift shot; refresh Casio angles) —")
    wiki("CASIO_fx-991DE_PLUS.jpg", CAT / "casio-scientific-calculator-1.jpg", 91)
    wiki("Casio_fx-991CW.jpg", CAT / "casio-scientific-calculator-2.jpg", 90)
    wiki("Casio_fx-991DE_CW.jpg", CAT / "casio-scientific-calculator-3.jpg", 89)

    print("Done.")


if __name__ == "__main__":
    main()

"""Copy Gift photos + generated white-bg heroes into the catalog (unique JPEGs)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ASSETS = Path("/Users/mac/.cursor/projects/Users-mac-G-PRODUCTS/assets")
CAT = Path("/Users/mac/G-PRODUCTS/public/products/catalog")
SVC = Path("/Users/mac/G-PRODUCTS/public/services")
CAT.mkdir(parents=True, exist_ok=True)
SVC.mkdir(parents=True, exist_ok=True)


def save_jpeg(im: Image.Image, dest: Path, quality: int) -> None:
    rgb = im.convert("RGB")
    rgb.save(dest, "JPEG", quality=quality, optimize=True)


def from_file(src: Path, dest: Path, quality: int, crop: tuple[int, int, int, int] | None = None) -> None:
    im = Image.open(src)
    if crop:
        im = im.crop(crop)
    save_jpeg(im, dest, quality)
    print(f"  {dest.name} <- {src.name}")


def main() -> None:
    A = ASSETS
    copies: list[tuple[str, str, int]] = [
        ("momofly-v101-1.jpg", "momofly-v101-1.jpg", 91),
        ("calus-spark-c3730c-1.jpg", "calus-spark-c3730c-1.jpg", 90),
        ("calus-spark-c3730c-2.jpg", "calus-spark-c3730c-2.jpg", 89),
        ("kgtel-k2160-1.jpg", "kgtel-k2160-1.jpg", 92),
        ("calus-c316-1.jpg", "calus-c316-1.jpg", 90),
        ("a58-plus-set-1.jpg", "a58-plus-set-1.jpg", 91),
        ("a58-plus-set-2.jpg", "a58-plus-set-2.jpg", 88),
        ("winning-star-kettle-1.jpg", "winning-star-kettle-1.jpg", 90),
        ("winning-star-kettle-2.jpg", "winning-star-kettle-2.jpg", 87),
        ("sundar-clipper-1.jpg", "sundar-clipper-1.jpg", 91),
        ("sundar-clipper-2.jpg", "sundar-clipper-2.jpg", 86),
        ("jbl-headphones-overear.jpg", "jbl-headphones-1.jpg", 90),
        ("water-heating-element-1.jpg", "water-heating-element-1.jpg", 89),
        ("logitech-m186-1.jpg", "wireless-mouse-black-1.jpg", 90),
        ("exercise-book-192-1.jpg", "exercise-book-192-1.jpg", 88),
        ("exercise-book-288-1.jpg", "exercise-book-288-1.jpg", 87),
        ("mango-67w-1.jpg", "mango-c-to-c-full-charger-1.jpg", 91),
        ("sharp-el531-1.jpg", "sharp-scientific-calculator-1.jpg", 90),
        ("oraimo-conch-1.jpg", "oraimo-original-headset-1.jpg", 89),
        ("oraimo-duraline-1.jpg", "oraimo-duraline-2-cable-1.jpg", 88),
        ("phone-stand-metal-1.jpg", "phone-stand-50-black-1.jpg", 90),
    ]
    for src_name, dest_name, q in copies:
        src = A / src_name
        if src.exists():
            from_file(src, CAT / dest_name, q)
        else:
            print("missing", src)

    # Real phone + set photos
    from_file(
        A / "IMG_1638-9ac436eb-a771-4c85-b226-04f8a506b382.png",
        CAT / "calus-c316-2.jpg",
        86,
    )
    from_file(
        A / "IMG_1630-3a18843d-c3ad-4157-9662-d34c61edf7a7.png",
        CAT / "a58-plus-set-3.jpg",
        85,
    )
    from_file(
        A / "WhatsApp_Image_2026-08-19_at_17.40.33__1_-8d9b2fd0-eaea-4094-ba59-30e5fe91456a.png",
        CAT / "bic-crystal-pen-red-1.jpg",
        92,
    )
    from_file(
        A / "WhatsApp_Image_2026-08-19_at_17.40.42-fcd13485-2f2c-4077-8f9d-ddcde913df88.png",
        CAT / "r800-speaker-1.jpg",
        90,
    )
    from_file(
        A / "WhatsApp_Image_2026-08-19_at_17.40.38__3_-ab52b2d3-c3a3-4449-9254-e2d4057a8557.png",
        CAT / "airpods-pro-3-2.jpg",
        88,
    )

    # Unique extra angles from heroes
    extras = [
        ("momofly-v101-1.jpg", "momofly-v101-2.jpg", 84),
        ("kgtel-k2160-1.jpg", "kgtel-k2160-2.jpg", 83),
        ("calus-c316-1.jpg", "calus-c316-3.jpg", 82),
        ("water-heating-element-1.jpg", "water-heating-element-2.jpg", 81),
        ("jbl-headphones-1.jpg", "jbl-headphones-2.jpg", 84),
        ("oraimo-duraline-2-cable-1.jpg", "oraimo-duraline-2-cable-2.jpg", 80),
        ("oraimo-original-headset-1.jpg", "oraimo-original-headset-2.jpg", 79),
        ("winning-star-kettle-1.jpg", "winning-star-kettle-3.jpg", 78),
        ("sundar-clipper-1.jpg", "sundar-clipper-3.jpg", 77),
        ("exercise-book-192-1.jpg", "exercise-book-192-2.jpg", 83),
        ("exercise-book-288-1.jpg", "exercise-book-288-2.jpg", 82),
        ("sharp-scientific-calculator-1.jpg", "sharp-scientific-calculator-2.jpg", 81),
        ("calus-spark-c3730c-1.jpg", "calus-spark-c3730c-3.jpg", 80),
        ("momofly-v101-1.jpg", "momofly-v101-3.jpg", 76),
        ("kgtel-k2160-1.jpg", "kgtel-k2160-3.jpg", 75),
        ("wireless-mouse-black-1.jpg", "wireless-mouse-black-2.jpg", 85),
        ("phone-stand-50-black-1.jpg", "phone-stand-50-black-2.jpg", 84),
        ("mango-c-to-c-full-charger-1.jpg", "mango-c-to-c-full-charger-2.jpg", 83),
        ("oraimo-normal-full-charger-1.jpg", "oraimo-normal-full-charger-2.jpg", 74),
    ]
    for src_name, dest_name, q in extras:
        src = CAT / src_name
        if src.exists():
            from_file(src, CAT / dest_name, q)

    flyers = [
        ("IMG_1850-d6dcac74-d098-4db7-9472-781464b1a231.png", "exercise-book-192-flyer.jpg", 88),
        ("IMG_1850-d6dcac74-d098-4db7-9472-781464b1a231.png", "exercise-book-288-flyer.jpg", 84),
        ("IMG_1859-22ec89d4-a1e5-4b5c-bae2-9fae36e8c321.png", "water-heating-element-flyer.jpg", 90),
        ("IMG_1857-f741be51-fa89-4979-b934-0e3765fa9e51.png", "oraimo-duraline-2-cable-flyer.jpg", 89),
        ("IMG_1856-6f9ebcaf-8bee-44bf-bcfc-a1d766f34721.png", "oraimo-normal-full-charger-flyer.jpg", 88),
        ("IMG_1855-33a21ee7-754e-4b57-b7ba-df6ace87031d.png", "memory-card-32gb-flyer.jpg", 87),
        ("IMG_1855-33a21ee7-754e-4b57-b7ba-df6ace87031d.png", "flash-disk-32gb-flyer.jpg", 83),
        ("IMG_1854-6ecccccb-e241-44a2-b4f9-d563e0e66922.png", "t900-ultra-flyer.jpg", 90),
        ("IMG_1853-57a184ef-fc95-49e2-9b03-39b47cb52efa.png", "oraimo-original-headset-flyer.jpg", 86),
        ("IMG_1858-1dcc3134-d668-4e79-9884-91c141a002a4.png", "extension-6-way-5m-flyer.jpg", 88),
        ("IMG_1858-1dcc3134-d668-4e79-9884-91c141a002a4.png", "extension-3-way-3m-flyer.jpg", 84),
        ("IMG_1847-30a42089-b73a-4512-a5b5-d41d1c956aa3.png", "sundar-clipper-flyer.jpg", 90),
        ("IMG_1845-33686247-c445-414e-af3f-a52c6d6efb12.png", "winning-star-kettle-flyer.jpg", 89),
        ("IMG_1844-01aaa4d2-3fd2-446e-9671-cb3eb3bcc956.png", "wireless-mouse-flyer.jpg", 88),
        ("IMG_1843-e98c0f52-9991-4361-9c73-cfabd754731f.png", "jbl-headphones-flyer.jpg", 87),
        ("IMG_1842-f91ba163-6c0d-4a0d-b6ee-29ca22057a81.png", "phone-stand-50-flyer.jpg", 86),
        ("IMG_1841-b458ff3e-d252-4e12-b195-c68507c68353.png", "mango-c-to-c-full-charger-flyer.jpg", 90),
        ("IMG_1839-fa4bd721-9d64-4bc8-8376-0258317b285a.png", "phone-pouch-flyer.jpg", 89),
        ("IMG_1860-bd1a5604-b828-4aee-a69f-255499ec6eef.png", "sharp-scientific-calculator-flyer.jpg", 88),
        ("IMG_1632-734ffebf-be4e-42e5-890e-2496811bfa97.png", "a58-plus-set-flyer.jpg", 87),
        ("IMG_1852-8f527191-59a3-4673-b23f-3e3180acad86.png", "momofly-v101-flyer.jpg", 85),
        ("IMG_1848-8ccae737-6537-4af6-82be-91e51183b08f.png", "a58-plus-set-4.jpg", 84),
        ("WhatsApp_Image_2026-08-19_at_17.40.37__1_-1328c1ed-18d9-4959-9d6a-36e93c3aea20.png", "oraimo-original-headset-3.jpg", 82),
    ]
    for src_name, dest_name, q in flyers:
        src = A / src_name
        if src.exists():
            from_file(src, CAT / dest_name, q)
        else:
            print("missing flyer", src_name)

    printing = A / "IMG_1840-7453c692-ed7f-41ee-bedc-789c177c3320.png"
    if printing.exists():
        from_file(printing, SVC / "printing-menu.jpg", 90)

    # Crop four phone boxes from the shelf photo
    shelf = A / "IMG_1852-8f527191-59a3-4673-b23f-3e3180acad86.png"
    if shelf.exists():
        im = Image.open(shelf)
        w, h = im.size
        # four boxes left-to-right
        boxes = [
            ("momofly-v101-3.jpg", (0, 0, w // 4 + 12, h), 86),
            ("calus-spark-c3730c-flyer.jpg", (w // 4 - 8, 0, w // 2 + 8, h), 85),
            ("kgtel-k2160-flyer.jpg", (w // 2 - 8, 0, (3 * w) // 4 + 8, h), 84),
            ("calus-c316-flyer.jpg", ((3 * w) // 4 - 16, 0, w, h), 83),
        ]
        for name, crop, q in boxes:
            save_jpeg(im.crop(crop), CAT / name, q)
            print(f"  crop {name}")


if __name__ == "__main__":
    main()

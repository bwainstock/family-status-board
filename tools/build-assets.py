#!/usr/bin/env python3
"""
Bakes the Board's text and Glyphs into 1-bit bitmaps the Worker can blit.

ADR 0002 rules out rasterising anything at request time: the Free plan gives the
Worker 10 ms of CPU, and a greyscale intermediate would have to be thresholded
back to pure black and white, destroying exactly the small text the Board
depends on. So everything is rendered here, offline, and committed.

    python3 tools/build-assets.py

Writes worker/src/assets/generated.ts. That file is generated output and is
checked in deliberately: nobody needs Python or a font to build or deploy the
Worker, and the bytes that reach the panel are reviewable in a diff.

Anti-aliasing is disabled for text (`fontmode = "1"`) rather than thresholded
after the fact, because a font hinted for 1-bit output at 20px is legible and a
thresholded grey one is mush.
"""

from __future__ import annotations

import base64
import json
import os
import sys
from dataclasses import dataclass
from typing import Dict, List

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from assets import glyphs as art  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONT_PATH = os.path.join(HERE, "assets", "fonts", "NotoSans-Bold.ttf")
OUT_PATH = os.path.join(ROOT, "worker", "src", "assets", "generated.ts")

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
DIGITS = "0123456789"
PUNCTUATION = " .,:'!?&-/()+\u00b0"

# One role per size. Adding a size is cheap; adding characters to a size is not,
# so each role carries only the characters it can actually be asked to draw.
FONT_ROLES: Dict[str, tuple[int, str]] = {
    # Captions, read by the Caregiver over the Viewer's shoulder.
    "caption": (20, LETTERS + DIGITS + PUNCTUATION),
    # The date across the top bar, which the Viewer is learning to recognise.
    "date": (32, LETTERS + DIGITS + PUNCTUATION),
    # A cell's value line: a temperature, a number of Sleeps, or a short word.
    "value": (34, LETTERS + DIGITS + PUNCTUATION),
    # The Non-School Day headline, legible from across a room.
    "display": (56, "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + DIGITS + " !'-"),
}

# Glyph name -> the sizes it is drawn at. A cell Glyph is 96px (see
# frame/layout.ts), the Non-School Day statement is 128px, and the status corner
# is 32px.
GLYPH_SIZES: Dict[str, List[int]] = {
    "unknown": [96],
    "school": [96],
    "minimum-day": [96],
    "no-school": [96, 128],
    "stale": [32],
    "reauth-needed": [32],
    "charge-reminder": [32],
    "closure-disagreement": [32],
}


@dataclass
class PackedGlyph:
    width: int
    height: int
    left: int
    top: int
    advance: int
    data: str


def pack_bitmap(image: Image.Image) -> str:
    """MSB-first, a set bit is ink — the same packing the framebuffer uses."""
    width, height = image.size
    stride = (width + 7) // 8
    out = bytearray(stride * height)
    pixels = image.load()
    for y in range(height):
        for x in range(width):
            if pixels[x, y]:
                out[y * stride + (x >> 3)] |= 0x80 >> (x & 7)
    return base64.b64encode(bytes(out)).decode("ascii")


def render_char(font: ImageFont.FreeTypeFont, ch: str) -> PackedGlyph:
    advance = round(font.getlength(ch))
    left, top, right, bottom = font.getbbox(ch, anchor="ls")
    width = max(0, right - left)
    height = max(0, bottom - top)

    if width == 0 or height == 0:  # a space, which is advance and nothing else
        return PackedGlyph(0, 0, 0, 0, advance, "")

    canvas = Image.new("1", (width, height), 0)
    draw = ImageDraw.Draw(canvas)
    draw.fontmode = "1"  # no anti-aliasing: the panel has no grey to render into
    draw.text((-left, -top), ch, font=font, fill=1, anchor="ls")

    # Crop to the ink actually drawn. The layout bbox can be a column or two
    # wider than the glyph, and an empty column makes measureText disagree with
    # what lands on the panel — which is exactly how a Caption that "fits"
    # ends up overflowing.
    ink = canvas.getbbox()
    if ink is None:
        return PackedGlyph(0, 0, 0, 0, advance, "")
    canvas = canvas.crop(ink)
    left += ink[0]
    top += ink[1]

    return PackedGlyph(canvas.width, canvas.height, left, top, advance, pack_bitmap(canvas))


def build_font(size: int, charset: str) -> dict:
    font = ImageFont.truetype(FONT_PATH, size)
    ascent, descent = font.getmetrics()
    packed = {ch: render_char(font, ch) for ch in dict.fromkeys(charset)}
    return {
        "size": size,
        "ascent": ascent,
        "lineHeight": ascent + descent,
        "glyphs": {
            ch: {
                "w": g.width,
                "h": g.height,
                "left": g.left,
                "top": g.top,
                "adv": g.advance,
                "data": g.data,
            }
            for ch, g in packed.items()
        },
    }


def build_glyphs() -> dict:
    out = {}
    for name, sizes in GLYPH_SIZES.items():
        for size in sizes:
            image = art.render(name, size, FONT_PATH)
            out[f"{name}@{size}"] = {"w": size, "h": size, "data": pack_bitmap(image)}
    return out


def as_ts(value) -> str:
    return json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False)


def main() -> int:
    if not os.path.exists(FONT_PATH):
        print(f"font not found: {FONT_PATH}", file=sys.stderr)
        return 1

    fonts = {role: build_font(size, charset) for role, (size, charset) in FONT_ROLES.items()}
    glyph_data = build_glyphs()

    body = f"""/**
 * GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:
 *
 *     python3 tools/build-assets.py
 *
 * Bitmaps are base64 of packed 1-bit rows: MSB first, a set bit is ink, which
 * is exactly how the framebuffer packs a row. Font glyphs carry their bearings
 * so that text can be laid out from a baseline without measuring anything at
 * render time.
 *
 * Source: tools/assets/glyphs.py and tools/assets/fonts/NotoSans-Bold.ttf
 * (SIL Open Font License 1.1 — see tools/assets/fonts/OFL.txt).
 */

export interface PackedGlyph {{
  /** Zero for a space, which is an advance and nothing else. */
  readonly w: number;
  readonly h: number;
  /** Offset from the pen position to the left edge of the ink. */
  readonly left: number;
  /** Offset from the baseline to the top of the ink. Negative is above. */
  readonly top: number;
  /** How far the pen moves after drawing, in whole pixels. */
  readonly adv: number;
  readonly data: string;
}}

export interface PackedFont {{
  readonly size: number;
  readonly ascent: number;
  readonly lineHeight: number;
  readonly glyphs: Readonly<Record<string, PackedGlyph>>;
}}

export interface PackedBitmap {{
  readonly w: number;
  readonly h: number;
  readonly data: string;
}}

export const FONTS = {as_ts(fonts)} as const satisfies Readonly<Record<string, PackedFont>>;

export const BITMAPS = {as_ts(glyph_data)} as const satisfies Readonly<Record<string, PackedBitmap>>;

export type FontRole = keyof typeof FONTS;
export type BitmapName = keyof typeof BITMAPS;
"""

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as handle:
        handle.write(body)

    total = sum(len(g["data"]) for f in fonts.values() for g in f["glyphs"].values())
    total += sum(len(b["data"]) for b in glyph_data.values())
    print(f"wrote {OUT_PATH}")
    print(f"  {len(fonts)} font sizes, {len(glyph_data)} bitmaps, {total} base64 chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

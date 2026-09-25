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
# The horizontal ellipsis is baked rather than folded to "..." in
# frame/text.ts: a calendar app that has already truncated a title supplies
# this exact character, and drawing it as itself is truer to that input than
# expanding it into three periods that take up more width than the app meant.
PUNCTUATION = " .,:'!?&-/()+\u00b0@#%*;\"_[]=\u2026"

# Every Latin-1 Supplement letter that is a plain Latin letter plus a single
# diacritic — the accents a household actually types in a name or a borrowed
# word ("Café", "José", "naïve", "crème brûlée"). `frame/text.ts`'s
# normalisation folds an *accented* letter the font was not built with down to
# its base letter, so this set does not have to be exhaustive to keep such a
# letter from vanishing — but a letter baked here draws as itself rather than
# as a fold's approximation of itself, which is strictly better where it's
# affordable, and Western European accents are cheap and common enough to be.
ACCENTED_LATIN = (
    "\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5"  # ÀÁÂÃÄÅ
    "\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5"  # àáâãäå
    "\u00c7\u00e7"  # Çç
    "\u00c8\u00c9\u00ca\u00cb\u00e8\u00e9\u00ea\u00eb"  # ÈÉÊËèéêë
    "\u00cc\u00cd\u00ce\u00cf\u00ec\u00ed\u00ee\u00ef"  # ÌÍÎÏìíîï
    "\u00d1\u00f1"  # Ññ
    "\u00d2\u00d3\u00d4\u00d5\u00d6\u00f2\u00f3\u00f4\u00f5\u00f6"  # ÒÓÔÕÖòóôõö
    "\u00d9\u00da\u00db\u00dc\u00f9\u00fa\u00fb\u00fc"  # ÙÚÛÜùúûü
    "\u00dd\u00fd\u00ff"  # Ýýÿ
)

# Latin letters that are not a base letter plus a diacritic — a ligature (æ,
# Æ) or a stroked letter (ø, Ø, þ, Þ, ð, Ð, ß) — so `frame/text.ts`'s
# accent-stripping fold has no diacritic to grab onto and nothing to fall back
# to. Baked directly instead: the font already has every one of them, and a
# name like "Søren" or "Þór" deserves to render as itself rather than as a
# fold's guess ("Soren", "Thor") that nobody asked for.
OTHER_LATIN_LETTERS = "\u00c6\u00e6\u00d8\u00f8\u00de\u00fe\u00d0\u00f0\u00df"

# The forgiving policy's placeholder for a character it truly cannot carry
# (see `PLACEHOLDER_CHARACTER` in `frame/text.ts`). Baked into *every* role
# below, `display` included, so `foldForDrawing`'s "never nothing" promise is
# true by construction rather than true only for the roles someone remembered
# to widen. A role gaining this one glyph is not the same claim as a role
# gaining the widened charset above — it does not mean `display` is expected
# to draw arbitrary text, only that if it is ever handed some, the one
# character standing in for "could not draw this" is not itself undrawable.
PLACEHOLDER_GLYPH = "\ufffd"  # U+FFFD REPLACEMENT CHARACTER

# One role per size. Adding a size is cheap; adding characters to a size is not,
# so each role carries only the characters it can actually be asked to draw.
FONT_ROLES: Dict[str, tuple[int, str]] = {
    # Captions, read by the Caregiver over the Viewer's shoulder.
    "caption": (20, LETTERS + DIGITS + PUNCTUATION + ACCENTED_LATIN + OTHER_LATIN_LETTERS + PLACEHOLDER_GLYPH),
    # The date across the top bar, which the Viewer is learning to recognise.
    "date": (32, LETTERS + DIGITS + PUNCTUATION + ACCENTED_LATIN + OTHER_LATIN_LETTERS + PLACEHOLDER_GLYPH),
    # A cell's value line: a temperature, a number of Sleeps, or a short word.
    "value": (34, LETTERS + DIGITS + PUNCTUATION + ACCENTED_LATIN + OTHER_LATIN_LETTERS + PLACEHOLDER_GLYPH),
    # The Non-School Day headline, legible from across a room — a fixed
    # vocabulary we author, never text a stranger typed, so it does not need
    # the widened charset the other roles carry. It still carries
    # `PLACEHOLDER_GLYPH`: not because this role is expected to draw arbitrary
    # text, but so that `foldForDrawing`'s "never nothing" guarantee holds for
    # every `FontRole` without an exception nobody remembers to check for.
    # Resist the urge to tidy this back out to match the authored-only
    # vocabulary above it — see `worker/test/text.test.ts`'s test that every
    # role can draw this one character.
    "display": (56, "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + DIGITS + " !'-" + PLACEHOLDER_GLYPH),
}

# Glyph name -> the sizes it is drawn at. A cell Glyph is 96px (see
# frame/layout.ts), the Non-School Day statement is 128px, and the status corner
# is 32px.
GLYPH_SIZES: Dict[str, List[int]] = {
    "unknown": [96],
    "school": [96],
    "minimum-day": [96],
    "no-school": [96, 128],
    "weather-sun": [96],
    "weather-partly-cloudy": [96],
    "weather-cloud": [96],
    "weather-rain": [96],
    "weather-snow": [96],
    "weather-wind": [96],
    "weather-hot": [96],
    "weather-cold": [96],
    "food-pizza": [96],
    "food-sandwich": [96],
    "food-pasta": [96],
    "food-chicken": [96],
    "food-taco": [96],
    "food-burger": [96],
    "food-corn-dog": [96],
    "food-hot-dog": [96],
    "food-breakfast": [96],
    "food-salad": [96],
    "food-unknown": [96],
    # Event Glyphs are unprefixed because one of them is `no-school`, shared
    # with the School Cell. Counting Sleeps toward a day off should show the
    # same house she sees on the day itself, and a prefix would mean either a
    # second copy of the art or a special case in the renderer.
    "party": [96],
    "dress-up": [96],
    "book": [96],
    "sports": [96],
    "star": [96],
    "tomorrow": [32],
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

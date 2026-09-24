"""
Source artwork for the Board's Glyphs.

Every Glyph is defined here as drawing instructions in a unit square, not as a
bitmap file. That keeps the art reviewable in a diff, re-renderable at any size,
and free of a binary asset pipeline — and a Glyph that needs to be bolder is a
one-line change rather than a trip through an image editor.

Two rules govern everything in this file:

  * The Viewer cannot read. A Glyph carries its fact on its own; the Caption
    beside it is for the Caregiver.
  * The panel is 1 bit and she looks at it from across a room. Shapes are bold,
    solid and widely spaced. Fine detail does not survive the trip.

Coordinates are fractions of the glyph box, so `pen.circle(0.5, 0.5, 0.3)` is a
circle of radius three tenths in the middle whatever size it is rendered at.
Rendering happens at 4x and is then downsampled and thresholded, which is what
gives curves a clean edge on a 1-bit panel.
"""

from __future__ import annotations

import math
from typing import Callable, Dict

from PIL import Image, ImageDraw, ImageFont

INK = 255
PAPER = 0


class Pen:
    """Draws in unit coordinates onto a supersampled greyscale canvas."""

    def __init__(self, draw: ImageDraw.ImageDraw, size: float, font_path: str) -> None:
        self._d = draw
        self._s = size
        self._font_path = font_path

    # -- primitives -------------------------------------------------------

    def _p(self, x: float, y: float) -> tuple[float, float]:
        return (x * self._s, y * self._s)

    def circle(self, cx: float, cy: float, r: float, fill: bool = True, width: float = 0.0) -> None:
        box = [
            (cx - r) * self._s,
            (cy - r) * self._s,
            (cx + r) * self._s,
            (cy + r) * self._s,
        ]
        if fill:
            self._d.ellipse(box, fill=INK)
        else:
            self._d.ellipse(box, outline=INK, width=max(1, round(width * self._s)))

    def rect(self, x0: float, y0: float, x1: float, y1: float, fill: bool = True, width: float = 0.0) -> None:
        box = [x0 * self._s, y0 * self._s, x1 * self._s, y1 * self._s]
        if fill:
            self._d.rectangle(box, fill=INK)
        else:
            self._d.rectangle(box, outline=INK, width=max(1, round(width * self._s)))

    def round_rect(
        self, x0: float, y0: float, x1: float, y1: float, r: float, fill: bool = True, width: float = 0.0
    ) -> None:
        box = [x0 * self._s, y0 * self._s, x1 * self._s, y1 * self._s]
        if fill:
            self._d.rounded_rectangle(box, radius=r * self._s, fill=INK)
        else:
            self._d.rounded_rectangle(
                box, radius=r * self._s, outline=INK, width=max(1, round(width * self._s))
            )

    def line(self, x0: float, y0: float, x1: float, y1: float, width: float) -> None:
        self._d.line([self._p(x0, y0), self._p(x1, y1)], fill=INK, width=max(1, round(width * self._s)))

    def polygon(self, points: list[tuple[float, float]]) -> None:
        self._d.polygon([self._p(x, y) for x, y in points], fill=INK)

    def arc(self, cx: float, cy: float, r: float, start: float, end: float, width: float) -> None:
        box = [
            (cx - r) * self._s,
            (cy - r) * self._s,
            (cx + r) * self._s,
            (cy + r) * self._s,
        ]
        self._d.arc(box, start, end, fill=INK, width=max(1, round(width * self._s)))

    def text(self, s: str, cx: float, cy: float, height: float) -> None:
        """Centre a string at a given cap height. Used where a letterform *is* the Glyph."""
        px = max(1, round(height * self._s))
        font = ImageFont.truetype(self._font_path, px)
        self._d.text(self._p(cx, cy), s, font=font, fill=INK, anchor="mm")

    # -- reusable pieces --------------------------------------------------

    def cloud(self, cx: float, cy: float, w: float) -> None:
        """A bank of cloud centred on (cx, cy), `w` wide."""
        r = w * 0.26
        self.circle(cx - w * 0.26, cy + r * 0.25, r * 0.92)
        self.circle(cx + w * 0.26, cy + r * 0.30, r * 0.85)
        self.circle(cx, cy - r * 0.28, r * 1.12)
        self.rect(cx - w * 0.30, cy + r * 0.10, cx + w * 0.30, cy + r * 1.10)

    def sun(self, cx: float, cy: float, r: float, rays: bool = True) -> None:
        self.circle(cx, cy, r)
        if not rays:
            return
        for i in range(8):
            a = math.radians(i * 45)
            self.line(
                cx + math.cos(a) * r * 1.34,
                cy + math.sin(a) * r * 1.34,
                cx + math.cos(a) * r * 1.86,
                cy + math.sin(a) * r * 1.86,
                0.055,
            )

    def drop(self, cx: float, cy: float, h: float) -> None:
        self.polygon([(cx, cy - h * 0.5), (cx + h * 0.30, cy + h * 0.18), (cx - h * 0.30, cy + h * 0.18)])
        self.circle(cx, cy + h * 0.18, h * 0.30)


# ---------------------------------------------------------------------------
# The Glyphs
# ---------------------------------------------------------------------------


def unknown(p: Pen) -> None:
    """A source failed. Better than a confident wrong Glyph, which is the point."""
    p.round_rect(0.10, 0.10, 0.90, 0.90, 0.16, fill=False, width=0.07)
    p.text("?", 0.50, 0.50, 0.62)


GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "unknown": unknown,
}


# ---------------------------------------------------------------------------
# Status corner — small, and read only by the Caregiver
# ---------------------------------------------------------------------------


def status_stale(p: Pen) -> None:
    """A clock: the facts on this Frame are older than they should be."""
    p.circle(0.5, 0.5, 0.42, fill=False, width=0.10)
    p.line(0.5, 0.5, 0.5, 0.24, 0.10)
    p.line(0.5, 0.5, 0.70, 0.58, 0.10)


def status_reauth(p: Pen) -> None:
    """A key: the events feed needs reauthorising before events come back.

    Axis-aligned on purpose. A diagonal shaft turns to porridge at 32px on a
    1-bit panel, and this is read at arm's length by an adult, not across a room.
    """
    p.circle(0.26, 0.50, 0.20, fill=False, width=0.12)
    p.rect(0.44, 0.44, 0.96, 0.56)
    p.rect(0.66, 0.56, 0.77, 0.78)
    p.rect(0.85, 0.56, 0.96, 0.72)


def status_charge(p: Pen) -> None:
    """A battery: time to take the Board down and charge it."""
    p.round_rect(0.06, 0.26, 0.82, 0.74, 0.08, fill=False, width=0.09)
    p.rect(0.84, 0.41, 0.96, 0.59)
    # A bolt, drawn fat. A thin one loses its middle stroke at this size.
    p.polygon(
        [
            (0.54, 0.30),
            (0.24, 0.55),
            (0.40, 0.55),
            (0.34, 0.70),
            (0.64, 0.45),
            (0.48, 0.45),
        ]
    )


STATUS_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "stale": status_stale,
    "reauth-needed": status_reauth,
    "charge-reminder": status_charge,
}


ALL_GLYPHS: Dict[str, Callable[[Pen], None]] = {**GLYPHS, **STATUS_GLYPHS}


def render(name: str, size: int, font_path: str, supersample: int = 4) -> Image.Image:
    """Render one Glyph to a crisp 1-bit image of `size` x `size`."""
    draw_fn = ALL_GLYPHS[name]
    canvas = Image.new("L", (size * supersample, size * supersample), PAPER)
    pen = Pen(ImageDraw.Draw(canvas), size * supersample, font_path)
    draw_fn(pen)
    # Downsample, then threshold. Anti-aliasing exists only inside this tool;
    # what is committed is pure black and white (ADR 0002).
    small = canvas.resize((size, size), Image.LANCZOS)
    return small.point(lambda v: 255 if v >= 110 else 0, mode="1")

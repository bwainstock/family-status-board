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
from typing import Callable, Dict, Optional

from PIL import Image, ImageDraw, ImageFont

INK = 255
PAPER = 0


class Pen:
    """Draws in unit coordinates onto a supersampled greyscale canvas.

    Pass `color=PAPER` to knock a shape back out of something already drawn.
    That is how detail gets onto a solid silhouette without outlining
    everything, and a solid silhouette is what survives best at 96px on a
    1-bit panel seen from across a room.
    """

    def __init__(self, draw: ImageDraw.ImageDraw, size: float, font_path: str) -> None:
        self._d = draw
        self._s = size
        self._font_path = font_path

    # -- primitives -------------------------------------------------------

    def _p(self, x: float, y: float) -> tuple[float, float]:
        return (x * self._s, y * self._s)

    def _box(self, x0: float, y0: float, x1: float, y1: float) -> list[float]:
        return [x0 * self._s, y0 * self._s, x1 * self._s, y1 * self._s]

    def _w(self, width: float) -> int:
        return max(1, round(width * self._s))

    def circle(
        self, cx: float, cy: float, r: float, fill: bool = True, width: float = 0.0, color: int = INK
    ) -> None:
        box = self._box(cx - r, cy - r, cx + r, cy + r)
        if fill:
            self._d.ellipse(box, fill=color)
        else:
            self._d.ellipse(box, outline=color, width=self._w(width))

    def rect(
        self,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        fill: bool = True,
        width: float = 0.0,
        color: int = INK,
    ) -> None:
        box = self._box(x0, y0, x1, y1)
        if fill:
            self._d.rectangle(box, fill=color)
        else:
            self._d.rectangle(box, outline=color, width=self._w(width))

    def round_rect(
        self,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        r: float,
        fill: bool = True,
        width: float = 0.0,
        color: int = INK,
    ) -> None:
        box = self._box(x0, y0, x1, y1)
        radius = r * self._s
        if fill:
            self._d.rounded_rectangle(box, radius=radius, fill=color)
        else:
            self._d.rounded_rectangle(box, radius=radius, outline=color, width=self._w(width))

    def line(self, x0: float, y0: float, x1: float, y1: float, width: float, color: int = INK) -> None:
        self._d.line([self._p(x0, y0), self._p(x1, y1)], fill=color, width=self._w(width))

    def polygon(self, points: list[tuple[float, float]], color: int = INK) -> None:
        self._d.polygon([self._p(x, y) for x, y in points], fill=color)

    def arc(
        self, cx: float, cy: float, r: float, start: float, end: float, width: float, color: int = INK
    ) -> None:
        self._d.arc(self._box(cx - r, cy - r, cx + r, cy + r), start, end, fill=color, width=self._w(width))

    def text(self, s: str, cx: float, cy: float, height: float, color: int = INK) -> None:
        """Centre a string at a given cap height. Used where a letterform *is* the Glyph."""
        font = ImageFont.truetype(self._font_path, max(1, round(height * self._s)))
        self._d.text(self._p(cx, cy), s, font=font, fill=color, anchor="mm")

    # -- reusable pieces --------------------------------------------------

    def cloud(self, cx: float, cy: float, w: float, color: int = INK) -> None:
        """A bank of cloud centred on (cx, cy), `w` wide."""
        r = w * 0.26
        self.circle(cx - w * 0.26, cy + r * 0.25, r * 0.92, color=color)
        self.circle(cx + w * 0.26, cy + r * 0.30, r * 0.85, color=color)
        self.circle(cx, cy - r * 0.28, r * 1.12, color=color)
        self.rect(cx - w * 0.30, cy + r * 0.10, cx + w * 0.30, cy + r * 1.10, color=color)

    def sun(self, cx: float, cy: float, r: float, rays: bool = True, color: int = INK) -> None:
        self.circle(cx, cy, r, color=color)
        if not rays:
            return
        for i in range(8):
            a = math.radians(i * 45)
            self.line(
                cx + math.cos(a) * r * 1.34,
                cy + math.sin(a) * r * 1.34,
                cx + math.cos(a) * r * 1.88,
                cy + math.sin(a) * r * 1.88,
                0.055,
                color=color,
            )

    def drop(self, cx: float, cy: float, h: float, color: int = INK) -> None:
        self.polygon(
            [(cx, cy - h * 0.5), (cx + h * 0.30, cy + h * 0.18), (cx - h * 0.30, cy + h * 0.18)],
            color=color,
        )
        self.circle(cx, cy + h * 0.18, h * 0.30, color=color)

    def clock(self, cx: float, cy: float, r: float, color: int = INK, stroke: float = 0.055) -> None:
        """A clock face reading a little past the hour."""
        self.circle(cx, cy, r, fill=False, width=stroke, color=color)
        self.line(cx, cy, cx, cy - r * 0.62, stroke, color=color)
        self.line(cx, cy, cx + r * 0.52, cy + r * 0.26, stroke, color=color)


# ---------------------------------------------------------------------------
# Cell Glyphs
# ---------------------------------------------------------------------------


def unknown(p: Pen) -> None:
    """A source failed. Better than a confident wrong Glyph, which is the point."""
    p.round_rect(0.10, 0.10, 0.90, 0.90, 0.16, fill=False, width=0.07)
    p.text("?", 0.50, 0.50, 0.62)


def _backpack(p: Pen) -> None:
    """A solid backpack. Shared by the two states that mean 'there is school'."""
    p.round_rect(0.43, 0.12, 0.57, 0.33, 0.05, fill=False, width=0.05)
    p.round_rect(0.15, 0.26, 0.85, 0.93, 0.18)
    p.rect(0.15, 0.49, 0.85, 0.55, color=PAPER)
    p.round_rect(0.33, 0.62, 0.67, 0.87, 0.06, color=PAPER)
    p.rect(0.45, 0.69, 0.55, 0.73)


def school(p: Pen) -> None:
    """There is school today, and it is a normal one."""
    _backpack(p)


def minimum_day(p: Pen) -> None:
    """There is school, and an Entrée, but it finishes early.

    Deliberately the backpack plus a clock rather than a new silhouette: it is a
    school day, and it should read as one at a glance and as different on a
    second look. A Non-School Day, which is a different kind of day, gets a
    different silhouette instead.
    """
    _backpack(p)
    p.circle(0.78, 0.78, 0.27, color=PAPER)
    p.clock(0.78, 0.78, 0.20, stroke=0.05)


def no_school(p: Pen) -> None:
    """No school today. A house, because she is staying where she is.

    A different silhouette from the backpack on purpose — this is the fact the
    Viewer must not be able to misread from across the room.
    """
    p.polygon([(0.50, 0.09), (0.97, 0.50), (0.03, 0.50)])
    p.rect(0.14, 0.47, 0.86, 0.92)
    p.rect(0.42, 0.64, 0.58, 0.92, color=PAPER)
    p.rect(0.23, 0.58, 0.35, 0.70, color=PAPER)
    p.rect(0.65, 0.58, 0.77, 0.70, color=PAPER)


GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "unknown": unknown,
    "school": school,
    "minimum-day": minimum_day,
    "no-school": no_school,
}


# ---------------------------------------------------------------------------
# Status corner — small, and read only by the Caregiver
# ---------------------------------------------------------------------------


def status_stale(p: Pen) -> None:
    """A clock: the facts on this Frame are older than they should be."""
    p.clock(0.5, 0.5, 0.42, stroke=0.10)


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
    p.polygon([(0.54, 0.30), (0.24, 0.55), (0.40, 0.55), (0.34, 0.70), (0.64, 0.45), (0.48, 0.45)])


def status_disagreement(p: Pen) -> None:
    """A live source says the school is shut on a day the closure table calls a
    school day. The table still wins (ADR 0003), but the Caregiver is told."""
    p.polygon([(0.50, 0.05), (0.99, 0.93), (0.01, 0.93)])
    p.rect(0.43, 0.40, 0.57, 0.68, color=PAPER)
    p.rect(0.43, 0.74, 0.57, 0.86, color=PAPER)


STATUS_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "stale": status_stale,
    "reauth-needed": status_reauth,
    "charge-reminder": status_charge,
    "closure-disagreement": status_disagreement,
}


ALL_GLYPHS: Dict[str, Callable[[Pen], None]] = {**GLYPHS, **STATUS_GLYPHS}


def render(
    name: str, size: int, font_path: str, supersample: int = 4, threshold: Optional[int] = None
) -> Image.Image:
    """Render one Glyph to a crisp 1-bit image of `size` x `size`."""
    draw_fn = ALL_GLYPHS[name]
    canvas = Image.new("L", (size * supersample, size * supersample), PAPER)
    pen = Pen(ImageDraw.Draw(canvas), size * supersample, font_path)
    draw_fn(pen)
    # Downsample, then threshold. Anti-aliasing exists only inside this tool;
    # what is committed is pure black and white (ADR 0002).
    cut = 110 if threshold is None else threshold
    small = canvas.resize((size, size), Image.LANCZOS)
    return small.point(lambda v: 255 if v >= cut else 0, mode="1")

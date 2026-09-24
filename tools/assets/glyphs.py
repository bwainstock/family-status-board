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
# Weather — chosen for what to wear, not for meteorological accuracy
# ---------------------------------------------------------------------------


def weather_sun(p: Pen) -> None:
    p.sun(0.50, 0.50, 0.24)


def weather_partly_cloudy(p: Pen) -> None:
    p.sun(0.66, 0.30, 0.19)
    # A paper gap first, so the cloud reads as being in front of the sun rather
    # than welded to it.
    p.cloud(0.42, 0.68, 0.80, color=PAPER)
    p.cloud(0.42, 0.66, 0.72)


def weather_cloud(p: Pen) -> None:
    p.cloud(0.50, 0.50, 0.88)


def weather_rain(p: Pen) -> None:
    p.cloud(0.50, 0.36, 0.84)
    for x in (0.27, 0.50, 0.73):
        p.drop(x, 0.80, 0.26)


def weather_snow(p: Pen) -> None:
    p.cloud(0.50, 0.34, 0.84)
    for cx, cy in ((0.24, 0.74), (0.50, 0.87), (0.76, 0.74)):
        _snowflake(p, cx, cy, 0.115)


def _snowflake(p: Pen, cx: float, cy: float, r: float) -> None:
    for i in range(3):
        a = math.radians(i * 60)
        dx, dy = math.cos(a) * r, math.sin(a) * r
        p.line(cx - dx, cy - dy, cx + dx, cy + dy, 0.042)


def weather_wind(p: Pen) -> None:
    """Three swooshes, the outer two curling back toward the middle.

    The curls need a radius well over the stroke width or they fill in solid at
    96px and the whole thing reads as three plain bars.
    """
    stroke, curl = 0.07, 0.14
    p.line(0.08, 0.24, 0.60, 0.24, stroke)
    p.arc(0.60, 0.24 + curl, curl, -90, 180, stroke)
    p.line(0.08, 0.52, 0.90, 0.52, stroke)
    p.line(0.08, 0.80, 0.54, 0.80, stroke)
    p.arc(0.54, 0.80 - curl, curl, 90, 360, stroke)


def weather_hot(p: Pen) -> None:
    """Sunglasses. The question is what to wear, and this is the answer."""
    p.round_rect(0.08, 0.36, 0.45, 0.70, 0.10)
    p.round_rect(0.55, 0.36, 0.92, 0.70, 0.10)
    p.rect(0.45, 0.42, 0.55, 0.50)
    p.line(0.09, 0.38, 0.02, 0.30, 0.07)
    p.line(0.91, 0.38, 0.98, 0.30, 0.07)


def weather_cold(p: Pen) -> None:
    """A woolly hat, bobble and all."""
    p.circle(0.50, 0.11, 0.09)
    p.rect(0.45, 0.16, 0.55, 0.30)
    p.circle(0.50, 0.58, 0.34)
    p.rect(0.00, 0.62, 1.00, 1.00, color=PAPER)
    p.round_rect(0.09, 0.62, 0.91, 0.83, 0.09)
    for x in (0.30, 0.50, 0.70):
        p.rect(x - 0.02, 0.66, x + 0.02, 0.79, color=PAPER)


WEATHER_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "weather-sun": weather_sun,
    "weather-partly-cloudy": weather_partly_cloudy,
    "weather-cloud": weather_cloud,
    "weather-rain": weather_rain,
    "weather-snow": weather_snow,
    "weather-wind": weather_wind,
    "weather-hot": weather_hot,
    "weather-cold": weather_cold,
}


# ---------------------------------------------------------------------------
# Entrées — one dish standing for the whole lunch
# ---------------------------------------------------------------------------


def food_pizza(p: Pen) -> None:
    """A slice, point down. Crust at the top so it is not read as a sandwich."""
    p.polygon([(0.08, 0.22), (0.92, 0.22), (0.50, 0.94)])
    p.round_rect(0.04, 0.10, 0.96, 0.26, 0.07)
    p.circle(0.33, 0.40, 0.075, color=PAPER)
    p.circle(0.66, 0.40, 0.075, color=PAPER)
    p.circle(0.50, 0.62, 0.075, color=PAPER)


def food_sandwich(p: Pen) -> None:
    """Seen from the side: bread, lettuce, filling, bread.

    Drawn as four separated bands rather than one outlined shape. On a 1-bit
    panel an outline at this size closes up, and the stack is the whole point.
    The gaps have to be a good 6px at 96 or the layers weld together.
    """
    p.round_rect(0.08, 0.14, 0.92, 0.32, 0.08)
    # Lettuce: a scalloped band, deliberately wider than the bread.
    for i in range(8):
        p.circle(0.06 + i * 0.126, 0.42, 0.07)
    p.rect(0.04, 0.38, 0.96, 0.46)
    p.rect(0.06, 0.55, 0.94, 0.63)
    p.round_rect(0.08, 0.69, 0.92, 0.87, 0.08)


def food_chicken(p: Pen) -> None:
    """A drumstick. The most recognisable piece of chicken there is."""
    p.circle(0.62, 0.36, 0.29)
    p.circle(0.44, 0.54, 0.21)
    p.line(0.42, 0.58, 0.26, 0.74, 0.115)
    p.circle(0.15, 0.76, 0.095)
    p.circle(0.25, 0.87, 0.095)
    p.line(0.15, 0.76, 0.25, 0.87, 0.10)
    # A paper notch where bone meets meat, so the joint reads.
    p.line(0.36, 0.60, 0.30, 0.66, 0.035, color=PAPER)


def food_taco(p: Pen) -> None:
    """A folded shell with the filling heaped out of the top."""
    for x in (0.26, 0.42, 0.58, 0.74):
        p.circle(x, 0.38, 0.115)
    p.rect(0.16, 0.38, 0.84, 0.50)
    # The shell: the bottom half of a disc, with the top half knocked away.
    p.circle(0.50, 0.46, 0.42)
    p.rect(0.00, 0.00, 1.00, 0.46, color=PAPER)
    # The rim, so the shell and the filling do not weld into one blob.
    p.rect(0.04, 0.50, 0.96, 0.545, color=PAPER)
    p.rect(0.16, 0.38, 0.84, 0.50)
    for x in (0.26, 0.42, 0.58, 0.74):
        p.circle(x, 0.38, 0.115)


def food_salad(p: Pen) -> None:
    """A wide bowl with a flanged rim and leaves standing proud of it.

    The flange and the foot are what keep it from reading as a taco shell. The
    bowl is drawn first: the knockout that makes it a half-disc would otherwise
    take the leaves with it.
    """
    p.circle(0.50, 0.56, 0.36)
    p.rect(0.00, 0.00, 1.00, 0.56, color=PAPER)
    p.rect(0.36, 0.88, 0.64, 0.95)
    p.rect(0.02, 0.48, 0.98, 0.56)
    for cx, cy, r in ((0.26, 0.32, 0.15), (0.50, 0.24, 0.18), (0.74, 0.32, 0.15)):
        p.circle(cx, cy, r)
    p.rect(0.14, 0.28, 0.86, 0.44)
    p.circle(0.50, 0.28, 0.12, color=PAPER)


def food_unknown(p: Pen) -> None:
    """A plate and cutlery.

    Deliberately not the question-mark Glyph: an unmapped Entrée means there
    *is* a lunch and the table has not learned its picture yet, which is a
    different thing from a source that failed.
    """
    p.circle(0.50, 0.50, 0.30, fill=False, width=0.065)
    p.circle(0.50, 0.50, 0.13)
    for x in (0.06, 0.12, 0.18):
        p.rect(x, 0.16, x + 0.035, 0.36)
    p.rect(0.05, 0.34, 0.215, 0.42)
    p.round_rect(0.105, 0.40, 0.155, 0.86, 0.025)
    p.polygon([(0.84, 0.16), (0.93, 0.20), (0.93, 0.50), (0.84, 0.50)])
    p.round_rect(0.855, 0.48, 0.905, 0.86, 0.025)


def food_pasta(p: Pen) -> None:
    """A bowl of noodles with a meatball on top."""
    for i, y in enumerate((0.16, 0.26, 0.36)):
        p.arc(0.50, y + 0.10, 0.30 - i * 0.02, 180, 360, 0.06)
    p.circle(0.66, 0.36, 0.11)
    p.polygon([(0.06, 0.50), (0.94, 0.50), (0.76, 0.88), (0.24, 0.88)])
    p.round_rect(0.14, 0.86, 0.86, 0.94, 0.04)


def food_burger(p: Pen) -> None:
    """Bun, patty, bun. Sesame seeds on top, because that is how it is drawn."""
    p.arc(0.50, 0.44, 0.44, 180, 360, 0.001)
    p.circle(0.50, 0.44, 0.44)
    p.rect(0.06, 0.44, 0.94, 0.94, color=PAPER)
    for x, y in ((0.34, 0.28), (0.52, 0.22), (0.68, 0.30)):
        p.round_rect(x, y, x + 0.08, y + 0.05, 0.025, color=PAPER)
    p.rect(0.06, 0.46, 0.94, 0.58)
    p.round_rect(0.04, 0.60, 0.96, 0.72, 0.05)
    p.round_rect(0.08, 0.74, 0.92, 0.92, 0.09)


def food_corn_dog(p: Pen) -> None:
    """On a stick, standing up. The stick is what separates it from a hot dog."""
    p.rect(0.455, 0.72, 0.545, 0.98)
    p.round_rect(0.28, 0.06, 0.72, 0.78, 0.22)
    for i in range(4):
        y = 0.18 + i * 0.15
        p.line(0.30, y, 0.70, y - 0.10, 0.035, color=PAPER)


def food_hot_dog(p: Pen) -> None:
    """In a split bun, lying down, with a zigzag of mustard."""
    p.round_rect(0.04, 0.54, 0.96, 0.80, 0.13)
    p.round_rect(0.10, 0.30, 0.90, 0.58, 0.14)
    p.round_rect(0.06, 0.44, 0.94, 0.62, 0.09)
    p.round_rect(0.10, 0.30, 0.90, 0.52, 0.11)
    points = [(0.18 + i * 0.104, 0.36 if i % 2 == 0 else 0.46) for i in range(7)]
    for i in range(len(points) - 1):
        p.line(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], 0.045, color=PAPER)


def food_breakfast(p: Pen) -> None:
    """A stack with a pat of butter. Breakfast-for-lunch is on the real menu."""
    p.round_rect(0.08, 0.44, 0.92, 0.60, 0.07)
    p.round_rect(0.05, 0.58, 0.95, 0.76, 0.08)
    p.round_rect(0.08, 0.74, 0.92, 0.90, 0.07)
    p.rect(0.08, 0.57, 0.92, 0.60, color=PAPER)
    p.rect(0.08, 0.73, 0.92, 0.76, color=PAPER)
    p.round_rect(0.40, 0.28, 0.60, 0.44, 0.04)


FOOD_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "food-pizza": food_pizza,
    "food-sandwich": food_sandwich,
    "food-pasta": food_pasta,
    "food-chicken": food_chicken,
    "food-taco": food_taco,
    "food-burger": food_burger,
    "food-corn-dog": food_corn_dog,
    "food-hot-dog": food_hot_dog,
    "food-breakfast": food_breakfast,
    "food-salad": food_salad,
    "food-unknown": food_unknown,
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


# --- Events -----------------------------------------------------------------
#
# What is being counted toward. These stand for a whole category rather than
# for one event: "party" carries the Fall Festival, Movie Night and the dance
# alike, because what she needs to know is that something fun is coming, not
# which committee organised it.


def event_party(p: Pen) -> None:
    """A balloon. Bunting was tried first and closes up into a solid mass at
    96px; a balloon holds its silhouette at any size, and to a five-year-old it
    means the same thing."""
    p.circle(0.50, 0.38, 0.30)
    # The knot, a small triangle under the balloon.
    p.polygon([(0.43, 0.66), (0.57, 0.66), (0.50, 0.76)])
    # The string: straight, with one small curl at the end. Two arcs were tried
    # and came out as a jagged squiggle at 96px.
    p.line(0.50, 0.74, 0.50, 0.90, 0.035)
    p.arc(0.42, 0.90, 0.08, -80, 80, 0.035)


def event_dress_up(p: Pen) -> None:
    """A t-shirt. Spirit Day means wearing something particular, and clothing
    is the one Glyph that says "you have to do something about this"."""
    p.polygon(
        [
            (0.33, 0.19),
            (0.67, 0.19),
            (0.96, 0.35),
            (0.83, 0.57),
            (0.75, 0.50),
            (0.75, 0.88),
            (0.25, 0.88),
            (0.25, 0.50),
            (0.17, 0.57),
            (0.04, 0.35),
        ]
    )
    # A wide scoop neck. Narrower than this and it closes up at 96px, which is
    # how a t-shirt turns into a rectangle with shoulders.
    p.circle(0.50, 0.19, 0.155, color=PAPER)
    p.rect(0.345, 0.00, 0.655, 0.19, color=PAPER)


def event_book(p: Pen) -> None:
    """An open book, for the Book Fair. Drawn as two outlined pages rather than
    two filled ones: filled, the halves weld into a single brick."""
    for sign in (-1, 1):
        x0 = 0.50 + sign * 0.03
        x1 = 0.50 + sign * 0.45
        page = [(x0, 0.30), (x1, 0.22), (x1, 0.72), (x0, 0.80)]
        p.polygon(page)
        # Hollow each page out, leaving a border. The inset is 0.06 because
        # anything thinner welds shut on the downsample.
        inner = [
            (0.50 + sign * 0.09, 0.38),
            (0.50 + sign * 0.39, 0.31),
            (0.50 + sign * 0.39, 0.66),
            (0.50 + sign * 0.09, 0.73),
        ]
        p.polygon(inner, color=PAPER)
    # The spine, drawn last so neither knockout eats it.
    p.rect(0.465, 0.28, 0.535, 0.82)


def event_sports(p: Pen) -> None:
    """Two footprints, for the Walk-a-thon and Walk to School Day. A shoe was
    tried first and read as an anvil. Footprints say "you will be walking",
    which is exactly what both of those events are."""
    for cx, cy in ((0.28, 0.64), (0.72, 0.36)):
        # The sole: a long oval for the ball of the foot, a round one for the
        # heel, with a gap between so the arch reads.
        p.circle(cx, cy - 0.02, 0.165)
        p.rect(cx - 0.165, cy - 0.02, cx + 0.165, cy + 0.065)
        p.circle(cx, cy + 0.235, 0.125)
        # Toes, above the ball of the foot.
        for i, dx in enumerate((-0.11, -0.01, 0.09)):
            p.circle(cx + dx, cy - 0.235 + abs(i - 1) * 0.03, 0.05)


def event_star(p: Pen) -> None:
    """A five-pointed star: something special, unspecified. The catch-all for
    Science Night, Art Night and Picture Day, none of which has a silhouette a
    pre-literate child would recognise."""
    points = []
    for i in range(10):
        # From the top point, alternating outer and inner radius.
        angle = -math.pi / 2 + i * math.pi / 5
        r = 0.48 if i % 2 == 0 else 0.20
        points.append((0.5 + r * math.cos(angle), 0.5 + r * math.sin(angle)))
    p.polygon(points)


EVENT_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    "party": event_party,
    "dress-up": event_dress_up,
    "book": event_book,
    "sports": event_sports,
    "star": event_star,
}


def tomorrow(p: Pen) -> None:
    """A crescent moon, badged onto a cell that is talking about tomorrow.

    An arrow would have been more literal, but the Board's unit is Sleeps and
    one moon is one sleep. This says "after tonight" in a vocabulary she is
    already being taught, which an arrow does not.
    """
    p.circle(0.50, 0.50, 0.46)
    # Bite the crescent out. A tilted bite was tried and left a thin sliver at
    # the top that vanishes at 32px; the symmetric one holds its weight.
    p.circle(0.68, 0.50, 0.42, color=PAPER)


ALL_GLYPHS: Dict[str, Callable[[Pen], None]] = {
    **GLYPHS,
    **WEATHER_GLYPHS,
    **FOOD_GLYPHS,
    **EVENT_GLYPHS,
    **STATUS_GLYPHS,
    "tomorrow": tomorrow,
}


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

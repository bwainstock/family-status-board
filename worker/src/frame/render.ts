/**
 * Turning a DayModel into pixels.
 *
 * Everything here is drawing and nothing here is deciding. If a question about
 * what is true reaches this file, it belongs in src/day instead.
 *
 * The cells are deliberately uniform: a Glyph, an optional value line, and a
 * Caption. A cell whose source failed still occupies its slot and still draws
 * all three, with a question mark where the Glyph would be. The Frame's shape
 * never changes, so a missing fact is visible rather than invisible.
 */

import { Framebuffer } from "../framebuffer.js";
import {
  STATUS_FLAGS,
  type Sleeps,
  type DayModel,
  type EntreeFact,
  type SchoolState,
  type StatusFlag,
  type WeatherFact,
  type WeatherGlyph,
} from "../day/model.js";
import { formatLongDate } from "../day/clock.js";
import { bitmap, type BitmapName } from "../assets/index.js";
import { drawTextIn } from "./text.js";
import {
  CELLS,
  CELL_ORDER,
  DATE_BOX,
  NON_SCHOOL_MAIN,
  NON_SCHOOL_GLYPH_SIZE,
  NON_SCHOOL_GLYPH_TOP,
  NON_SCHOOL_SIDE,
  STATUS_SLOTS,
  TOP_BAR,
  captionBox,
  glyphBox,
  valueBox,
  type CellName,
  type Rect,
} from "./layout.js";

/** What one cell has to say. `glyph: null` draws the question mark. */
export interface CellContent {
  readonly glyph: BitmapName | null;
  readonly value?: string;
  readonly caption: string;
  /**
   * A small mark in the corner of the Glyph box, qualifying it. Used once, to
   * say that a weather Glyph is about tomorrow rather than about today.
   */
  readonly badge?: BitmapName;
}

export function renderFrame(day: DayModel): Framebuffer {
  const frame = new Framebuffer();
  frame.clear();

  drawTopBar(frame, day);

  if (day.school.kind === "no-school") {
    // No rule: the edge of the inverted slab already divides the panel, and a
    // hairline drawn against solid black would only be a smudge.
    drawNonSchool(frame, day.school.reason);
    drawCell(frame, NON_SCHOOL_SIDE, weatherCell(day.weather));
  } else {
    // Narrowed by the branch above: inside here there is definitely school.
    const school = day.school;
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      drawRule(frame, cell);
      drawCell(frame, cell, cellContent(name, day, school));
    }
  }

  return frame;
}

function cellContent(name: CellName, day: DayModel, school: SchoolDay): CellContent {
  switch (name) {
    case "weather":
      return weatherCell(day.weather);
    case "entree":
      return entreeCell(day.entree);
    case "school":
      return schoolCell(school);
    case "sleeps":
      return sleepsCell(day.sleeps);
  }
}

/**
 * The Sleeps cell: a big number and a picture of what it is counting toward.
 *
 * The number carries no unit. "Sleeps" would not fit beside it, she cannot
 * read it, and the Caption is already spent on the thing itself — which is the
 * more useful of the two, because a number with nothing to wait for is not a
 * count of anything.
 */
export function sleepsCell(sleeps: Sleeps): CellContent {
  if (sleeps === null) return placeholderContent("sleeps");

  if (sleeps.kind === "sleeps") {
    return {
      glyph: `${sleeps.glyph}@96`,
      // Zero Sleeps is today, and "0" would read as nothing left rather than
      // as the day itself.
      value: sleeps.nights === 0 ? "Today" : String(sleeps.nights),
      caption: sleeps.caption,
    };
  }

  // Tomorrow's weather, when nothing is close enough to count toward. The
  // Glyph vocabulary is the same one the Weather Cell uses, so there is
  // nothing new to learn — which is also what makes the two confusable, hence
  // the moon.
  return {
    glyph: `weather-${sleeps.glyph}@96`,
    badge: "tomorrow@32",
    value: `${sleeps.tempF}\u00b0`,
    caption: "Tomorrow",
  };
}

/**
 * A word for each what-to-wear Glyph. The Viewer reads the picture; this is
 * for the Caregiver, and it is what stops "hot" and "sun" looking like the
 * same cell twice.
 */
const WEATHER_CAPTIONS: Record<WeatherGlyph, string> = {
  sun: "Sunny",
  "partly-cloudy": "Some sun",
  cloud: "Cloudy",
  rain: "Rain",
  snow: "Snow",
  wind: "Windy",
  hot: "Hot",
  cold: "Cold",
};

export function weatherCell(weather: WeatherFact | null): CellContent {
  if (weather === null) return { glyph: null, value: "?", caption: "Weather" };
  return {
    glyph: `weather-${weather.glyph}@96`,
    // The degree sign, not "F". She is never going to see Celsius.
    value: `${weather.tempF}\u00b0`,
    caption: WEATHER_CAPTIONS[weather.glyph],
  };
}

export function entreeCell(entree: EntreeFact | null): CellContent {
  if (entree === null) return { glyph: null, value: "?", caption: "Lunch" };
  return { glyph: `food-${entree.glyph}@96`, caption: entree.caption };
}

/**
 * The Glyph for each school state. One map, used by both arrangements, so the
 * three states cannot drift into sharing art: the Viewer cannot read the
 * Caption, and the silhouette is the whole message.
 */
export const SCHOOL_GLYPHS: Record<SchoolState["kind"], BitmapName> = {
  school: "school@96",
  "minimum-day": "minimum-day@96",
  "no-school": "no-school@96",
};

/**
 * A day there is school. The Non-School Day is not a cell substitution — it
 * takes over the whole panel — so the cell renderer never sees it.
 */
export type SchoolDay = Exclude<SchoolState, { kind: "no-school" }>;

/**
 * The School Cell on a day there is school.
 *
 * A Non-School Day is deliberately not expressible here: it takes over the
 * whole panel rather than a 198px cell, and the district's wording ("Martin
 * Luther King Jr. Day") does not fit in one.
 */
export function schoolCell(state: SchoolDay): CellContent {
  switch (state.kind) {
    case "school":
      return { glyph: SCHOOL_GLYPHS.school, caption: "School" };
    case "minimum-day":
      return { glyph: SCHOOL_GLYPHS["minimum-day"], value: "Early", caption: "Out 2 hrs early" };
  }
}

/**
 * The Non-School Day, which the domain calls the most load-bearing fact the
 * Board knows, so it gets the strongest signal a 1-bit panel has: the wide
 * area is inverted and the house and the reason are knocked out of it.
 *
 * From across a room no Glyph resolves, only light and dark. A school day is a
 * light panel with four columns; a Non-School Day is a dark slab that runs up
 * into the date bar. That is a difference the Viewer can read before she has
 * focused on anything.
 */
function drawNonSchool(frame: Framebuffer, reason: string): void {
  frame.fillRect(
    NON_SCHOOL_MAIN.x,
    NON_SCHOOL_MAIN.y,
    NON_SCHOOL_MAIN.width,
    NON_SCHOOL_MAIN.height,
    true,
  );

  const glyph = bitmap("no-school@128");
  frame.blit(
    glyph,
    NON_SCHOOL_MAIN.x + (NON_SCHOOL_MAIN.width - glyph.width) / 2,
    NON_SCHOOL_MAIN.y + NON_SCHOOL_GLYPH_TOP,
    false,
  );
  drawTextIn(frame, nonSchoolReasonBox(), reason, { role: "value", align: "center", ink: false });
}

export function nonSchoolReasonBox(): Rect {
  return {
    x: NON_SCHOOL_MAIN.x,
    y: NON_SCHOOL_MAIN.y + NON_SCHOOL_GLYPH_TOP + NON_SCHOOL_GLYPH_SIZE + 6,
    width: NON_SCHOOL_MAIN.width,
    height: 44,
  };
}

/**
 * Filled, so everything on it is stamped in white. The bar is what makes the
 * date read as a heading rather than as a fifth fact.
 */
function drawTopBar(frame: Framebuffer, day: DayModel): void {
  frame.fillRect(TOP_BAR.x, TOP_BAR.y, TOP_BAR.width, TOP_BAR.height, true);
  drawTextIn(frame, DATE_BOX, formatLongDate(day.date), { role: "date", ink: false });
  drawStatusCorner(frame, day.status);
}

/**
 * The Status Corner. Marks fill from the right, in a fixed order, so a
 * Caregiver learns where each one lives rather than re-reading the corner each
 * morning. The order is the declaration order of StatusFlag.
 *
 * There is one slot per flag the Board can raise (guarded in layout.test.ts),
 * so nothing is ever dropped for want of room.
 */
function drawStatusCorner(frame: Framebuffer, flags: readonly StatusFlag[]): void {
  const shown = STATUS_FLAGS.filter((flag) => flags.includes(flag));
  for (const [i, flag] of shown.entries()) {
    const slot = STATUS_SLOTS[STATUS_SLOTS.length - shown.length + i];
    if (slot === undefined) continue;
    // Stamped in white, because the bar underneath is solid black.
    frame.blit(bitmap(`${flag}@32`), slot.x, slot.y, false);
  }
}

export function drawCell(frame: Framebuffer, cell: Rect, content: CellContent): void {
  const box = glyphBox(cell);
  const glyph = bitmap(content.glyph ?? "unknown@96");
  frame.blit(glyph, box.x + (box.width - glyph.width) / 2, box.y + (box.height - glyph.height) / 2);

  if (content.badge !== undefined) {
    // Top-left of the Glyph box, and cleared to paper first. Every Glyph here
    // is a solid silhouette, so a badge dropped straight on top would merge
    // into whatever it landed on.
    const badge = bitmap(content.badge);
    const inset = BADGE_INSET;
    frame.fillRect(box.x - inset, box.y - inset, badge.width + inset, badge.height + inset, false);
    frame.blit(badge, box.x - inset, box.y - inset);
  }

  if (content.value !== undefined && content.value !== "") {
    drawTextIn(frame, valueBox(cell), content.value, { role: "value", align: "center" });
  }

  drawTextIn(frame, captionBox(cell), content.caption, { role: "caption", align: "center" });
}

/** Clearance around a badge, so it never welds to the Glyph behind it. */
const BADGE_INSET = 4;

/** A region boundary: a single rule on the left edge, skipped at the panel edge. */
function drawRule(frame: Framebuffer, region: Rect): void {
  if (region.x > 0) frame.fillRect(region.x, region.y, 1, region.height, true);
}

/**
 * What a cell says when its source could not answer. The Frame keeps its
 * shape — Glyph, value, Caption — so a missing fact is visible as a gap rather
 * than as a cell that quietly shrinks or disappears.
 *
 * "Lunch" is deliberate and is not a glossary slip -- Captions are written for the
 * Viewer, not for us, so they use the plainest word rather than the domain term. See
 * the note under Language in CONTEXT.md.
 */
const PLACEHOLDER_CAPTIONS: Record<CellName, string> = {
  weather: "Weather",
  entree: "Lunch",
  school: "School",
  sleeps: "Sleeps",
};

function placeholderContent(name: CellName): CellContent {
  return { glyph: null, value: "?", caption: PLACEHOLDER_CAPTIONS[name] };
}

export const PLACEHOLDER_CAPTION_VALUES: readonly string[] = Object.values(PLACEHOLDER_CAPTIONS);

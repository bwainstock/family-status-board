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
import { STATUS_FLAGS, type DayModel, type SchoolState, type StatusFlag } from "../day/model.js";
import { formatLongDate } from "../day/clock.js";
import { bitmap, type BitmapName } from "../assets/index.js";
import { drawTextIn } from "./text.js";
import {
  CELLS,
  CELL_ORDER,
  DATE_BOX,
  NON_SCHOOL_MAIN,
  NON_SCHOOL_GLYPH_SIZE,
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
}

export function renderFrame(day: DayModel): Framebuffer {
  const frame = new Framebuffer();
  frame.clear();

  drawTopBar(frame, day);

  if (day.school.kind === "no-school") {
    drawRule(frame, NON_SCHOOL_SIDE);
    drawNonSchool(frame, day.school.reason);
    drawCell(frame, NON_SCHOOL_SIDE, placeholderContent("weather"));
  } else {
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      drawRule(frame, cell);
      drawCell(frame, cell, name === "school" ? schoolCell(day.school) : placeholderContent(name));
    }
  }

  return frame;
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
 * The School Cell on a day there is school.
 *
 * A Non-School Day is deliberately not expressible here: it takes over the
 * whole panel rather than a 198px cell, and the district's wording ("Martin
 * Luther King Jr. Day") does not fit in one.
 */
export function schoolCell(state: Exclude<SchoolState, { kind: "no-school" }>): CellContent {
  switch (state.kind) {
    case "school":
      return { glyph: SCHOOL_GLYPHS.school, caption: "School" };
    case "minimum-day":
      return { glyph: SCHOOL_GLYPHS["minimum-day"], value: "Early", caption: "Out 2 hrs early" };
  }
}

/**
 * The Non-School Day statement. The Glyph carries the fact for the Viewer; the
 * reason underneath is the district's own wording, for the Caregiver.
 *
 * Issue #8 refines this arrangement; what matters here is that the third school
 * state looks like the different kind of day it is.
 */
function drawNonSchool(frame: Framebuffer, reason: string): void {
  const glyph = bitmap("no-school@128");
  const top = NON_SCHOOL_MAIN.y + 16;
  frame.blit(glyph, NON_SCHOOL_MAIN.x + (NON_SCHOOL_MAIN.width - glyph.width) / 2, top);
  drawTextIn(frame, nonSchoolReasonBox(), reason, { role: "value", align: "center" });
}

export function nonSchoolReasonBox(): Rect {
  return {
    x: NON_SCHOOL_MAIN.x,
    y: NON_SCHOOL_MAIN.y + 16 + NON_SCHOOL_GLYPH_SIZE + 6,
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

  if (content.value !== undefined && content.value !== "") {
    drawTextIn(frame, valueBox(cell), content.value, { role: "value", align: "center" });
  }

  drawTextIn(frame, captionBox(cell), content.caption, { role: "caption", align: "center" });
}

/** A region boundary: a single rule on the left edge, skipped at the panel edge. */
function drawRule(frame: Framebuffer, region: Rect): void {
  if (region.x > 0) frame.fillRect(region.x, region.y, 1, region.height, true);
}

/**
 * Stands in until each cell is wired to its source. The Captions are the ones
 * the finished Board falls back to, so the placeholder Frame is already the
 * shape of the real thing.
 */
const PLACEHOLDER_CAPTIONS: Record<CellName, string> = {
  weather: "Weather",
  entree: "Lunch",
  school: "School",
  countdown: "Sleeps",
};

function placeholderContent(name: CellName): CellContent {
  return { glyph: null, value: "?", caption: PLACEHOLDER_CAPTIONS[name] };
}

export const PLACEHOLDER_CAPTION_VALUES: readonly string[] = Object.values(PLACEHOLDER_CAPTIONS);

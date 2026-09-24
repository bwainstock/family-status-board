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
import type { DayModel } from "../day/model.js";
import { formatLongDate } from "../day/clock.js";
import { bitmap, type BitmapName } from "../assets/index.js";
import { drawTextIn } from "./text.js";
import {
  CELLS,
  CELL_ORDER,
  DATE_BOX,
  NON_SCHOOL_MAIN,
  NON_SCHOOL_SIDE,
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
    drawTextIn(frame, NON_SCHOOL_MAIN, "NO SCHOOL", { role: "display", align: "center" });
    drawCell(frame, NON_SCHOOL_SIDE, placeholderContent("weather"));
  } else {
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      drawRule(frame, cell);
      drawCell(frame, cell, placeholderContent(name));
    }
  }

  return frame;
}

/**
 * Filled, so everything on it is stamped in white. The bar is what makes the
 * date read as a heading rather than as a fifth fact.
 */
function drawTopBar(frame: Framebuffer, day: DayModel): void {
  frame.fillRect(TOP_BAR.x, TOP_BAR.y, TOP_BAR.width, TOP_BAR.height, true);
  drawTextIn(frame, DATE_BOX, formatLongDate(day.date), { role: "date", ink: false });
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

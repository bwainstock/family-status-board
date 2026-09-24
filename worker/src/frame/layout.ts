/**
 * Where everything on the Frame lives.
 *
 * ADR 0002 rules out flexbox and anything that measures itself at render time,
 * so the layout is plain pixel arithmetic pinned in one place. Every number
 * here is in panel pixels with a top-left origin, matching the framebuffer.
 *
 * The Board is 792x272 in landscape. A bar across the top carries the date and
 * a status corner; below it sit four equal cells. A Non-School Day uses a
 * different arrangement entirely because it is a different kind of day, not a
 * school day with a cell swapped out.
 */

import { WIDTH, HEIGHT } from "../framebuffer.js";

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const TOP_BAR: Rect = { x: 0, y: 0, width: WIDTH, height: 56 };

/** The date sits at the left of the bar, inset far enough to not look cramped. */
export const DATE_BOX: Rect = { x: 14, y: 8, width: 560, height: 40 };

/**
 * Four status slots at the right of the bar — one per StatusFlag, so a day
 * where everything has gone wrong at once still has somewhere to put the last
 * mark. Empty when nothing needs attention, which is the point: the corner's
 * presence is itself the signal.
 *
 * Four slots reach left to x=632, which still clears DATE_BOX at x=574.
 */
export const STATUS_SLOT_SIZE = 32;
export const STATUS_SLOT_GAP = 6;
export const STATUS_SLOT_COUNT = 4;
export const STATUS_SLOTS: readonly Rect[] = Array.from(
  { length: STATUS_SLOT_COUNT },
  (_unused, i) => ({
    x:
      WIDTH -
      14 -
      (STATUS_SLOT_COUNT - i) * STATUS_SLOT_SIZE -
      (STATUS_SLOT_COUNT - 1 - i) * STATUS_SLOT_GAP,
    y: (TOP_BAR.height - STATUS_SLOT_SIZE) / 2,
    width: STATUS_SLOT_SIZE,
    height: STATUS_SLOT_SIZE,
  }),
);

export const CELL_ROW_TOP = TOP_BAR.height;
export const CELL_ROW_HEIGHT = HEIGHT - TOP_BAR.height; // 216
export const CELL_COUNT = 4;
export const CELL_WIDTH = WIDTH / CELL_COUNT; // 198

/** The four cells, in the order a Caregiver reads them left to right. */
export type CellName = "weather" | "entree" | "school" | "sleeps";
export const CELL_ORDER: readonly CellName[] = ["weather", "entree", "school", "sleeps"];

export function cellRect(index: number): Rect {
  return {
    x: index * CELL_WIDTH,
    y: CELL_ROW_TOP,
    width: CELL_WIDTH,
    height: CELL_ROW_HEIGHT,
  };
}

export const CELLS: Record<CellName, Rect> = {
  weather: cellRect(0),
  entree: cellRect(1),
  school: cellRect(2),
  sleeps: cellRect(3),
};

/**
 * A cell stacks a Glyph, an optional value line, and a Caption. Offsets are
 * relative to the cell's own origin.
 */
export const GLYPH_SIZE = 96;
export const CELL_GLYPH_DY = 21;
export const CELL_VALUE_DY = 125;
export const CELL_VALUE_HEIGHT = 38;
export const CELL_CAPTION_DY = 169;
export const CELL_CAPTION_HEIGHT = 26;
/** Captions are inset so a full-width Caption still reads as belonging to its cell. */
export const CELL_TEXT_INSET = 8;

export function glyphBox(cell: Rect): Rect {
  return {
    x: cell.x + (cell.width - GLYPH_SIZE) / 2,
    y: cell.y + CELL_GLYPH_DY,
    width: GLYPH_SIZE,
    height: GLYPH_SIZE,
  };
}

export function valueBox(cell: Rect): Rect {
  return {
    x: cell.x + CELL_TEXT_INSET,
    y: cell.y + CELL_VALUE_DY,
    width: cell.width - CELL_TEXT_INSET * 2,
    height: CELL_VALUE_HEIGHT,
  };
}

export function captionBox(cell: Rect): Rect {
  return {
    x: cell.x + CELL_TEXT_INSET,
    y: cell.y + CELL_CAPTION_DY,
    width: cell.width - CELL_TEXT_INSET * 2,
    height: CELL_CAPTION_HEIGHT,
  };
}

/**
 * The Non-School Day arrangement: one large statement occupying most of the
 * panel, with the weather kept to one side because it still applies. There is
 * deliberately no Entrée region — an absent lunch is not an unknown lunch.
 */
export const NON_SCHOOL_MAIN: Rect = {
  x: 0,
  y: CELL_ROW_TOP,
  width: WIDTH - CELL_WIDTH,
  height: CELL_ROW_HEIGHT,
};

export const NON_SCHOOL_SIDE: Rect = {
  x: WIDTH - CELL_WIDTH,
  y: CELL_ROW_TOP,
  width: CELL_WIDTH,
  height: CELL_ROW_HEIGHT,
};

export const NON_SCHOOL_GLYPH_SIZE = 128;

/** Glyph inset from the top of the inverted slab, leaving room for the reason. */
export const NON_SCHOOL_GLYPH_TOP = 16;

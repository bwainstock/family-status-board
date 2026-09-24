/**
 * Turning a DayModel into pixels.
 *
 * Everything here is drawing and nothing here is deciding. If a question about
 * what is true reaches this file, it belongs in src/day instead.
 *
 * At this stage the renderer draws the skeleton — the top bar and the four cell
 * regions at their agreed geometry — so that layout can be reviewed before any
 * asset exists. Content arrives cell by cell in later work.
 */

import { Framebuffer } from "../framebuffer.js";
import type { DayModel } from "../day/model.js";
import {
  CELLS,
  CELL_ORDER,
  DATE_BOX,
  NON_SCHOOL_MAIN,
  NON_SCHOOL_SIDE,
  STATUS_SLOTS,
  TOP_BAR,
  captionBox,
  glyphBox,
  valueBox,
  type Rect,
} from "./layout.js";

export function renderFrame(day: DayModel): Framebuffer {
  const frame = new Framebuffer();
  frame.clear();

  drawTopBar(frame);

  if (day.school.kind === "no-school") {
    drawRegion(frame, NON_SCHOOL_MAIN);
    drawRegion(frame, NON_SCHOOL_SIDE);
  } else {
    for (const name of CELL_ORDER) drawCellSkeleton(frame, CELLS[name]);
  }

  return frame;
}

/** Filled, so a Glyph or Caption on it is stamped in white. */
function drawTopBar(frame: Framebuffer): void {
  frame.fillRect(TOP_BAR.x, TOP_BAR.y, TOP_BAR.width, TOP_BAR.height, true);
  strokeInset(frame, DATE_BOX, false);
  for (const slot of STATUS_SLOTS) strokeInset(frame, slot, false);
}

function drawCellSkeleton(frame: Framebuffer, cell: Rect): void {
  drawRegion(frame, cell);
  strokeInset(frame, glyphBox(cell), true);
  strokeInset(frame, valueBox(cell), true);
  strokeInset(frame, captionBox(cell), true);
}

/** A region boundary: a single rule on the left edge, skipped for the first cell. */
function drawRegion(frame: Framebuffer, region: Rect): void {
  if (region.x > 0) frame.fillRect(region.x, region.y, 1, region.height, true);
}

function strokeInset(frame: Framebuffer, box: Rect, black: boolean): void {
  frame.strokeRect(box.x, box.y, box.width, box.height, black);
}

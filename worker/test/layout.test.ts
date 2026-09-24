import { describe, expect, it } from "vitest";
import { WIDTH, HEIGHT } from "../src/framebuffer.js";
import {
  CELLS,
  CELL_COUNT,
  CELL_ORDER,
  CELL_ROW_TOP,
  CELL_WIDTH,
  DATE_BOX,
  NON_SCHOOL_MAIN,
  NON_SCHOOL_SIDE,
  STATUS_SLOTS,
  STATUS_SLOT_COUNT,
  TOP_BAR,
  captionBox,
  glyphBox,
  valueBox,
  type Rect,
} from "../src/frame/layout.js";
import { STATUS_FLAGS } from "../src/day/model.js";

function contains(outer: Rect, inner: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

/**
 * Layout is pixel arithmetic with no layout engine to catch mistakes, so the
 * invariants that a browser would enforce are asserted here instead. A box that
 * escapes its cell is a Caption bleeding into the next fact.
 */
describe("Frame layout", () => {
  it("covers the panel exactly, with no gap and no overhang", () => {
    expect(TOP_BAR.height + CELLS.weather.height).toBe(HEIGHT);
    expect(CELL_COUNT * CELL_WIDTH).toBe(WIDTH);
    expect(Number.isInteger(CELL_WIDTH)).toBe(true);
  });

  it("tiles the four cells edge to edge below the bar", () => {
    let expectedX = 0;
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      expect(cell.x, `${name} starts where the previous cell ends`).toBe(expectedX);
      expect(cell.y).toBe(CELL_ROW_TOP);
      expect(cell.height).toBe(HEIGHT - TOP_BAR.height);
      expectedX += cell.width;
    }
    expect(expectedX).toBe(WIDTH);
  });

  it("keeps every cell's Glyph, value and Caption boxes inside their cell", () => {
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      expect(contains(cell, glyphBox(cell)), `${name} Glyph box`).toBe(true);
      expect(contains(cell, valueBox(cell)), `${name} value box`).toBe(true);
      expect(contains(cell, captionBox(cell)), `${name} Caption box`).toBe(true);
    }
  });

  it("stacks Glyph, value and Caption without overlapping", () => {
    const cell = CELLS.weather;
    const glyph = glyphBox(cell);
    const value = valueBox(cell);
    const caption = captionBox(cell);
    expect(glyph.y + glyph.height).toBeLessThanOrEqual(value.y);
    expect(value.y + value.height).toBeLessThanOrEqual(caption.y);
  });

  it("keeps the date and the status slots inside the bar, and apart from each other", () => {
    expect(contains(TOP_BAR, DATE_BOX)).toBe(true);
    for (const slot of STATUS_SLOTS) expect(contains(TOP_BAR, slot)).toBe(true);
    expect(DATE_BOX.x + DATE_BOX.width).toBeLessThanOrEqual(STATUS_SLOTS[0]!.x);
  });

  it("gives the status corner one non-overlapping slot per flag the Board can raise", () => {
    // Fewer slots than flags and a bad day silently loses its last mark.
    expect(STATUS_SLOT_COUNT).toBe(STATUS_FLAGS.length);
    expect(STATUS_SLOTS).toHaveLength(STATUS_SLOT_COUNT);
    for (let i = 1; i < STATUS_SLOTS.length; i++) {
      const previous = STATUS_SLOTS[i - 1]!;
      expect(STATUS_SLOTS[i]!.x).toBeGreaterThanOrEqual(previous.x + previous.width);
    }
    const last = STATUS_SLOTS[STATUS_SLOTS.length - 1]!;
    expect(last.x + last.width).toBeLessThanOrEqual(WIDTH);
  });

  /** A Non-School Day is a different arrangement, not a cell substitution. */
  it("splits the Non-School Day panel into a main region and a side region", () => {
    expect(NON_SCHOOL_MAIN.x).toBe(0);
    expect(NON_SCHOOL_MAIN.width + NON_SCHOOL_SIDE.width).toBe(WIDTH);
    expect(NON_SCHOOL_SIDE.x).toBe(NON_SCHOOL_MAIN.width);
    expect(NON_SCHOOL_MAIN.y).toBe(CELL_ROW_TOP);
    expect(NON_SCHOOL_MAIN.width).toBeGreaterThan(CELL_WIDTH);
  });
});

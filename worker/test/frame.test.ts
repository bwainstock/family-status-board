import { describe, expect, it } from "vitest";
import { renderFrame } from "../src/frame/render.js";
import type { DayModel } from "../src/day/model.js";
import { formatLongDate } from "../src/day/clock.js";
import { expectGolden } from "./support/golden.js";
import { Framebuffer, FRAME_BYTES, WIDTH, HEIGHT } from "../src/framebuffer.js";
import { CELLS, CELL_ORDER, DATE_BOX, TOP_BAR, captionBox, glyphBox, type Rect } from "../src/frame/layout.js";

function countInk(frame: Framebuffer, region: Rect): number {
  let count = 0;
  for (let y = region.y; y < region.y + region.height; y++) {
    for (let x = region.x; x < region.x + region.width; x++) {
      if (frame.getPixel(x, y)) count++;
    }
  }
  return count;
}

function day(overrides: Partial<DayModel> = {}): DayModel {
  return {
    date: "2026-09-24",
    weather: null,
    entree: null,
    school: { kind: "school" },
    countdown: null,
    status: [],
    ...overrides,
  };
}

/**
 * Layout is reviewed as a picture, because no object assertion can see a
 * Caption overflowing its cell. See test/support/golden.ts for how to accept a
 * change.
 */
describe("Frame rendering", () => {
  it("always produces exactly the bytes the firmware expects", () => {
    expect(renderFrame(day()).bytes.length).toBe(FRAME_BYTES);
  });

  it("draws the top bar filled, so a Glyph on it is stamped in white", () => {
    const frame = renderFrame(day());
    expect(frame.getPixel(0, 0)).toBe(true);
    expect(frame.getPixel(WIDTH - 1, TOP_BAR.height - 1)).toBe(true);
    // The bar stops exactly where the cells begin.
    expect(frame.getPixel(WIDTH - 1, TOP_BAR.height)).toBe(false);
  });

  it("writes the date in full, in the form the Viewer is learning", () => {
    const frame = renderFrame(day({ date: "2026-09-24" }));
    // The date is white ink punched out of the filled bar.
    let whitePixels = 0;
    for (let y = DATE_BOX.y; y < DATE_BOX.y + DATE_BOX.height; y++) {
      for (let x = DATE_BOX.x; x < DATE_BOX.x + DATE_BOX.width; x++) {
        if (!frame.getPixel(x, y)) whitePixels++;
      }
    }
    expect(whitePixels).toBeGreaterThan(200);
    expect(formatLongDate("2026-09-24")).toBe("September 24, 2026");
  });

  it("draws a Glyph and a Caption in every cell", () => {
    const frame = renderFrame(day());
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      expect(countInk(frame, glyphBox(cell)), `${name} Glyph`).toBeGreaterThan(100);
      expect(countInk(frame, captionBox(cell)), `${name} Caption`).toBeGreaterThan(50);
    }
  });

  it("separates the four cells with a rule at each boundary", () => {
    const frame = renderFrame(day());
    for (const name of CELL_ORDER) {
      const cell = CELLS[name];
      if (cell.x === 0) continue;
      expect(frame.getPixel(cell.x, HEIGHT - 1), `${name} left rule`).toBe(true);
    }
  });

  describe("goldens", () => {
    it("draws the school-day skeleton", () => {
      expectGolden("skeleton-school-day", renderFrame(day()));
    });

    it("draws the Non-School Day skeleton, which is a different arrangement", () => {
      expectGolden(
        "skeleton-non-school-day",
        renderFrame(day({ date: "2026-11-25", school: { kind: "no-school", reason: "Thanksgiving recess" } })),
      );
    });
  });
});

import { describe, expect, it } from "vitest";
import { renderFrame } from "../src/frame/render.js";
import type { DayModel } from "../src/day/model.js";
import { expectGolden } from "./support/golden.js";
import { FRAME_BYTES, WIDTH, HEIGHT } from "../src/framebuffer.js";
import { CELLS, CELL_ORDER, TOP_BAR } from "../src/frame/layout.js";

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

import { describe, expect, it } from "vitest";
import { renderFrame, schoolCell, nonSchoolReasonBox, SCHOOL_GLYPHS } from "../src/frame/render.js";
import type { DayModel } from "../src/day/model.js";
import { formatLongDate } from "../src/day/clock.js";
import { SCHOOL_CALENDAR } from "../src/day/school-calendar.js";
import { textFitsIn } from "../src/frame/text.js";
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

  describe("the School Cell", () => {
    it("draws a different Glyph for each of the three states", () => {
      // The Viewer cannot read the Caption. If two states share their art she
      // has no way to tell a Minimum Day from a normal one, or worse, a
      // Non-School Day from a school day.
      expect(new Set(Object.values(SCHOOL_GLYPHS)).size).toBe(3);
    });

    it("keeps a Minimum Day recognisable as a school day", () => {
      const early = schoolCell({ kind: "minimum-day" });
      expect(early.glyph).not.toBe(SCHOOL_GLYPHS["no-school"]);
      expect(early.caption).toMatch(/early/i);
    });

    it("fits the Minimum Day Caption inside the cell", () => {
      // A Caption that overflows is a silent layout failure: it still renders,
      // it just runs into the neighbouring cell.
      const caption = schoolCell({ kind: "minimum-day" }).caption;
      expect(textFitsIn(captionBox(CELLS.school), caption, "caption")).toBe(true);
    });

    it("fits every closure reason the calendar can produce across the wide panel", () => {
      // "Martin Luther King Jr. Day" is the long one, and it is why a
      // Non-School Day takes the whole panel instead of a 198px cell.
      const reasons = new Set<string>([
        ...Object.values(SCHOOL_CALENDAR.nonSchoolDays),
        "Weekend",
        "Summer break",
      ]);
      for (const reason of reasons) {
        expect(textFitsIn(nonSchoolReasonBox(), reason, "value"), reason).toBe(true);
      }
    });
  });

  describe("goldens", () => {
    it("draws the school-day skeleton", () => {
      expectGolden("skeleton-school-day", renderFrame(day()));
    });

    it("draws a Minimum Day, which is a school day that finishes early", () => {
      expectGolden(
        "school-minimum-day",
        renderFrame(day({ date: "2026-10-26", school: { kind: "minimum-day" } })),
      );
    });

    it("draws the Non-School Day skeleton, which is a different arrangement", () => {
      expectGolden(
        "skeleton-non-school-day",
        renderFrame(day({ date: "2026-11-25", school: { kind: "no-school", reason: "Thanksgiving recess" } })),
      );
    });

    it("marks the corner when a live source disagrees about a closure", () => {
      expectGolden(
        "school-closure-disagreement",
        renderFrame(day({ status: ["stale", "closure-disagreement"] })),
      );
    });

    it("puts the status marks in the same place whatever order they arrive in", () => {
      // The Caregiver should learn where each mark lives rather than re-read
      // the corner every morning.
      const forwards = renderFrame(day({ status: ["stale", "closure-disagreement"] }));
      const backwards = renderFrame(day({ status: ["closure-disagreement", "stale"] }));
      expect(Array.from(backwards.bytes)).toEqual(Array.from(forwards.bytes));
    });
  });
});

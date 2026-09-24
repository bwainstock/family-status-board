import { describe, expect, it } from "vitest";
import {
  renderFrame,
  schoolCell,
  weatherCell,
  entreeCell,
  nonSchoolReasonBox,
  SCHOOL_GLYPHS,
} from "../src/frame/render.js";
import type { DayModel } from "../src/day/model.js";
import { WEATHER_GLYPH_NAMES } from "../src/day/model.js";
import { ENTREE_TABLE, UNMAPPED_ENTREE } from "../src/day/entree.js";
import { formatLongDate } from "../src/day/clock.js";
import { SCHOOL_CALENDAR } from "../src/day/school-calendar.js";
import { textFitsIn } from "../src/frame/text.js";
import { expectGolden } from "./support/golden.js";
import { Framebuffer, FRAME_BYTES, WIDTH, HEIGHT } from "../src/framebuffer.js";
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
  type Rect,
} from "../src/frame/layout.js";

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

  describe("the Non-School Day layout", () => {
    const holiday = day({ date: "2026-11-25", school: { kind: "no-school", reason: "Thanksgiving recess" } });

    function inkFraction(frame: Framebuffer, region: Rect): number {
      return countInk(frame, region) / (region.width * region.height);
    }

    it("reads as a different kind of day before any Glyph is read", () => {
      // The acceptance criterion is "recognisable at a glance from across a
      // room", and at that distance no Glyph resolves -- only light and dark
      // do. So the check is on ink mass, not on any particular mark: the wide
      // area is mostly dark on a Non-School Day and mostly light on a school
      // day. That inversion is legible peripherally, which is the point.
      const schoolDayInk = inkFraction(renderFrame(day()), NON_SCHOOL_MAIN);
      const holidayInk = inkFraction(renderFrame(holiday), NON_SCHOOL_MAIN);

      expect(schoolDayInk).toBeLessThan(0.2);
      expect(holidayInk).toBeGreaterThan(0.8);
    });

    it("still shows the date, which the Viewer is learning to recognise", () => {
      const frame = renderFrame(holiday);
      expect(countInk(frame, DATE_BOX)).toBeGreaterThan(0);
    });

    it("still shows the weather, which is true whether or not there is school", () => {
      const withWeather = renderFrame({ ...holiday, weather: { glyph: "rain", tempF: 48 } });
      const withoutWeather = renderFrame(holiday);
      // Different marks in the side cell: the weather is being drawn, not
      // ignored because it is a holiday.
      expect(countInk(withWeather, NON_SCHOOL_SIDE)).not.toBe(countInk(withoutWeather, NON_SCHOOL_SIDE));
    });

    it("does not offer an Entree, because there is no lunch to have", () => {
      // An empty Lunch cell would be a question the Board cannot answer. The
      // honest move is not to ask it.
      const frame = renderFrame({ ...holiday, entree: { glyph: "pizza", caption: "Pizza" } });
      const ignoring = renderFrame(holiday);
      expect(frame.bytes).toEqual(ignoring.bytes);
    });
  });

  describe("the Weather and Entree cells", () => {
    it("gives every what-to-wear Glyph its own Caption", () => {
      const captions = WEATHER_GLYPH_NAMES.map((glyph) => weatherCell({ glyph, tempF: 70 }).caption);
      expect(new Set(captions).size).toBe(captions.length);
    });

    it("fits every Weather Caption and temperature inside the cell", () => {
      for (const glyph of WEATHER_GLYPH_NAMES) {
        const content = weatherCell({ glyph, tempF: 108 });
        expect(textFitsIn(captionBox(CELLS.weather), content.caption, "caption"), glyph).toBe(true);
        expect(textFitsIn(valueBox(CELLS.weather), content.value ?? "", "value"), glyph).toBe(true);
      }
      // Below freezing is two characters wider than it looks.
      expect(textFitsIn(valueBox(CELLS.weather), weatherCell({ glyph: "cold", tempF: -12 }).value ?? "", "value")).toBe(
        true,
      );
    });

    it("fits every Entree Caption the table can produce", () => {
      for (const rule of ENTREE_TABLE) {
        expect(textFitsIn(captionBox(CELLS.entree), rule.caption, "caption"), rule.caption).toBe(true);
      }
      expect(textFitsIn(captionBox(CELLS.entree), UNMAPPED_ENTREE.caption, "caption")).toBe(true);
    });

    it("still draws a cell when a source failed, so the gap is visible", () => {
      // The Frame's shape never changes. An absent fact must occupy its slot.
      expect(weatherCell(null).glyph).toBeNull();
      expect(entreeCell(null).glyph).toBeNull();
      expect(weatherCell(null).caption).toBe("Weather");
      expect(entreeCell(null).caption).toBe("Lunch");
    });
  });

  describe("goldens", () => {
    it("draws the school-day skeleton", () => {
      expectGolden("skeleton-school-day", renderFrame(day()));
    });

    it("draws a clear day with a mapped Entree", () => {
      expectGolden(
        "cells-clear-and-mapped",
        renderFrame(day({ weather: { glyph: "sun", tempF: 86 }, entree: { glyph: "taco", caption: "Tacos" } })),
      );
    });

    it("draws a rainy day with an Entree the table has not learned", () => {
      expectGolden(
        "cells-rain-and-unmapped",
        renderFrame(day({ weather: { glyph: "rain", tempF: 54 }, entree: UNMAPPED_ENTREE })),
      );
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

    it("draws a Non-School Day with the weather it still makes sense to show", () => {
      expectGolden(
        "non-school-with-weather",
        renderFrame(
          day({
            date: "2027-01-18",
            school: { kind: "no-school", reason: "Martin Luther King Jr. Day" },
            weather: { glyph: "rain", tempF: 48 },
          }),
        ),
      );
    });

    it("draws a weekend, which is the Non-School Day she sees most often", () => {
      expectGolden(
        "non-school-weekend",
        renderFrame(
          day({
            date: "2026-09-26",
            school: { kind: "no-school", reason: "Weekend" },
            weather: { glyph: "sun", tempF: 91 },
          }),
        ),
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

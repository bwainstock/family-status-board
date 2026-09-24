import { describe, expect, it } from "vitest";
import {
  renderFrame,
  schoolCell,
  weatherCell,
  entreeCell,
  countdownCell,
  drawCell,
  nonSchoolReasonBox,
  SCHOOL_GLYPHS,
} from "../src/frame/render.js";
import type { DayModel } from "../src/day/model.js";
import { WEATHER_GLYPH_NAMES, STATUS_FLAGS } from "../src/day/model.js";
import { ENTREE_TABLE, UNMAPPED_ENTREE } from "../src/day/entree.js";
import { EVENT_ALLOWLIST } from "../src/day/events.js";
import { NON_SCHOOL_CAPTION } from "../src/day/countdown.js";
import { bitmap } from "../src/assets/index.js";
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
import { countInk } from "./support/ink.js";

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

/** A day where every source answered. The baseline degradation is measured against. */
function answered(overrides: Partial<DayModel> = {}): DayModel {
  return day({
    weather: { glyph: "partly-cloudy", tempF: 72 },
    entree: { glyph: "pizza", caption: "Pizza" },
    countdown: { kind: "sleeps", sleeps: 4, glyph: "no-school", caption: NON_SCHOOL_CAPTION },
    ...overrides,
  });
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

  describe("the Sleeps cell", () => {
    it("shows the number, because the number is the thing she is counting", () => {
      expect(countdownCell({ kind: "sleeps", sleeps: 4, glyph: "party", caption: "Fall Festival" })).toEqual({
        glyph: "party@96",
        value: "4",
        caption: "Fall Festival",
      });
    });

    it("says Today rather than zero on the day itself", () => {
      // "0" reads as nothing left, which is the opposite of what it means.
      const content = countdownCell({ kind: "sleeps", sleeps: 0, glyph: "party", caption: "Fall Festival" });
      expect(content.value).toBe("Today");
    });

    it("counts toward a day off with the same house it draws on the day", () => {
      // She learns one picture, not two.
      const content = countdownCell({ kind: "sleeps", sleeps: 3, glyph: "no-school", caption: NON_SCHOOL_CAPTION });
      expect(content.glyph).toBe(SCHOOL_GLYPHS["no-school"]);
    });

    it("has a Glyph for every event the allowlist can produce", () => {
      // A rule pointing at art that does not exist throws at render time, on
      // the wall, on the morning of the event.
      for (const rule of EVENT_ALLOWLIST) {
        const content = countdownCell({ kind: "sleeps", sleeps: 1, glyph: rule.glyph, caption: rule.caption });
        expect(() => bitmap(content.glyph!), rule.caption).not.toThrow();
      }
    });

    it("fits every value the cell can show, including a whole school year away", () => {
      for (const value of ["Today", "1", "9", "88", "365"]) {
        const content = countdownCell({ kind: "sleeps", sleeps: 1, glyph: "star", caption: "Art Night" });
        expect(textFitsIn(valueBox(CELLS.countdown), value, "value"), value).toBe(true);
        expect(content.caption).toBeTruthy();
      }
    });

    it("shows tomorrow's weather when nothing is close enough to count", () => {
      expect(countdownCell({ kind: "tomorrow-weather", glyph: "rain", tempF: 54 })).toEqual({
        glyph: "weather-rain@96",
        badge: "tomorrow@32",
        value: "54\u00b0",
        caption: "Tomorrow",
      });
    });

    it("marks the fallback so it cannot be read as today's weather", () => {
      // Same Glyph, same degree sign, a cell apart. Without a mark the Board
      // would appear to be reporting the weather twice and disagreeing with
      // itself.
      const tomorrow = countdownCell({ kind: "tomorrow-weather", glyph: "sun", tempF: 70 });
      const today = weatherCell({ glyph: "sun", tempF: 70 });
      expect(tomorrow.glyph).toBe(today.glyph);
      expect(tomorrow.badge).toBeDefined();
      expect(today.badge).toBeUndefined();
      expect(tomorrow.caption).not.toBe(today.caption);
    });

    it("draws the badge without letting it weld to the Glyph behind it", () => {
      // Every Glyph in this set is a solid silhouette. A badge dropped onto
      // one merges with it and both stop being readable.
      const frame = new Framebuffer();
      frame.clear();
      drawCell(frame, CELLS.countdown, countdownCell({ kind: "tomorrow-weather", glyph: "cloud", tempF: 61 }));

      const box = glyphBox(CELLS.countdown);
      const gutter = { x: box.x - 4, y: box.y + 28, width: 4, height: 8 };
      expect(countInk(frame, gutter)).toBe(0);
    });

    it("never leaves the cell empty, whatever the sources did", () => {
      expect(countdownCell(null).caption).toBe("Sleeps");
      expect(countdownCell(null).value).toBe("?");
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

    it("draws a full school day with every cell answered", () => {
      expectGolden("full-school-day", renderFrame(answered()));
    });

    it("draws the day of the event itself", () => {
      expectGolden(
        "countdown-today",
        renderFrame(
          day({
            weather: { glyph: "sun", tempF: 78 },
            entree: { glyph: "corn-dog", caption: "Corn Dog" },
            countdown: { kind: "sleeps", sleeps: 0, glyph: "dress-up", caption: "Spirit Day" },
          }),
        ),
      );
    });

    it("draws every event Glyph the allowlist can reach", () => {
      // One Frame per Glyph would be five goldens to review; this puts them
      // side by side so they can be compared as a set, which is how a Viewer
      // meets them.
      const frame = new Framebuffer();
      frame.clear();
      for (const [i, name] of ["party", "dress-up", "book", "sports", "star"].entries()) {
        frame.blit(bitmap(`${name}@96` as never), 20 + i * 150, 88);
      }
      expectGolden("event-glyphs", frame);
    });

    it("draws the fallback, which must not read as a second weather cell", () => {
      expectGolden(
        "countdown-tomorrow-weather",
        renderFrame(
          day({
            weather: { glyph: "sun", tempF: 88 },
            entree: { glyph: "burger", caption: "Hamburger" },
            countdown: { kind: "tomorrow-weather", glyph: "rain", tempF: 61 },
          }),
        ),
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

    it("draws each mark on its own, so each one is recognisable alone", () => {
      // The Caregiver will usually see exactly one of these, and has to know
      // which one it is without a second one beside it to compare against.
      for (const flag of STATUS_FLAGS) {
        expectGolden(`status-${flag}`, renderFrame(answered({ status: [flag] })));
      }
    });

    it("draws every mark at once, which is the crowded case", () => {
      expectGolden("status-all", renderFrame(answered({ status: [...STATUS_FLAGS] })));
    });

    it("draws a day with one source missing, which must still look like a day", () => {
      // Side by side with full-school-day: one cell turns into a question
      // mark and nothing else moves.
      expectGolden("degraded-one-cell", renderFrame(answered({ weather: null })));
    });

    it("draws a day with nothing but the calendar left", () => {
      // Everything fetched is gone. The date and the school state come from
      // the checked-in calendar, which is exactly why they survive.
      expectGolden(
        "degraded-every-source-down",
        renderFrame(
          answered({ weather: null, entree: null, countdown: null, status: ["reauth-needed"] }),
        ),
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

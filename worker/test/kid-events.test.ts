import { describe, expect, it } from "vitest";
import { parseIcs } from "../src/sources/ics.js";
import { kidRelevantEvent, kidRelevantEvents, KID_RELEVANT_ALLOWLIST } from "../src/day/kid-events.js";
import { nextTarget, sleepsFor, NON_SCHOOL_CAPTION, SLEEPS_HORIZON } from "../src/day/sleeps.js";
import { SCHOOL_CALENDAR } from "../src/day/school-calendar.js";
import { addDays } from "../src/day/clock.js";
import { WEATHER_GLYPH_NAMES, type WeatherFact } from "../src/day/model.js";
import { captionBox, CELLS } from "../src/frame/layout.js";
import { textFitsIn } from "../src/frame/text.js";
import { fixtureText } from "./support/fixtures.js";

const LIVE_EVENTS = parseIcs(fixtureText("parentsquare.ics"));

/**
 * Names taken verbatim from the recorded feed. Every one of these is a real
 * entry a real parent sees, and not one of them belongs on a five-year-old's
 * bedroom wall.
 *
 * They are listed out rather than described because the point of the list is
 * that no rule could have described them. "Children's Environmental Health"
 * contains the word "children". "Safe, Secure and Loved Workshop" is a child
 * abuse prevention session for adults and reads, out of context, like a
 * kindness assembly.
 */
const MUST_NEVER_APPEAR = [
  "Breast Cancer Workshop",
  "Cervical Cancer Prevention Workshop",
  "What is cancer? Workshop",
  "Safe, Secure and Loved Workshop",
  "Safe, Secured and Loved Workshop",
  "Children's Environmental Health",
];

describe("the event allowlist", () => {
  it("hides everything it has not been told to show", () => {
    // The default, and the reason the rest of this file can be short.
    expect(kidRelevantEvent("PTO General Meeting")).toBeNull();
    expect(kidRelevantEvent("Braised Jackfruit Assembly")).toBeNull();
    expect(kidRelevantEvent("")).toBeNull();
  });

  it("keeps the feed's adult health content off the Board", () => {
    for (const name of MUST_NEVER_APPEAR) {
      expect(kidRelevantEvent(name), name).toBeNull();
    }
  });

  it("keeps that content off the Board when read from the live feed itself", () => {
    // Not the same test. The one above proves the rules reject those strings;
    // this one proves those strings are what the feed actually contains, and
    // it fails if the school renames a workshop into something that slips
    // through.
    const shown = kidRelevantEvents(LIVE_EVENTS).map((event) => event.caption.toLowerCase());
    for (const word of ["cancer", "workshop", "conference", "meeting", "training", "orientation"]) {
      expect(shown.join(" "), word).not.toContain(word);
    }
  });

  it("finds the adult content in the recording, so the test above is not vacuous", () => {
    // If the feed ever stops carrying this, the guard above proves nothing and
    // this test says so out loud rather than staying quietly green.
    const summaries = LIVE_EVENTS.map((event) => event.summary);
    expect(summaries.filter((name) => /cancer/i.test(name)).length).toBeGreaterThan(0);
  });

  it("recognises the school's own misspelling of Spirit Day", () => {
    // The feed says "SPIRTI DAY" and has for years. It is also the event she
    // most needs warning about, being the one where she has to be dressed
    // differently, so a rule that insisted on the correct spelling would fail
    // in exactly the worst place.
    expect(LIVE_EVENTS.map((event) => event.summary)).toContain("SPIRTI DAY");
    expect(kidRelevantEvent("SPIRTI DAY")).toEqual({ glyph: "dress-up", caption: "Spirit Day" });
  });

  it("lets through the things that change her own day", () => {
    expect(kidRelevantEvent("Walk-a-thon")?.glyph).toBe("sports");
    expect(kidRelevantEvent("Fall Festival")?.glyph).toBe("party");
    expect(kidRelevantEvent("Spring Picture Day")?.caption).toBe("Picture Day");
  });

  it("does not answer the closure question, which the calendar owns", () => {
    // The feed carries "NO SCHOOL * 9/28 - 10/02" and a minimum-day notice.
    // ADR 0003 makes the checked-in calendar the authority, and two sources
    // answering one question is how a Board contradicts itself.
    expect(kidRelevantEvent("NO SCHOOL * 9/28 - 10/02")).toBeNull();
    expect(kidRelevantEvent("MINIMUM DAY - DISMISSAL 12:21PM")).toBeNull();
  });

  it("returns dated facts in date order, because a feed is not sorted", () => {
    const dates = kidRelevantEvents(LIVE_EVENTS).map((event) => event.date);
    expect([...dates].sort()).toEqual(dates);
  });

  it("fits every Caption it can produce inside the cell", () => {
    for (const rule of KID_RELEVANT_ALLOWLIST) {
      expect(textFitsIn(captionBox(CELLS.sleeps), rule.caption, "caption"), rule.caption).toBe(true);
    }
    expect(textFitsIn(captionBox(CELLS.sleeps), NON_SCHOOL_CAPTION, "caption")).toBe(true);
  });
});

describe("counting Sleeps", () => {
  const noEvents: never[] = [];

  it("counts whole nights, so tomorrow is one sleep", () => {
    const target = nextTarget("2026-11-24", [{ date: "2026-11-25", glyph: "party", caption: "Fall Festival" }]);
    expect(target?.nights).toBe(1);
  });

  it("counts today as zero, because today is when she needs telling", () => {
    const target = nextTarget("2026-11-25", [{ date: "2026-11-25", glyph: "party", caption: "Fall Festival" }]);
    expect(target).toMatchObject({ nights: 0, caption: "Fall Festival" });
  });

  it("ignores what has already happened", () => {
    expect(nextTarget("2026-11-26", [{ date: "2026-11-25", glyph: "party", caption: "Fall Festival" }], EMPTY))
      .toBeNull();
  });

  it("counts correctly across a month boundary", () => {
    // 31 October to 3 November is three nights, and no arithmetic on month
    // numbers gets that right.
    const target = nextTarget("2026-10-31", [{ date: "2026-11-03", glyph: "star", caption: "Art Night" }]);
    expect(target?.nights).toBe(3);
  });

  it("counts correctly across the daylight-saving change", () => {
    // Clocks go back on 1 November 2026, making one of these nights 25 hours
    // long. Counting elapsed hours and dividing would answer 2.
    const target = nextTarget("2026-10-31", [{ date: "2026-11-02", glyph: "star", caption: "Art Night" }], EMPTY);
    expect(target?.nights).toBe(2);
  });

  it("counts correctly across the spring change too", () => {
    // 14 March 2027 is 23 hours long. Dividing would answer 1.
    const target = nextTarget("2027-03-13", [{ date: "2027-03-15", glyph: "star", caption: "Art Night" }], EMPTY);
    expect(target?.nights).toBe(2);
  });

  it("counts toward a Non-School Day in its own right", () => {
    // Fall recess begins on 28 September 2026.
    const target = nextTarget("2026-09-24", noEvents);
    expect(target).toMatchObject({ date: "2026-09-28", nights: 4, glyph: "no-school" });
  });

  it("counts toward the first day of a recess, not the last", () => {
    const target = nextTarget("2026-11-20", noEvents);
    expect(target?.date).toBe(Object.keys(SCHOOL_CALENDAR.nonSchoolDays).sort().find((d) => d >= "2026-11-20"));
  });

  it("never counts toward the weekend, which would drown out everything else", () => {
    // The calendar table lists weekdays only, so Saturdays are not in it. If
    // they were, the answer would be "the weekend" on four days out of five.
    for (const date of Object.keys(SCHOOL_CALENDAR.nonSchoolDays)) {
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      expect(weekday, date).not.toBe(0);
      expect(weekday, date).not.toBe(6);
    }
  });

  it("prefers the sooner of an event and a Non-School Day", () => {
    const target = nextTarget("2026-09-24", [{ date: "2026-10-15", glyph: "star", caption: "Art Night" }]);
    expect(target?.glyph).toBe("no-school");
  });

  it("prefers the event when the two fall on the same day", () => {
    // "Art Night" tells her more about the day than "No school" does.
    const target = nextTarget("2026-09-24", [{ date: "2026-09-28", glyph: "star", caption: "Art Night" }]);
    expect(target?.caption).toBe("Art Night");
  });

  it("has nothing to say once the school year is behind it", () => {
    expect(nextTarget("2027-07-04", noEvents)).toBeNull();
  });

  it("finds the real next target from the live feed", () => {
    const target = nextTarget("2026-09-24", kidRelevantEvents(LIVE_EVENTS));
    expect(target).not.toBeNull();
    expect(target!.nights).toBeGreaterThanOrEqual(0);
  });
});

/**
 * The fallback. Ten Sleeps is where a number stops being something she can
 * feel and becomes arithmetic, and a cell showing "47" is a cell she has
 * stopped looking at.
 */
describe("the Sleeps horizon", () => {
  const FAR = { ...SCHOOL_CALENDAR, nonSchoolDays: {}, minimumDays: {} };
  const TOMORROW: WeatherFact = { glyph: "rain", tempF: 54 };

  function withEventIn(sleeps: number) {
    return [{ date: addDays("2026-09-24", sleeps), glyph: "star" as const, caption: "Art Night" }];
  }

  it("counts, just below the horizon", () => {
    const sleeps = sleepsFor("2026-09-24", withEventIn(SLEEPS_HORIZON - 1), FAR, TOMORROW);
    expect(sleeps).toMatchObject({ kind: "sleeps", nights: SLEEPS_HORIZON - 1 });
  });

  it("still counts exactly at the horizon", () => {
    // The threshold is inclusive. Ten fingers is ten, not nine.
    const sleeps = sleepsFor("2026-09-24", withEventIn(SLEEPS_HORIZON), FAR, TOMORROW);
    expect(sleeps).toMatchObject({ kind: "sleeps", nights: SLEEPS_HORIZON });
  });

  it("gives up one Sleep past the horizon and shows tomorrow instead", () => {
    const sleeps = sleepsFor("2026-09-24", withEventIn(SLEEPS_HORIZON + 1), FAR, TOMORROW);
    expect(sleeps).toEqual({ kind: "tomorrow-weather", glyph: "rain", tempF: 54 });
  });

  it("shows tomorrow when there is nothing ahead at all", () => {
    expect(sleepsFor("2027-07-04", [], SCHOOL_CALENDAR, TOMORROW)).toMatchObject({
      kind: "tomorrow-weather",
    });
  });

  it("uses the same Glyph vocabulary as today's weather", () => {
    // Nothing new to learn: the rain she sees in the fourth cell is the rain
    // she sees in the first.
    const sleeps = sleepsFor("2027-07-04", [], SCHOOL_CALENDAR, TOMORROW);
    expect(sleeps && "glyph" in sleeps && WEATHER_GLYPH_NAMES).toContain(
      (sleeps as { glyph: string }).glyph,
    );
  });

  it("falls all the way to nothing when there is no forecast either", () => {
    // Which the renderer draws as a question mark. The cell is never empty,
    // but the model does not invent a fact to fill it.
    expect(sleepsFor("2027-07-04", [], SCHOOL_CALENDAR, null)).toBeNull();
  });
});

/** A calendar with no closures, for isolating the event side of the rule. */
const EMPTY = { ...SCHOOL_CALENDAR, nonSchoolDays: {}, minimumDays: {} };

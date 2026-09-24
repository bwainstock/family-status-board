/**
 * The School Cell's facts.
 *
 * This is the fact the Viewer acts on, so each test below names the specific
 * way the Board could tell her something confidently wrong.
 */

import { describe, expect, it } from "vitest";
import { resolveSchool } from "../src/day/school.js";
import { SCHOOL_CALENDAR, validateCalendar, type SchoolCalendar } from "../src/day/school-calendar.js";

describe("the checked-in calendar", () => {
  it("is the elementary table, because secondary early dismissals do not apply", () => {
    // If a regeneration ever produced the district-wide or secondary calendar,
    // the Board would promise an early finish on days she is there until 3pm.
    expect(SCHOOL_CALENDAR.audience).toBe("elementary");
    expect(SCHOOL_CALENDAR.timezone).toBe("America/Los_Angeles");
  });

  it("refuses to load a calendar for the wrong audience", () => {
    expect(() => validateCalendar({ ...SCHOOL_CALENDAR, audience: "secondary" })).toThrow(/audience/);
  });

  it("refuses a table where a day is both shut and finishing early", () => {
    const contradictory: SchoolCalendar = {
      ...SCHOOL_CALENDAR,
      nonSchoolDays: { "2026-10-26": "Fall recess" },
      minimumDays: { "2026-10-26": "Out 2 hours early" },
    };
    expect(() => validateCalendar(contradictory)).toThrow(/both/);
  });

  it("refuses a table whose keys are not calendar dates", () => {
    const sloppy: SchoolCalendar = {
      ...SCHOOL_CALENDAR,
      nonSchoolDays: { "Dec 25": "Winter recess" },
    };
    expect(() => validateCalendar(sloppy)).toThrow(/calendar date/);
  });
});

describe("resolveSchool", () => {
  it("calls an ordinary term-time Tuesday a school day", () => {
    expect(resolveSchool("2026-09-15").state).toEqual({ kind: "school" });
  });

  it("calls a Minimum Day a Minimum Day, not a school day and not a closure", () => {
    // Three states, not a boolean: there is school, there is an Entrée, and it
    // finishes early. Collapsing this into either neighbour loses the pickup time.
    expect(resolveSchool("2026-10-26").state).toEqual({ kind: "minimum-day" });
    expect(resolveSchool("2026-12-18").state).toEqual({ kind: "minimum-day" });
  });

  it("uses the district's own wording for a closure", () => {
    expect(resolveSchool("2026-09-07").state).toEqual({ kind: "no-school", reason: "Labor Day" });
    expect(resolveSchool("2026-09-28").state).toEqual({ kind: "no-school", reason: "Fall recess" });
  });

  it("calls a Saturday inside a recess block the weekend", () => {
    // The district's table lists weekdays only, so nothing distinguishes
    // 2026-10-03 from any other Saturday. "Weekend" is the honest answer; the
    // Board does not invent "Fall recess" from the days either side of it.
    expect(resolveSchool("2026-10-03").state).toEqual({ kind: "no-school", reason: "Weekend" });
  });

  it("prefers the table's wording over 'Weekend' if a closure is ever listed on one", () => {
    // Guarded with a synthetic table because the current data never triggers
    // it. If a future calendar does list a weekend closure, the district's own
    // wording is the more useful answer and must not be overwritten.
    const listsASaturday: SchoolCalendar = {
      ...SCHOOL_CALENDAR,
      nonSchoolDays: { "2026-10-03": "Fall recess" },
    };
    expect(resolveSchool("2026-10-03", {}, listsASaturday).state).toEqual({
      kind: "no-school",
      reason: "Fall recess",
    });
  });

  it("calls a plain term-time Saturday and Sunday the weekend", () => {
    expect(resolveSchool("2026-09-12").state).toEqual({ kind: "no-school", reason: "Weekend" });
    expect(resolveSchool("2026-09-13").state).toEqual({ kind: "no-school", reason: "Weekend" });
  });

  it("holds school on the local holidays the district does not take", () => {
    // Indigenous Peoples' Day and Cesar Chavez Day are on every off-the-shelf
    // US holiday list and are ordinary school days here. This is exactly why
    // ADR 0003 forbids inferring closures from a holiday library.
    expect(resolveSchool("2026-10-12").state).toEqual({ kind: "school" });
    expect(resolveSchool("2027-03-31").state).toEqual({ kind: "school" });
  });

  it.each(["2026-12-14", "2026-12-15", "2026-12-16", "2026-12-17", "2027-05-24", "2027-05-25", "2027-05-26"])(
    "treats the secondary-only early dismissal %s as a normal school day",
    (date) => {
      // The district publishes these as early-out days for secondary students.
      // The extractor deliberately drops them; if one ever leaks into the
      // elementary table the Board tells her she is coming home early when
      // she is not.
      expect(resolveSchool(date).state).toEqual({ kind: "school" });
    },
  );

  it("covers the first and last day of the school year", () => {
    expect(resolveSchool("2026-08-06").state).toEqual({ kind: "school" });
    expect(resolveSchool("2027-05-27").state).toEqual({ kind: "minimum-day" });
  });
});

describe("dates the calendar does not cover", () => {
  it("calls the weeks right after the last day summer, without complaint", () => {
    const summer = resolveSchool("2027-06-15");
    expect(summer.state).toEqual({ kind: "no-school", reason: "Summer break" });
    expect(summer.outsideCalendarYear).toBe(true);
    expect(summer.flags).toEqual([]);
  });

  it("flags itself as stale once a new calendar should have been checked in", () => {
    // Past the summer, "Summer break" stops being a safe guess and becomes a
    // wrong answer in September. ADR 0003 makes regenerating the table an
    // annual human step; this is what tells the Caregiver it is due.
    const nextAutumn = resolveSchool("2027-09-15");
    expect(nextAutumn.flags).toContain("stale");
  });

  it("flags a date long before the calendar starts too", () => {
    // Only reachable with a badly wrong clock, or a table from a future year.
    // Either way the table cannot answer, and saying so beats guessing.
    expect(resolveSchool("2025-11-03").flags).toContain("stale");
  });

  it("stays quiet in the summer just before the year starts", () => {
    const julyBefore = resolveSchool("2026-07-10");
    expect(julyBefore.state).toEqual({ kind: "no-school", reason: "Summer break" });
    expect(julyBefore.flags).toEqual([]);
  });
});

describe("a live source disagreeing about a closure", () => {
  it("keeps the calendar's answer and raises a flag", () => {
    // ADR 0003: the table wins. But a disagreement about the Board's most
    // load-bearing fact must not be silently swallowed either.
    const disputed = resolveSchool("2026-09-15", { liveClosureClaim: true });
    expect(disputed.state).toEqual({ kind: "school" });
    expect(disputed.flags).toEqual(["closure-disagreement"]);
  });

  it("raises the flag on a Minimum Day too", () => {
    expect(resolveSchool("2026-10-26", { liveClosureClaim: true }).flags).toEqual([
      "closure-disagreement",
    ]);
  });

  it("stays quiet when the live source agrees there is no school", () => {
    expect(resolveSchool("2026-09-07", { liveClosureClaim: true }).flags).toEqual([]);
  });

  it("treats no signal and a 'school is open' signal as unremarkable", () => {
    // An absent menu is not a closure claim; neither is silence.
    expect(resolveSchool("2026-09-15", {}).flags).toEqual([]);
    expect(resolveSchool("2026-09-15", { liveClosureClaim: null }).flags).toEqual([]);
    expect(resolveSchool("2026-09-15", { liveClosureClaim: false }).flags).toEqual([]);
  });
});

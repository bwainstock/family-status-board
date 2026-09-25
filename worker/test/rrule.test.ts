import { describe, expect, it } from "vitest";
import { expandRRule, parseRRule, type IcsStamp } from "../src/sources/rrule.js";

/**
 * `expandRRule` in isolation, away from `ics.ts`'s line parsing.
 *
 * Every test below picks a `dtstart` years before the `window` it expands
 * against — the shape the issue this file exists for names directly: a
 * series recurring since 2019 with no `COUNT`/`UNTIL`, checked against a
 * three-day window seven years later. If any of these were iterating from
 * `dtstart` rather than jumping to the window, they would still pass; only
 * the CPU measurement in `ics.bench.test.ts` proves they don't. What these
 * tests guard is that the jump lands on the *right* dates.
 */

function stamp(date: string, time: { hour: number; minute: number } | null = null): IcsStamp {
  return { date, time };
}

describe("parseRRule", () => {
  it("reads FREQ, INTERVAL, COUNT and UNTIL", () => {
    const rrule = parseRRule("FREQ=DAILY;INTERVAL=3;COUNT=5");
    expect(rrule).toMatchObject({ freq: "DAILY", interval: 3, count: 5, until: null });
  });

  it("defaults INTERVAL to 1 when absent", () => {
    expect(parseRRule("FREQ=WEEKLY")).toMatchObject({ interval: 1 });
  });

  it("resolves UNTIL through the same three-encodings machinery as DTSTART", () => {
    const rrule = parseRRule("FREQ=DAILY;UNTIL=20261231T075959Z");
    // December is PST (UTC-8, no daylight saving): 07:59:59Z lands the
    // previous evening in the school's local time, the same rollback trap
    // ics.ts already guards for DTSTART.
    expect(rrule?.until).toEqual({ date: "2026-12-30", time: { hour: 23, minute: 59 } });
  });

  it("resolves a bare-DATE UNTIL as an all-day stamp, the form Google emits for an all-day series", () => {
    // RFC 5545 requires UNTIL's form to match DTSTART's: an all-day DTSTART
    // (VALUE=DATE) pairs with a bare-DATE UNTIL, no time at all — distinct
    // from the far more common UTC-instant form tested above, which only
    // pairs with a timed DTSTART.
    expect(parseRRule("FREQ=WEEKLY;BYDAY=FR;UNTIL=20261002")?.until).toEqual({ date: "2026-10-02", time: null });
  });

  it("parses BYDAY with and without an ordinal", () => {
    const rrule = parseRRule("FREQ=MONTHLY;BYDAY=2TU,-1FR,SU");
    expect(rrule?.byDay).toEqual([
      { ordinal: 2, weekday: 2 },
      { ordinal: -1, weekday: 5 },
      { ordinal: null, weekday: 0 },
    ]);
  });

  it("parses BYMONTH", () => {
    expect(parseRRule("FREQ=YEARLY;BYMONTH=11")?.byMonth).toBe(11);
  });

  it("returns null for a sub-daily FREQ this codebase has no use for", () => {
    // Neither calendar this module reads ever produces an hourly reminder;
    // the safe response to one appearing is to fall back to the literal
    // DTSTART occurrence in ics.ts, not to guess at an expansion.
    expect(parseRRule("FREQ=HOURLY;INTERVAL=1")).toBeNull();
  });

  it("returns null with no FREQ at all", () => {
    expect(parseRRule("INTERVAL=2")).toBeNull();
  });

  it("returns null for a non-numeric or zero INTERVAL", () => {
    expect(parseRRule("FREQ=DAILY;INTERVAL=0")).toBeNull();
    expect(parseRRule("FREQ=DAILY;INTERVAL=banana")).toBeNull();
  });
});

describe("expandRRule: FREQ=DAILY", () => {
  it("jumps forward from a 2015 DTSTART to a 2026 window without walking", () => {
    const dtstart = stamp("2015-06-01", { hour: 8, minute: 0 });
    const rrule = parseRRule("FREQ=DAILY")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-24", "2026-09-25", "2026-09-26"]);
    expect(results[0]?.time).toEqual({ hour: 8, minute: 0 });
  });

  it("honours INTERVAL, landing only on the days that are really due", () => {
    const dtstart = stamp("2026-09-01");
    const rrule = parseRRule("FREQ=DAILY;INTERVAL=3")!;
    // 09-01, 09-04, ..., 09-25, 09-28 — 09-24 is not a multiple of 3 days on.
    const results = expandRRule(dtstart, rrule, { start: "2026-09-23", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-25"]);
  });

  it("stops at COUNT even when the window would otherwise include more", () => {
    const dtstart = stamp("2026-09-20");
    const rrule = parseRRule("FREQ=DAILY;COUNT=5")!; // occurrences: 20,21,22,23,24
    const results = expandRRule(dtstart, rrule, { start: "2026-09-20", end: "2026-09-30" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-20", "2026-09-21", "2026-09-22", "2026-09-23", "2026-09-24"]);
  });

  it("stops at UNTIL, truncating a window it only partly covers", () => {
    const dtstart = stamp("2026-09-01");
    const rrule = parseRRule("FREQ=DAILY;UNTIL=20260925T235959Z")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-24", "2026-09-25"]);
  });

  it("never generates an occurrence before DTSTART, even if the window starts earlier", () => {
    const dtstart = stamp("2026-09-25");
    const rrule = parseRRule("FREQ=DAILY")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-20", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-25", "2026-09-26"]);
  });

  it("produces nothing when the series has not started by the end of the window", () => {
    const dtstart = stamp("2027-01-01");
    const rrule = parseRRule("FREQ=DAILY")!;
    expect(expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" })).toEqual([]);
  });
});

describe("expandRRule: FREQ=WEEKLY", () => {
  it("without BYDAY, repeats DTSTART's own weekday every INTERVAL weeks", () => {
    const dtstart = stamp("2019-01-04", { hour: 19, minute: 0 }); // a Friday
    const rrule = parseRRule("FREQ=WEEKLY")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-25"]);
  });

  it("with BYDAY, generates every listed weekday within an eligible week", () => {
    const dtstart = stamp("2020-02-05", { hour: 9, minute: 0 }); // a Wednesday
    const rrule = parseRRule("FREQ=WEEKLY;BYDAY=MO,WE,FR")!;
    // A window spanning Thursday to the following Monday: Friday and the next Monday.
    const results = expandRRule(dtstart, rrule, { start: "2026-10-01", end: "2026-10-05" });
    expect(results.map((r) => r.date)).toEqual(["2026-10-02", "2026-10-05"]);
  });

  it("honours INTERVAL on a BYDAY rule, skipping the off weeks", () => {
    const dtstart = stamp("2026-09-02", { hour: 9, minute: 0 }); // a Wednesday, week 0
    const rrule = parseRRule("FREQ=WEEKLY;INTERVAL=2;BYDAY=WE")!;
    // Week of 9-02 is eligible (index 0); week of 9-09 is not (index 1); week
    // of 9-16 is eligible (index 2).
    const notDue = expandRRule(dtstart, rrule, { start: "2026-09-09", end: "2026-09-09" });
    const due = expandRRule(dtstart, rrule, { start: "2026-09-16", end: "2026-09-16" });
    expect(notDue).toEqual([]);
    expect(due.map((r) => r.date)).toEqual(["2026-09-16"]);
  });

  it("honours a bare-DATE UNTIL inclusively — the boundary date is the last real occurrence", () => {
    const dtstart = stamp("2026-09-04", null); // an all-day Friday series
    const rrule = parseRRule("FREQ=WEEKLY;BYDAY=FR;UNTIL=20261002")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-01", end: "2026-10-09" });
    // 10-02 is itself a Friday occurrence and UNTIL names it exactly, so it
    // is the last one included, not the one excluded.
    expect(results.map((r) => r.date)).toEqual(["2026-09-04", "2026-09-11", "2026-09-18", "2026-09-25", "2026-10-02"]);
  });

  it("removes the EXDATE-adjacent Wednesday but keeps the ones around it (integration shape)", () => {
    // The exact scenario the fixture uses: weekly Wednesday since 2020,
    // checked across a month that contains four of them.
    const dtstart = stamp("2020-02-05", { hour: 9, minute: 0 });
    const rrule = parseRRule("FREQ=WEEKLY;BYDAY=WE")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-10-01", end: "2026-10-31" });
    expect(results.map((r) => r.date)).toEqual(["2026-10-07", "2026-10-14", "2026-10-21", "2026-10-28"]);
  });
});

describe("expandRRule: FREQ=MONTHLY", () => {
  it("without BYDAY, repeats DTSTART's day-of-month every INTERVAL months", () => {
    const dtstart = stamp("2024-01-15", { hour: 10, minute: 0 });
    const rrule = parseRRule("FREQ=MONTHLY;INTERVAL=2")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-14", end: "2026-09-16" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-15"]);
  });

  it("produces no occurrence in a month where the day-of-month does not exist", () => {
    const dtstart = stamp("2026-01-31");
    const rrule = parseRRule("FREQ=MONTHLY")!;
    // February 2026 (not a leap year context anyway) has no 31st.
    expect(expandRRule(dtstart, rrule, { start: "2026-02-01", end: "2026-02-28" })).toEqual([]);
    // April has no 31st either, but May does.
    expect(expandRRule(dtstart, rrule, { start: "2026-04-01", end: "2026-04-30" })).toEqual([]);
    expect(
      expandRRule(dtstart, rrule, { start: "2026-05-01", end: "2026-05-31" }).map((r) => r.date),
    ).toEqual(["2026-05-31"]);
  });

  it("with an ordinal BYDAY, finds the Nth matching weekday of the month", () => {
    const dtstart = stamp("2021-03-09", { hour: 19, minute: 0 }); // the 2nd Tuesday of March 2021
    const rrule = parseRRule("FREQ=MONTHLY;BYDAY=2TU")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-10-12", end: "2026-10-14" });
    expect(results.map((r) => r.date)).toEqual(["2026-10-13"]);
  });

  it("with a negative ordinal BYDAY, finds the Nth-from-last matching weekday", () => {
    const dtstart = stamp("2024-01-26"); // the last Friday of January 2024
    const rrule = parseRRule("FREQ=MONTHLY;BYDAY=-1FR")!;
    // The last Friday of September 2026 is the 25th.
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-25"]);
  });

  it("skips a BYDAY entry with no ordinal rather than guessing at 'every such weekday'", () => {
    const dtstart = stamp("2024-01-02"); // a Tuesday
    const rrule = parseRRule("FREQ=MONTHLY;BYDAY=TU")!;
    expect(expandRRule(dtstart, rrule, { start: "2026-09-01", end: "2026-09-30" })).toEqual([]);
  });
});

describe("expandRRule: FREQ=YEARLY", () => {
  it("without BYDAY, repeats DTSTART's month and day every INTERVAL years", () => {
    const dtstart = stamp("2010-09-25");
    const rrule = parseRRule("FREQ=YEARLY")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results.map((r) => r.date)).toEqual(["2026-09-25"]);
  });

  it("produces no occurrence on 29 February in a non-leap year", () => {
    const dtstart = stamp("2016-02-29");
    const rrule = parseRRule("FREQ=YEARLY")!;
    expect(expandRRule(dtstart, rrule, { start: "2026-02-27", end: "2026-03-01" })).toEqual([]);
    // But does in a leap year.
    expect(
      expandRRule(dtstart, rrule, { start: "2028-02-27", end: "2028-03-01" }).map((r) => r.date),
    ).toEqual(["2028-02-29"]);
  });

  it("with BYMONTH and an ordinal BYDAY, finds the Nth weekday of that month every year", () => {
    const dtstart = stamp("2018-11-22", { hour: 8, minute: 30 }); // the 4th Thursday of Nov 2018
    const rrule = parseRRule("FREQ=YEARLY;BYMONTH=11;BYDAY=4TH")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-11-25", end: "2026-11-27" });
    expect(results.map((r) => r.date)).toEqual(["2026-11-26"]);
    expect(results[0]?.time).toEqual({ hour: 8, minute: 30 });
  });
});

describe("expandRRule: all-day series carry no time", () => {
  it("keeps time null through expansion when DTSTART was VALUE=DATE", () => {
    const dtstart = stamp("2010-09-25", null);
    const rrule = parseRRule("FREQ=YEARLY")!;
    const results = expandRRule(dtstart, rrule, { start: "2026-09-24", end: "2026-09-26" });
    expect(results).toEqual([{ date: "2026-09-25", time: null }]);
  });
});

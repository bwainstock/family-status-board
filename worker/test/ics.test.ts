import { describe, expect, it } from "vitest";
import { parseIcs, type IcsWindow } from "../src/sources/ics.js";
import { fixtureText } from "./support/fixtures.js";

const FEED = fixtureText("parentsquare.ics");
const GOOGLE_FEED = fixtureText("google-personal.ics");

/**
 * The ICS parser. Its only job is to turn a feed into events that already know
 * their local calendar date at the school, because every consumer downstream
 * compares dates and none of them should have to think about zones.
 *
 * The date handling is the whole risk. This feed carries three encodings of
 * DTSTART and one of them silently names the previous day.
 */
describe("parseIcs", () => {
  describe("dates, which arrive in three different encodings", () => {
    it("reads a VALUE=DATE stamp as the calendar date it already is", () => {
      // DTSTART;VALUE=DATE:20260925 is a date, not an instant. There is
      // nothing to convert and converting it would be how it moves.
      const [event] = parseIcs(
        wrap("DTSTART;VALUE=DATE:20260925", "SUMMARY:SPIRTI DAY"),
      );
      expect(event?.date).toBe("2026-09-25");
    });

    it("reads a TZID stamp as wall time at the school", () => {
      const [event] = parseIcs(
        wrap("DTSTART;TZID=America/Los_Angeles:20260924T083000", "SUMMARY:Coffee"),
      );
      expect(event?.date).toBe("2026-09-24");
    });

    it("resolves a bare-UTC midnight stamp to the PREVIOUS local date", () => {
      // The trap this ticket exists for. Midnight UTC is 4 or 5pm the day
      // before in Pacific time, so a feed that writes T000000Z is naming the
      // day before the one it looks like it is naming.
      const [event] = parseIcs(wrap("DTSTART:20261225T000000Z", "SUMMARY:Winter recess"));
      expect(event?.date).toBe("2026-12-24");
    });

    it("keeps a bare-UTC stamp on its own day when the hour is safely inside it", () => {
      // Same encoding, no rollback: 6pm UTC is 10 or 11am Pacific. The rule is
      // "convert the instant", not "always subtract a day".
      const [event] = parseIcs(wrap("DTSTART:20261225T180000Z", "SUMMARY:Winter recess"));
      expect(event?.date).toBe("2026-12-25");
    });

    it("gets the rollback right on both sides of a daylight-saving change", () => {
      // Pacific is UTC-7 in October and UTC-8 in November. Midnight UTC lands
      // on the previous day either way, which is the point of converting the
      // instant instead of subtracting a fixed offset.
      expect(parseIcs(wrap("DTSTART:20261015T000000Z", "SUMMARY:A"))[0]?.date).toBe("2026-10-14");
      expect(parseIcs(wrap("DTSTART:20261115T000000Z", "SUMMARY:A"))[0]?.date).toBe("2026-11-14");
    });

    it("reads a floating stamp as wall time, because that is what floating means", () => {
      const [event] = parseIcs(wrap("DTSTART:20260924T083000", "SUMMARY:Coffee"));
      expect(event?.date).toBe("2026-09-24");
    });

    it("gives every event in the live feed a local date and nothing else", () => {
      // No event may reach a consumer still carrying a timestamp: a consumer
      // that sees one will compare it against a date and be wrong twice a day.
      const events = parseIcs(FEED);
      expect(events.length).toBeGreaterThan(50);
      for (const event of events) {
        expect(event.date, event.summary).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it("reads the recording's own stamps, not just the ones invented above", () => {
      // The cases above are hand-built so they can cover encodings the feed
      // does not happen to carry today. This one pins the encodings it really
      // does carry, so a parser that only satisfies the synthetic cases is
      // caught the moment the upstream is re-recorded.
      const byDate = new Map(parseIcs(FEED).map((event) => [event.summary, event.date]));
      // DTSTART;VALUE=DATE:20260928
      expect(byDate.get("NO SCHOOL * 9/28 - 10/02")).toBe("2026-09-28");
      // DTSTART;TZID=America/Los_Angeles:20261006T084500
      expect(byDate.get("Los Dichos book Training /B10")).toBe("2026-10-06");
    });

    it("leaves no encoding in the recording unexercised", () => {
      // If the feed starts writing a form nothing above covers, that is a new
      // trap and not a passing suite.
      const encodings = new Set(
        [...FEED.matchAll(/^DTSTART([^:]*):/gm)].map(([, params]) => params ?? ""),
      );
      expect(encodings).toEqual(new Set(["", ";VALUE=DATE", ";TZID=America/Los_Angeles"]));
    });
  });

  describe("the structure of the feed itself", () => {
    it("never mistakes a VTIMEZONE rule for an event", () => {
      // VTIMEZONE carries its own bare DTSTART lines for the DST changeovers.
      // A parser that scans for DTSTART rather than walking VEVENTs invents
      // two events a year, in March and November, out of nothing.
      const summaries = parseIcs(FEED).map((event) => event.summary);
      expect(summaries).not.toContain("");
      expect(parseIcs(FEED).length).toBe(countOccurrences(FEED, "BEGIN:VEVENT"));
    });

    it("unfolds a continued line, because SUMMARY is where folding happens", () => {
      // RFC 5545 folds at 75 octets with a leading space. This feed's names are
      // short enough today; one long event name is all it takes to change that.
      const folded = wrap("DTSTART;VALUE=DATE:20260925", "SUMMARY:Fifth Grade Movie\r\n  Premiere Night");
      expect(parseIcs(folded)[0]?.summary).toBe("Fifth Grade Movie Premiere Night");
    });

    it("unescapes the commas the feed escapes", () => {
      // The live feed writes "Safe\, Secure and Loved Workshop". A backslash
      // left in place would break any allowlist rule written the obvious way.
      const [event] = parseIcs(
        wrap("DTSTART;VALUE=DATE:20260925", "SUMMARY:Safe\\, Secure and Loved Workshop"),
      );
      expect(event?.summary).toBe("Safe, Secure and Loved Workshop");
    });

    it("skips an event with no DTSTART rather than inventing a date for it", () => {
      expect(parseIcs(wrap("SUMMARY:Undated"))).toEqual([]);
    });

    it("returns nothing for a body that is not a calendar at all", () => {
      // The fetch layer can hand us an error page with a 200 on it.
      expect(parseIcs("<html><body>Sign in</body></html>")).toEqual([]);
      expect(parseIcs("")).toEqual([]);
    });
  });
});

/**
 * Recurrence, time-of-day and bounded expansion — everything ParentSquare
 * never needed and a personal Google calendar cannot do without. These are
 * new `describe` blocks; nothing above this point was touched, and the
 * ParentSquare-only tests above must keep passing unedited.
 */
describe("parseIcs: recurrence, EXDATE, RECURRENCE-ID, time and the window", () => {
  const WINDOW: IcsWindow = { start: "2026-09-24", end: "2026-09-26" };

  describe("RRULE expansion", () => {
    it("expands FREQ=DAILY across the window and no further", () => {
      const feed = wrap("DTSTART;TZID=America/Los_Angeles:20260901T080000", "SUMMARY:Take medicine", "RRULE:FREQ=DAILY");
      const dates = parseIcs(feed, WINDOW).map((e) => e.date);
      expect(dates).toEqual(["2026-09-24", "2026-09-25", "2026-09-26"]);
    });

    it("expands FREQ=WEEKLY;BYDAY across a window spanning two ISO weeks", () => {
      // 2026-09-24/25/26 is Thu/Fri/Sat; Monday-and-Friday spans that boundary.
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20200203T090000",
        "SUMMARY:Standup",
        "RRULE:FREQ=WEEKLY;BYDAY=MO,FR",
      );
      const dates = parseIcs(feed, WINDOW).map((e) => e.date);
      expect(dates).toEqual(["2026-09-25"]);
    });

    it("expands FREQ=MONTHLY with an ordinal BYDAY", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20210309T190000",
        "SUMMARY:Book club",
        "RRULE:FREQ=MONTHLY;BYDAY=2TU",
      );
      const dates = parseIcs(feed, { start: "2026-10-01", end: "2026-10-31" }).map((e) => e.date);
      expect(dates).toEqual(["2026-10-13"]);
    });

    it("expands FREQ=YEARLY with BYMONTH and an ordinal BYDAY", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20181122T083000",
        "SUMMARY:Turkey trot",
        "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=4TH",
      );
      const dates = parseIcs(feed, { start: "2026-11-25", end: "2026-11-27" }).map((e) => e.date);
      expect(dates).toEqual(["2026-11-26"]);
    });

    it("honours INTERVAL", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20240115T100000",
        "SUMMARY:Pest control",
        "RRULE:FREQ=MONTHLY;INTERVAL=2",
      );
      expect(parseIcs(feed, { start: "2026-09-14", end: "2026-09-16" }).map((e) => e.date)).toEqual(["2026-09-15"]);
      // The intervening month is not due.
      expect(parseIcs(feed, { start: "2026-10-14", end: "2026-10-16" })).toEqual([]);
    });

    it("stops at COUNT even inside an otherwise-eligible window", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20260706T160000",
        "SUMMARY:Rehearsal",
        "RRULE:FREQ=WEEKLY;BYDAY=MO;COUNT=8",
      );
      // All 8 Mondays land in July/August; September has none left.
      expect(parseIcs(feed, WINDOW)).toEqual([]);
    });

    it("stops at UNTIL, truncating the last day of an otherwise-eligible window", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20260901T080000",
        "SUMMARY:Physical therapy",
        "RRULE:FREQ=DAILY;UNTIL=20260926T065959Z",
      );
      // 06:59:59Z in September is 23:59:59 the previous evening in Pacific
      // time, so the last eligible occurrence is the 25th, not the 26th.
      expect(parseIcs(feed, WINDOW).map((e) => e.date)).toEqual(["2026-09-24", "2026-09-25"]);
    });

    it("honours a bare-DATE UNTIL — the form Google emits for an all-day series — inclusively", () => {
      // Distinct from the UTC-instant UNTIL exercised above: an all-day
      // DTSTART (VALUE=DATE) pairs with a bare-DATE UNTIL per RFC 5545, and
      // the boundary date it names is itself the last occurrence, not one
      // excluded by it.
      const feed = wrap(
        "DTSTART;VALUE=DATE:20260904",
        "SUMMARY:All-day Friday series",
        "RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20261002",
      );
      const events = parseIcs(feed, { start: "2026-09-25", end: "2026-10-02" });
      expect(events.map((e) => e.date)).toEqual(["2026-09-25", "2026-10-02"]);
      expect(events.every((e) => e.time === null)).toBe(true);
    });

    it("without a window, returns the literal DTSTART occurrence only — never expanded", () => {
      // The legacy behaviour every ParentSquare caller relies on: a recurring
      // VEVENT parsed with no window is not walked at all.
      //
      // The hazard this pins: a future caller with a genuinely recurring feed
      // (see #26) who calls `parseIcs(body)` and forgets the window gets
      // exactly this — one occurrence, dated years in the past, silently
      // excluded from any bound the caller later applies. The result is an
      // empty list of upcoming events, indistinguishable from a calendar that
      // is legitimately free. `parseIcs`'s doc comment names this trade-off
      // explicitly; this test is what keeps that comment honest.
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20190104T190000",
        "SUMMARY:Family game night",
        "RRULE:FREQ=WEEKLY;BYDAY=FR",
      );
      const events = parseIcs(feed);
      expect(events).toHaveLength(1);
      expect(events[0]?.date).toBe("2019-01-04");
    });

    it("discards a master whose series ends before the window opens, before expanding anything", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20200101T080000",
        "SUMMARY:Long since finished",
        "RRULE:FREQ=DAILY;UNTIL=20200201T080000Z",
      );
      expect(parseIcs(feed, WINDOW)).toEqual([]);
    });

    it("discards a master whose series has not started by the time the window closes", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20270101T080000",
        "SUMMARY:Not yet begun",
        "RRULE:FREQ=DAILY",
      );
      expect(parseIcs(feed, WINDOW)).toEqual([]);
    });

    it("falls back to the literal DTSTART occurrence for an RRULE frequency it does not expand", () => {
      // FREQ=HOURLY is real RFC 5545 but a shape neither feed this module
      // reads has ever produced; parseRRule returns null for it, and the
      // caller's job is to fall back, not to drop the event outright.
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20260924T080000",
        "SUMMARY:Odd reminder",
        "RRULE:FREQ=HOURLY;INTERVAL=1",
      );
      expect(parseIcs(feed, WINDOW).map((e) => e.date)).toEqual(["2026-09-24"]);
    });
  });

  describe("EXDATE", () => {
    it("removes the occurrence it names and nothing else", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20200205T090000",
        "SUMMARY:Volunteer shift",
        "RRULE:FREQ=WEEKLY;BYDAY=WE",
        "EXDATE;TZID=America/Los_Angeles:20261014T090000",
      );
      const dates = parseIcs(feed, { start: "2026-10-01", end: "2026-10-31" }).map((e) => e.date);
      expect(dates).toEqual(["2026-10-07", "2026-10-21", "2026-10-28"]);
    });

    it("accumulates several EXDATE lines rather than letting the last one win", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20200205T090000",
        "SUMMARY:Volunteer shift",
        "RRULE:FREQ=WEEKLY;BYDAY=WE",
        "EXDATE;TZID=America/Los_Angeles:20261007T090000",
        "EXDATE;TZID=America/Los_Angeles:20261021T090000",
      );
      const dates = parseIcs(feed, { start: "2026-10-01", end: "2026-10-31" }).map((e) => e.date);
      expect(dates).toEqual(["2026-10-14", "2026-10-28"]);
    });

    it("reads a comma-separated EXDATE list as several dates, not one", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20200205T090000",
        "SUMMARY:Volunteer shift",
        "RRULE:FREQ=WEEKLY;BYDAY=WE",
        "EXDATE;TZID=America/Los_Angeles:20261007T090000,20261021T090000",
      );
      const dates = parseIcs(feed, { start: "2026-10-01", end: "2026-10-31" }).map((e) => e.date);
      expect(dates).toEqual(["2026-10-14", "2026-10-28"]);
    });

    it("has no effect on a non-recurring event's own date, unless it names that exact date", () => {
      const feed = wrap(
        "DTSTART;VALUE=DATE:20260925",
        "SUMMARY:One-off",
        "EXDATE;VALUE=DATE:20260925",
      );
      expect(parseIcs(feed, WINDOW)).toEqual([]);
    });
  });

  describe("RECURRENCE-ID", () => {
    // The Wednesday volunteer shift, moved to Friday for one week — the
    // scenario the issue names directly: skip either half of this and the
    // Board either shows a cancelled Wednesday or a phantom Friday.
    const MASTER = vevent(
      "UID:volunteer@example.com",
      "DTSTART;TZID=America/Los_Angeles:20200205T090000",
      "SUMMARY:Volunteer shift",
      "RRULE:FREQ=WEEKLY;BYDAY=WE",
    );
    const OVERRIDE = vevent(
      "UID:volunteer@example.com",
      "RECURRENCE-ID;TZID=America/Los_Angeles:20261021T090000",
      "DTSTART;TZID=America/Los_Angeles:20261023T140000",
      "SUMMARY:Volunteer shift (moved to Friday)",
    );
    const CALENDAR = calendar(MASTER, OVERRIDE);

    it("replaces the generated instance rather than sitting alongside it", () => {
      const events = parseIcs(CALENDAR, { start: "2026-10-01", end: "2026-10-31" });
      const summaries = events.filter((e) => e.date === "2026-10-21" || e.date === "2026-10-23").map((e) => e.summary);
      expect(summaries).toEqual(["Volunteer shift (moved to Friday)"]);
    });

    it("carries the override's own date and time, not the slot it replaced", () => {
      const events = parseIcs(CALENDAR, { start: "2026-10-01", end: "2026-10-31" });
      const moved = events.find((e) => e.summary === "Volunteer shift (moved to Friday)");
      expect(moved?.date).toBe("2026-10-23");
      expect(moved?.time).toEqual({ hour: 14, minute: 0 });
    });

    it("leaves the rest of the series' occurrences untouched", () => {
      const events = parseIcs(CALENDAR, { start: "2026-10-01", end: "2026-10-31" });
      const dates = events.map((e) => e.date).sort();
      expect(dates).toEqual(["2026-10-07", "2026-10-14", "2026-10-23", "2026-10-28"]);
    });

    it("is honoured even when the override VEVENT appears before its master in the file", () => {
      // RFC 5545 does not require a RECURRENCE-ID to follow its master, and a
      // parser that assumed file order would need a second pass anyway.
      const reordered = calendar(OVERRIDE, MASTER);
      const events = parseIcs(reordered, { start: "2026-10-01", end: "2026-10-31" });
      const summaries = events.filter((e) => e.date === "2026-10-21" || e.date === "2026-10-23").map((e) => e.summary);
      expect(summaries).toEqual(["Volunteer shift (moved to Friday)"]);
    });

    it("is dropped when neither the vacated slot nor the new one falls inside the window", () => {
      const events = parseIcs(CALENDAR, WINDOW);
      expect(events.map((e) => e.summary)).not.toContain("Volunteer shift (moved to Friday)");
    });

    it("is kept when only the slot it moved INTO falls inside the window", () => {
      const events = parseIcs(CALENDAR, { start: "2026-10-23", end: "2026-10-23" });
      expect(events.map((e) => e.summary)).toEqual(["Volunteer shift (moved to Friday)"]);
    });

    it("is kept when only the slot it moved OUT OF falls inside the window, so the vacancy is knowable", () => {
      const events = parseIcs(CALENDAR, { start: "2026-10-21", end: "2026-10-21" });
      // The 21st shows nothing from this series — not the cancelled
      // Wednesday, and the override itself lands outside this narrow window.
      expect(events).toEqual([]);
    });
  });

  describe("time, as a separate field from date", () => {
    it("resolves a time for a timed event, alongside its date", () => {
      const [event] = parseIcs(wrap("DTSTART;TZID=America/Los_Angeles:20260924T083000", "SUMMARY:Coffee"), WINDOW);
      expect(event?.date).toBe("2026-09-24");
      expect(event?.time).toEqual({ hour: 8, minute: 30 });
    });

    it("is null for an all-day event, distinct from a timed event at midnight", () => {
      const [allDay] = parseIcs(wrap("DTSTART;VALUE=DATE:20260925", "SUMMARY:Spirit day"), WINDOW);
      const [midnight] = parseIcs(
        wrap("DTSTART;TZID=America/Los_Angeles:20260925T000000", "SUMMARY:Midnight thing"),
        WINDOW,
      );
      expect(allDay?.time).toBeNull();
      expect(midnight?.time).toEqual({ hour: 0, minute: 0 });
      // Same date, deliberately different `time` — a renderer that treated
      // these the same would draw an all-day event as a midnight appointment.
      expect(allDay?.date).toBe(midnight?.date);
    });

    it("resolves a bare-UTC timed stamp's time through the same instant-conversion as its date", () => {
      const [event] = parseIcs(wrap("DTSTART:20261225T013000Z", "SUMMARY:Late UTC"), {
        start: "2026-12-24",
        end: "2026-12-25",
      });
      // 01:30 UTC on the 25th is 17:30 the 24th in Pacific time (UTC-8 in December).
      expect(event?.date).toBe("2026-12-24");
      expect(event?.time).toEqual({ hour: 17, minute: 30 });
    });

    it("carries the resolved time through RRULE expansion, not just a literal DTSTART", () => {
      const feed = wrap(
        "DTSTART;TZID=America/Los_Angeles:20180101T193000",
        "SUMMARY:Standing meeting",
        "RRULE:FREQ=DAILY",
      );
      const [event] = parseIcs(feed, { start: "2026-09-24", end: "2026-09-24" });
      expect(event?.time).toEqual({ hour: 19, minute: 30 });
    });

    it("drops an event whose DTSTART matches none of the three recognized encodings", () => {
      // resolveStamp returns null for this, the same as a missing DTSTART:
      // guessing a date out of an unrecognized form would be worse than
      // dropping the event.
      expect(parseIcs(wrap("DTSTART;VALUE=DATE:not-a-date", "SUMMARY:Malformed"), WINDOW)).toEqual([]);
    });

    it("never lets a consumer see a raw timestamp — date is always YYYY-MM-DD", () => {
      // A realistic window, not the whole fixture's twelve years of history:
      // that would defeat the point of bounding the expansion in the first
      // place, and this assertion needs only a handful of events to hold.
      const events = parseIcs(GOOGLE_FEED, { start: "2026-09-24", end: "2026-10-31" });
      expect(events.length).toBeGreaterThan(5);
      for (const event of events) {
        expect(event.date, event.summary).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        if (event.time !== null) {
          expect(Number.isInteger(event.time.hour)).toBe(true);
          expect(Number.isInteger(event.time.minute)).toBe(true);
        }
      }
    });
  });

  describe("the synthetic Google fixture, end to end through parseIcs", () => {
    it("expands the weekly Friday series that has run unbounded since 2019", () => {
      const events = parseIcs(GOOGLE_FEED, WINDOW);
      const gameNight = events.filter((e) => e.summary === "Family Game Night");
      expect(gameNight.map((e) => e.date)).toEqual(["2026-09-25"]);
    });

    it("applies both the EXDATE and the RECURRENCE-ID override on the same series", () => {
      const events = parseIcs(GOOGLE_FEED, { start: "2026-10-01", end: "2026-10-31" });
      const shifts = events.filter((e) => e.summary.startsWith("Volunteer Shift")).map((e) => e.date).sort();
      // 10-07 and 10-28 plain; 10-14 removed by EXDATE; 10-21 replaced by the
      // override that moved it to 10-23.
      expect(shifts).toEqual(["2026-10-07", "2026-10-23", "2026-10-28"]);
      const moved = events.find((e) => e.summary === "Volunteer Shift (moved to Friday, short-staffed Wednesday)");
      expect(moved?.date).toBe("2026-10-23");
      expect(moved?.time).toEqual({ hour: 14, minute: 0 });
    });

    it("expands the monthly ordinal-BYDAY book club", () => {
      const events = parseIcs(GOOGLE_FEED, { start: "2026-10-01", end: "2026-10-31" });
      expect(events.find((e) => e.summary === "Book Club")?.date).toBe("2026-10-13");
    });

    it("expands the INTERVAL=2 monthly pest control visit", () => {
      const events = parseIcs(GOOGLE_FEED, { start: "2026-09-14", end: "2026-09-16" });
      expect(events.find((e) => e.summary === "Pest Control Visit")?.date).toBe("2026-09-15");
    });

    it("expands the plain yearly anniversary as an all-day event", () => {
      const events = parseIcs(GOOGLE_FEED, WINDOW);
      const anniversary = events.find((e) => e.summary === "Wedding Anniversary");
      expect(anniversary?.date).toBe("2026-09-25");
      expect(anniversary?.time).toBeNull();
    });

    it("expands the yearly BYMONTH+BYDAY turkey trot", () => {
      const events = parseIcs(GOOGLE_FEED, { start: "2026-11-25", end: "2026-11-27" });
      expect(events.find((e) => e.summary === "Neighborhood Turkey Trot 5k")?.date).toBe("2026-11-26");
    });

    it("expands the unbounded-since-2015 daily series across every day of the window", () => {
      const events = parseIcs(GOOGLE_FEED, WINDOW);
      const vitamins = events.filter((e) => e.summary === "Take Vitamins").map((e) => e.date);
      expect(vitamins).toEqual(["2026-09-24", "2026-09-25", "2026-09-26"]);
    });

    it("truncates the daily series at its UNTIL, one day before the window's end", () => {
      const events = parseIcs(GOOGLE_FEED, WINDOW);
      const pt = events.filter((e) => e.summary === "Physical Therapy Exercises").map((e) => e.date);
      expect(pt).toEqual(["2026-09-24", "2026-09-25"]);
    });

    it("produces nothing for a COUNT-bounded series that fully expired before the window", () => {
      const events = parseIcs(GOOGLE_FEED, WINDOW);
      expect(events.some((e) => e.summary === "Piano Recital Rehearsal")).toBe(false);
    });

    it("unfolds the one deliberately long SUMMARY line in the fixture", () => {
      const events = parseIcs(GOOGLE_FEED, { start: "2026-11-05", end: "2026-11-05" });
      const long = events.find((e) => e.uid === "folded-0001@google.com");
      expect(long?.summary).toBe(
        "Multi-Family Neighborhood Progressive Dinner and Annual Autumn Potluck Planning Committee Kickoff Meeting",
      );
    });
  });
});

function wrap(...lines: string[]): string {
  return ["BEGIN:VCALENDAR", "BEGIN:VEVENT", ...lines, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

/** One VEVENT's lines, without a surrounding VCALENDAR — for building a feed with more than one. */
function vevent(...lines: string[]): string {
  return ["BEGIN:VEVENT", ...lines, "END:VEVENT"].join("\r\n");
}

/** Several already-built VEVENTs (see `vevent`), in the given order, inside one VCALENDAR. */
function calendar(...vevents: string[]): string {
  return ["BEGIN:VCALENDAR", ...vevents, "END:VCALENDAR"].join("\r\n");
}

function countOccurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

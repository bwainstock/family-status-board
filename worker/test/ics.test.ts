import { describe, expect, it } from "vitest";
import { parseIcs } from "../src/sources/ics.js";
import { fixtureText } from "./support/fixtures.js";

const FEED = fixtureText("parentsquare.ics");

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

function wrap(...lines: string[]): string {
  return ["BEGIN:VCALENDAR", "BEGIN:VEVENT", ...lines, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
}

function countOccurrences(text: string, needle: string): number {
  return text.split(needle).length - 1;
}

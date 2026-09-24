import { describe, expect, it } from "vitest";
import {
  SCHOOL_TIMEZONE,
  addDays,
  dayOfWeek,
  formatLongDate,
  isIsoDate,
  isWeekend,
  localDate,
  nightsBetween,
} from "../src/day/clock.js";

/**
 * Everything the Board says about the future is counted in these functions, and
 * the documented way to get it wrong is to let an instant stand in for a
 * calendar date. Each test below names the trap it guards.
 */
describe("calendar dates at the school", () => {
  describe("localDate", () => {
    it("resolves an instant to the school's calendar date", () => {
      expect(localDate(new Date("2026-09-24T18:00:00Z"))).toBe("2026-09-24");
    });

    /**
     * The trap that has been observed live: a bare-UTC midnight stamp names the
     * *previous* day in Pacific time. Anything that skips this conversion
     * counts down to the wrong morning.
     */
    it("puts a UTC midnight on the previous local day", () => {
      expect(localDate(new Date("2026-11-26T00:00:00Z"))).toBe("2026-11-25");
    });

    it("rolls over at local midnight, not UTC midnight", () => {
      expect(localDate(new Date("2026-09-25T06:59:59Z"))).toBe("2026-09-24");
      expect(localDate(new Date("2026-09-25T07:00:00Z"))).toBe("2026-09-25");
    });

    it("honours a timezone other than the school's", () => {
      const instant = new Date("2026-11-26T00:00:00Z");
      expect(localDate(instant, "UTC")).toBe("2026-11-26");
      expect(localDate(instant, SCHOOL_TIMEZONE)).toBe("2026-11-25");
    });
  });

  describe("isIsoDate", () => {
    it("accepts a real calendar date", () => {
      expect(isIsoDate("2026-09-24")).toBe(true);
    });

    it.each(["2026-9-24", "24-09-2026", "2026-09-24T00:00:00Z", "", "tomorrow"])(
      "rejects the malformed %o",
      (value) => {
        expect(isIsoDate(value)).toBe(false);
      },
    );

    /** Date.parse would happily roll this into March. */
    it("rejects a well-formed but impossible date", () => {
      expect(isIsoDate("2026-02-31")).toBe(false);
      expect(isIsoDate("2026-13-01")).toBe(false);
    });
  });

  describe("addDays", () => {
    it("steps forward and back", () => {
      expect(addDays("2026-09-24", 1)).toBe("2026-09-25");
      expect(addDays("2026-09-24", -1)).toBe("2026-09-23");
    });

    it("crosses a month boundary", () => {
      expect(addDays("2026-09-30", 1)).toBe("2026-10-01");
    });

    it("crosses a year boundary", () => {
      expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    });

    it("handles a leap day", () => {
      expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    });
  });

  describe("nightsBetween", () => {
    it("counts today as zero Sleeps and tomorrow as one", () => {
      expect(nightsBetween("2026-09-24", "2026-09-24")).toBe(0);
      expect(nightsBetween("2026-09-24", "2026-09-25")).toBe(1);
    });

    it("counts across a month boundary", () => {
      expect(nightsBetween("2026-09-28", "2026-10-02")).toBe(4);
    });

    /**
     * The daylight-saving trap. 1 November 2026 is 25 hours long in Pacific
     * time and 8 March is 23; elapsed-time arithmetic would round those to 0
     * or 2 Sleeps. Calendar subtraction cannot.
     */
    it("counts one night across the autumn daylight-saving change", () => {
      expect(nightsBetween("2026-10-31", "2026-11-01")).toBe(1);
      expect(nightsBetween("2026-10-30", "2026-11-03")).toBe(4);
    });

    it("counts one night across the spring daylight-saving change", () => {
      expect(nightsBetween("2027-03-13", "2027-03-14")).toBe(1);
      expect(nightsBetween("2027-03-11", "2027-03-16")).toBe(5);
    });

    it("goes negative for a date already past", () => {
      expect(nightsBetween("2026-09-24", "2026-09-20")).toBe(-4);
    });
  });

  describe("weekdays", () => {
    it("knows which day of the week a date is", () => {
      expect(dayOfWeek("2026-09-24")).toBe(4); // a Thursday
    });

    it("identifies a weekend without consulting any calendar", () => {
      expect(isWeekend("2026-09-26")).toBe(true); // Saturday
      expect(isWeekend("2026-09-27")).toBe(true); // Sunday
      expect(isWeekend("2026-09-25")).toBe(false);
    });
  });

  describe("formatLongDate", () => {
    it("writes the date the way the Viewer is learning to recognise it", () => {
      expect(formatLongDate("2026-09-24")).toBe("September 24, 2026");
    });

    it("does not pad the day of the month", () => {
      expect(formatLongDate("2026-11-05")).toBe("November 5, 2026");
    });

    it("names every month correctly", () => {
      expect(formatLongDate("2027-01-01")).toBe("January 1, 2027");
      expect(formatLongDate("2027-12-31")).toBe("December 31, 2027");
    });
  });
});

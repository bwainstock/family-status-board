/**
 * Resolving one iCalendar date/date-time value to a local calendar date and,
 * when the value carries one, a local time — the "three encodings" logic that
 * used to live only in `ics.ts`, now shared with `RRULE`'s `UNTIL` and every
 * `EXDATE`/`RECURRENCE-ID`, none of which get to invent their own reading of
 * the same three forms.
 */

import { SCHOOL_TIMEZONE, localDate, localTime } from "../day/clock.js";

export interface IcsTime {
  readonly hour: number;
  readonly minute: number;
}

export interface IcsStamp {
  readonly date: string;
  /** null for an all-day (`VALUE=DATE`) stamp; every timed stamp resolves one. */
  readonly time: IcsTime | null;
}

/**
 * The three encodings, and why each is handled the way it is.
 *
 * `VALUE=DATE:20260925` is already a calendar date. There is no instant in it,
 * so there is nothing to convert, and converting it is exactly how such a date
 * ends up off by one.
 *
 * `TZID=America/Los_Angeles:20260924T083000` is wall time at the school. The
 * date and time parts are the local date and time by definition.
 *
 * `20261225T000000Z` is an instant in UTC, and midnight UTC is four or five in
 * the afternoon of the previous day in Pacific time. So this form routinely
 * names the day before the one it appears to name. Converting the instant
 * rather than subtracting a fixed offset is what keeps this right across the
 * daylight-saving changeover, for the time of day as much as the date.
 */
export function resolveStamp(params: string, value: string): IcsStamp | null {
  if (/^\d{8}$/.test(value)) return { date: isoFromCompact(value), time: null };

  const match = /^(\d{8})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (match === null) return null;

  const [, day, hour, minute, , utc] = match;
  if (utc !== "Z") {
    // Either wall time at the school, or floating time, which for a feed
    // meant for this household's own clocks means the same thing. A TZID
    // naming some other zone does not occur in either feed this module reads
    // and would need converting if it ever did.
    void params;
    return { date: isoFromCompact(day!), time: { hour: Number(hour), minute: Number(minute) } };
  }

  const instant = new Date(`${isoFromCompact(day!)}T${hour}:${minute}:00Z`);
  return { date: localDate(instant, SCHOOL_TIMEZONE), time: localTime(instant, SCHOOL_TIMEZONE) };
}

function isoFromCompact(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

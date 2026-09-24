/**
 * Calendar-date arithmetic at the school's timezone.
 *
 * Everything the Board reasons about is a *local calendar date* at the school,
 * never an instant. That is the whole point of this module: an instant crossing
 * midnight in Pacific time names a different day than the same instant does in
 * UTC, and getting that wrong counts down to the wrong morning.
 *
 * Once a date is a `YYYY-MM-DD` string, arithmetic on it is done through UTC
 * midnight. That is deliberate and is what makes Sleeps immune to daylight
 * saving: two calendar dates are always a whole number of days apart, even when
 * the wall-clock interval between them is 23 or 25 hours.
 */

export const SCHOOL_TIMEZONE = "America/Los_Angeles";

/** `YYYY-MM-DD`, in the school's timezone, for a given instant. */
export function localDate(instant: Date, timeZone: string = SCHOOL_TIMEZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const get = (type: string): string => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Rejects both malformed strings and impossible dates such as `2026-02-31`. */
export function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const utc = Date.parse(`${value}T00:00:00Z`);
  if (Number.isNaN(utc)) return false;
  return new Date(utc).toISOString().slice(0, 10) === value;
}

function toUtcMidnight(isoDate: string): number {
  if (!isIsoDate(isoDate)) throw new Error(`not a calendar date: ${isoDate}`);
  return Date.parse(`${isoDate}T00:00:00Z`);
}

export function addDays(isoDate: string, days: number): string {
  return new Date(toUtcMidnight(isoDate) + days * 86_400_000).toISOString().slice(0, 10);
}

/**
 * Whole nights from `from` to `to`. Negative if `to` is in the past.
 *
 * Correct across daylight saving because neither operand carries a time: this
 * is calendar subtraction, not elapsed-time subtraction.
 */
export function nightsBetween(from: string, to: string): number {
  return Math.round((toUtcMidnight(to) - toUtcMidnight(from)) / 86_400_000);
}

/** 0 = Sunday. */
export function dayOfWeek(isoDate: string): number {
  return new Date(toUtcMidnight(isoDate)).getUTCDay();
}

export function isWeekend(isoDate: string): boolean {
  const day = dayOfWeek(isoDate);
  return day === 0 || day === 6;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** "September 24, 2026" — the form the Viewer is learning to recognise. */
export function formatLongDate(isoDate: string): string {
  const utc = new Date(toUtcMidnight(isoDate));
  return `${MONTH_NAMES[utc.getUTCMonth()]} ${utc.getUTCDate()}, ${utc.getUTCFullYear()}`;
}

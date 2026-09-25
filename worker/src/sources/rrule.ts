/**
 * Bounded `RRULE` expansion.
 *
 * "Bounded" is the whole point of this file. A personal Google calendar's
 * secret-address feed carries years of history, and a weekly meeting that has
 * been recurring since 2019 has had roughly 350 occurrences by the time this
 * code runs. Walking them one at a time to find the handful that fall in the
 * next three days is exactly the CPU a cron-triggered Worker on the free
 * plan's 10ms budget does not have (ADR 0002) — and it would be spent entirely
 * on occurrences nobody will ever see.
 *
 * So nothing here iterates from the series' start. Every `expand*` function
 * below computes, arithmetically, *which* period index of the rule falls near
 * the window — `monthsBetween(dtstart, windowStart) / interval`, not a loop
 * that counts up to it — and only then generates the small number of
 * candidate dates that could possibly land inside the window. The cost of
 * expanding a rule is proportional to the width of the window (a handful of
 * candidates), never to how long the rule has been running.
 *
 * Only the combination this project's calendars actually need is implemented:
 * `FREQ=DAILY/WEEKLY/MONTHLY/YEARLY`, `INTERVAL`, `BYDAY`, `COUNT`, `UNTIL`,
 * and `BYMONTH` (only as a companion to `BYDAY` on a `YEARLY` rule, the
 * "fourth Thursday of November" shape). `BYMONTHDAY`, `BYSETPOS`,
 * `BYYEARDAY`, `BYWEEKNO`, `WKST` other than Monday, and sub-daily
 * frequencies are not read. A rule that needs one of those degrades to being
 * treated as unsupported by `parseRRule` (returns `null`) or, for a `BYDAY`
 * entry with no ordinal on a `MONTHLY`/`YEARLY` rule, has that entry quietly
 * skipped — see the callers in `ics.ts` for what happens next, which is
 * always "fall back to the literal DTSTART occurrence", never "guess".
 *
 * ADR 0004 records this decision in full: why it was necessary, the
 * alternatives that were considered (including the Google Calendar API's
 * already-expanded `timeMin`/`timeMax`, rejected for the OAuth it costs), and
 * the measured CPU figures that justify calling the arithmetic below "fast
 * enough" rather than merely "faster".
 */

import { addDays, dayOfWeek, nightsBetween } from "../day/clock.js";
import { resolveStamp, type IcsStamp, type IcsTime } from "./ics-stamp.js";

export type { IcsStamp, IcsTime };

export interface RecurrenceWindow {
  /** Inclusive, `YYYY-MM-DD`. */
  readonly start: string;
  /** Inclusive, `YYYY-MM-DD`. */
  readonly end: string;
}

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

interface ByDayRule {
  /**
   * `null` means "every matching weekday", which this file only implements
   * for `WEEKLY`. A `MONTHLY`/`YEARLY` `BYDAY` entry with no ordinal (e.g.
   * plain `BYDAY=TU`, "every Tuesday of the month") is real RFC 5545 but not
   * a shape either of this project's calendars produces — Google's own UI
   * only ever emits the ordinal form ("the second Tuesday") — so it is
   * skipped rather than guessed at.
   */
  readonly ordinal: number | null;
  /** 0 = Sunday .. 6 = Saturday, matching `clock.ts`'s `dayOfWeek`. */
  readonly weekday: number;
}

export interface RRule {
  readonly freq: Frequency;
  readonly interval: number;
  readonly count: number | null;
  readonly until: IcsStamp | null;
  readonly byDay: readonly ByDayRule[];
  /** 1-12. Only ever consulted alongside `byDay` on a `YEARLY` rule. */
  readonly byMonth: number | null;
}

const SUPPORTED_FREQ = new Set<string>(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]);
const WEEKDAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const BYDAY_TOKEN = /^([+-]?\d{1,2})?(SU|MO|TU|WE|TH|FR|SA)$/;

/**
 * Parses an `RRULE` value, or returns `null` for anything this file does not
 * expand — `FREQ=SECONDLY/MINUTELY/HOURLY`, a missing `FREQ`, or a malformed
 * `INTERVAL`/`COUNT`. `null` is a deliberate signal to the caller to fall back
 * to the rule's literal `DTSTART` occurrence rather than expand nothing at
 * all: the same choice this codebase already makes for a `VEVENT` with no
 * `DTSTART`.
 */
export function parseRRule(value: string): RRule | null {
  const parts = new Map<string, string>();
  for (const pair of value.split(";")) {
    const eq = pair.indexOf("=");
    if (eq === -1) continue;
    parts.set(pair.slice(0, eq), pair.slice(eq + 1));
  }

  const freq = parts.get("FREQ");
  if (freq === undefined || !SUPPORTED_FREQ.has(freq)) return null;

  const interval = Number(parts.get("INTERVAL") ?? "1");
  if (!Number.isInteger(interval) || interval < 1) return null;

  const countRaw = parts.get("COUNT");
  const count = countRaw === undefined ? null : Number(countRaw);
  if (count !== null && (!Number.isInteger(count) || count < 0)) return null;

  const untilRaw = parts.get("UNTIL");
  // UNTIL never carries its own TZID (RFC 5545 requires it to match DTSTART's
  // form directly), so it is resolved with no params — which routes a bare
  // compact stamp through the same "wall time" branch DTSTART itself uses.
  //
  // RFC 5545 requires UNTIL's *form* to match DTSTART's: a DATE-TIME DTSTART
  // pairs with a UTC DATE-TIME UNTIL (`...T235959Z`), and a DATE (all-day)
  // DTSTART pairs with a bare DATE UNTIL (`YYYYMMDD`, no time at all) — the
  // form Google emits for an all-day recurring series, e.g.
  // `RRULE:FREQ=WEEKLY;BYDAY=FR;UNTIL=20261002`. `resolveStamp` already
  // recognises the bare form as an all-day stamp (`time: null`), the same
  // path `DTSTART;VALUE=DATE` takes, so no special-casing is needed here —
  // but see `compareStamps` below for why that shared `null` is exactly what
  // makes the boundary date inclusive rather than off-by-one.
  const until = untilRaw === undefined ? null : resolveStamp("", untilRaw);

  const byMonthRaw = parts.get("BYMONTH");
  const byMonth = byMonthRaw === undefined ? null : Number(byMonthRaw.split(",")[0]);

  const byDay = (parts.get("BYDAY") ?? "")
    .split(",")
    .filter((token) => token.length > 0)
    .map(parseByDayToken)
    .filter((rule): rule is ByDayRule => rule !== null);

  return { freq: freq as Frequency, interval, count, until, byDay, byMonth };
}

function parseByDayToken(token: string): ByDayRule | null {
  const match = BYDAY_TOKEN.exec(token);
  if (match === null) return null;
  const [, ordinalRaw, code] = match;
  return { ordinal: ordinalRaw === undefined ? null : Number(ordinalRaw), weekday: WEEKDAY_CODES.indexOf(code!) };
}

/**
 * Every occurrence of `rrule`, starting from `dtstart`, that falls inside
 * `window` — `EXDATE` and `RECURRENCE-ID` are not this function's job; it
 * only expands, and `ics.ts` is what subtracts the deleted and overridden
 * occurrences afterward.
 *
 * Dispatches on `freq` to one of the jump-forward strategies below; see the
 * module comment for why none of them walk the series from its start.
 */
export function expandRRule(dtstart: IcsStamp, rrule: RRule, window: RecurrenceWindow): IcsStamp[] {
  switch (rrule.freq) {
    case "DAILY":
      return expandPeriodic(dtstart, rrule, window, 1);
    case "WEEKLY":
      return rrule.byDay.length > 0
        ? expandWeeklyByDay(dtstart, rrule, window)
        : expandPeriodic(dtstart, rrule, window, 7);
    case "MONTHLY":
      return expandMonthly(dtstart, rrule, window);
    case "YEARLY":
      return expandYearly(dtstart, rrule, window);
  }
}

/**
 * Occurrence-vs-UNTIL ordering. `null` (all-day) sorts before any time on the
 * same date — which is what makes a bare-DATE `UNTIL` inclusive of its own
 * day rather than excluding it: an all-day occurrence also carries `time:
 * null`, so the two compare equal on the boundary date and the `> 0`
 * exclusion the callers below apply never fires for it.
 */
function compareStamps(a: IcsStamp, b: IcsStamp): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  const minutesOf = (time: IcsTime | null): number => (time === null ? -1 : time.hour * 60 + time.minute);
  return minutesOf(a.time) - minutesOf(b.time);
}

function withinWindow(date: string, window: RecurrenceWindow): boolean {
  return date >= window.start && date <= window.end;
}

/**
 * `FREQ=DAILY` (unitDays=1) and `FREQ=WEEKLY` with no `BYDAY` (unitDays=7)
 * share one shape: occurrences fall every `interval * unitDays` days on the
 * same weekday and time as `dtstart`. The occurrence index `i` (0-based, `i=0`
 * is `dtstart` itself) is exactly `nightsBetween(dtstart, occurrence) / period`
 * — a division, not a count-up — so the first and last index that could touch
 * the window are found with two divisions regardless of how far in the past
 * `dtstart` is.
 */
function expandPeriodic(
  dtstart: IcsStamp,
  rrule: RRule,
  window: RecurrenceWindow,
  unitDays: number,
): IcsStamp[] {
  const period = rrule.interval * unitDays;
  const results: IcsStamp[] = [];

  const iMin = Math.max(0, Math.ceil(nightsBetween(dtstart.date, window.start) / period));
  let iMax = Math.floor(nightsBetween(dtstart.date, window.end) / period);
  if (rrule.count !== null) iMax = Math.min(iMax, rrule.count - 1);

  for (let i = iMin; i <= iMax; i++) {
    const date = addDays(dtstart.date, i * period);
    const occurrence: IcsStamp = { date, time: dtstart.time };
    if (rrule.until !== null && compareStamps(occurrence, rrule.until) > 0) break;
    if (withinWindow(date, window)) results.push(occurrence);
  }
  return results;
}

/** The Monday on or before `date` — this file's fixed week start (RFC default, WKST=MO). */
function mondayOnOrBefore(date: string): string {
  return addDays(date, -((dayOfWeek(date) + 6) % 7));
}

/** 0 = Monday .. 6 = Sunday: chronological order within a week starting Monday. */
function mondayFirstIndex(weekday: number): number {
  return (weekday + 6) % 7;
}

/**
 * `FREQ=WEEKLY` with a `BYDAY` list.
 *
 * The Frame only ever asks for a ~3-day window, but this function does not
 * assume that: `IcsWindow` is a public parameter of `parseIcs`, and a
 * function that quietly only works for a narrow window it happens to have
 * been tested with is exactly the kind of untested branch this issue exists
 * to close. So the loop below jumps — via `weeksSinceStart / interval`,
 * division, not iteration — to the *first eligible week on or after* the
 * window, and then steps forward one eligible week at a time only for as
 * many weeks as the window actually spans. A three-day window costs one
 * iteration; a month-long one costs about four; the series having started in
 * 2019 costs nothing, because the loop never visits a week before the jump
 * lands.
 *
 * `COUNT` is the one place this function is a documented approximation: the
 * exact RFC 5545 rule excludes any `BYDAY` weekday earlier in the week than
 * `DTSTART` from the *first* eligible week only. This function counts every
 * eligible week as contributing its full `BYDAY` set, including the first.
 * That only changes the answer for a series that combines `BYDAY` with
 * `COUNT` *and* whose `DTSTART` is not the earliest weekday in its own
 * `BYDAY` list — a narrow combination this project's calendars do not use
 * (most recurring meetings here either run indefinitely or end on `UNTIL`).
 */
function expandWeeklyByDay(dtstart: IcsStamp, rrule: RRule, window: RecurrenceWindow): IcsStamp[] {
  const dtWeekStart = mondayOnOrBefore(dtstart.date);
  const sortedWeekdays = [...new Set(rrule.byDay.map((entry) => entry.weekday))].sort(
    (a, b) => mondayFirstIndex(a) - mondayFirstIndex(b),
  );

  const firstCandidate = mondayOnOrBefore(window.start);
  const lastCandidate = mondayOnOrBefore(window.end);
  const weeksToFirstCandidate = nightsBetween(dtWeekStart, firstCandidate) / 7;
  // Round up to the next multiple of `interval` weeks — the jump this
  // function exists to make. A negative `weeksToFirstCandidate` (the window
  // starts before the series does) rounds up to week 0, `dtstart`'s own week.
  const firstEligibleWeekIndex = Math.max(0, Math.ceil(weeksToFirstCandidate / rrule.interval));
  let weekStart = addDays(dtWeekStart, firstEligibleWeekIndex * rrule.interval * 7);

  const results: IcsStamp[] = [];
  let eligibleWeekIndex = firstEligibleWeekIndex;
  while (weekStart <= lastCandidate) {
    if (rrule.count !== null && eligibleWeekIndex * sortedWeekdays.length >= rrule.count) break;

    for (const [position, weekday] of sortedWeekdays.entries()) {
      const date = addDays(weekStart, mondayFirstIndex(weekday));
      if (date < dtstart.date || !withinWindow(date, window)) continue;

      const occurrenceIndex = eligibleWeekIndex * sortedWeekdays.length + position;
      if (rrule.count !== null && occurrenceIndex >= rrule.count) continue;

      const occurrence: IcsStamp = { date, time: dtstart.time };
      if (rrule.until !== null && compareStamps(occurrence, rrule.until) > 0) continue;
      results.push(occurrence);
    }

    eligibleWeekIndex += 1;
    weekStart = addDays(weekStart, rrule.interval * 7);
  }
  return results;
}

function dateComponents(date: string): { year: number; month: number; day: number } {
  const [year, month, day] = date.split("-").map(Number);
  return { year: year!, month: month!, day: day! };
}

function daysInMonth(year: number, month: number): number {
  // Day 0 of the following month is the last day of this one — a cheaper
  // question to ask the platform than to derive from a leap-year rule by hand.
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function monthDate(year: number, month: number, day: number): string | null {
  if (day > daysInMonth(year, month)) return null; // e.g. day 31 of a 30-day month: no such date, not a rollover
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** The date of the Nth (or, negative, the Nth-from-last) `weekday` in a month, or null if it doesn't exist. */
function nthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number): string | null {
  if (ordinal > 0) {
    const firstWeekday = dayOfWeek(monthDate(year, month, 1)!);
    return monthDate(year, month, 1 + ((weekday - firstWeekday + 7) % 7) + (ordinal - 1) * 7);
  }
  if (ordinal < 0) {
    const lastDay = daysInMonth(year, month);
    const lastWeekday = dayOfWeek(monthDate(year, month, lastDay)!);
    const day = lastDay - ((lastWeekday - weekday + 7) % 7) - (-ordinal - 1) * 7;
    return day >= 1 ? monthDate(year, month, day) : null;
  }
  return null; // BYDAY ordinal 0 is not a legal RFC 5545 value.
}

function monthsBetween(from: string, to: string): number {
  const a = dateComponents(from);
  const b = dateComponents(to);
  return (b.year - a.year) * 12 + (b.month - a.month);
}

/**
 * `FREQ=MONTHLY`, with or without `BYDAY`.
 *
 * `monthsBetween(dtstart, window.start) / interval` lands within one month of
 * the true period index without ever counting up from `dtstart` — the same
 * jump this module makes for every frequency — and the ±1 pad below absorbs
 * the rounding a fixed-length division makes across months of different
 * length. Checking a handful of candidate period indices around that estimate
 * costs the same whether the series started last month or a decade ago.
 *
 * Without `BYDAY`, a day-of-month that does not exist in a given month (the
 * 29th–31st, most months) simply produces no occurrence that month, per
 * RFC 5545 — it is not rolled forward into the next one. `COUNT` in that case
 * still advances once per period index regardless of whether the period
 * produced a real occurrence, which very slightly over-counts against a
 * literal reading of the spec for a day that occasionally does not exist —
 * documented here, and side-stepped in this project's own fixture by choosing
 * a day that exists in every month.
 */
function expandMonthly(dtstart: IcsStamp, rrule: RRule, window: RecurrenceWindow): IcsStamp[] {
  const start = dateComponents(dtstart.date);
  const loIndex = Math.max(0, Math.floor(monthsBetween(dtstart.date, window.start) / rrule.interval) - 1);
  const hiIndex = Math.floor(monthsBetween(dtstart.date, window.end) / rrule.interval) + 1;
  const results: IcsStamp[] = [];

  for (let index = loIndex; index <= hiIndex; index++) {
    if (rrule.count !== null && index >= rrule.count) break;

    const totalMonths = start.month - 1 + index * rrule.interval;
    const year = start.year + Math.floor(totalMonths / 12);
    const month = (((totalMonths % 12) + 12) % 12) + 1;

    const dates =
      rrule.byDay.length > 0
        ? rrule.byDay
            .filter((entry): entry is ByDayRule & { ordinal: number } => entry.ordinal !== null)
            .map((entry) => nthWeekdayOfMonth(year, month, entry.weekday, entry.ordinal))
        : [monthDate(year, month, start.day)];

    for (const date of dates) {
      if (date === null || date < dtstart.date || !withinWindow(date, window)) continue;
      const occurrence: IcsStamp = { date, time: dtstart.time };
      if (rrule.until !== null && compareStamps(occurrence, rrule.until) > 0) continue;
      results.push(occurrence);
    }
  }
  return results;
}

/**
 * `FREQ=YEARLY`, with or without a `BYMONTH`+`BYDAY` pair.
 *
 * Same jump-forward shape as `expandMonthly`, one level up: the candidate
 * period indices are whole years, found by dividing a year difference instead
 * of a month difference, so the cost is still independent of the series' age.
 *
 * Without `BYDAY`, `dtstart`'s own month and day repeat every `interval`
 * years; a 29 February `dtstart` produces no occurrence in a year that is not
 * a leap year, the same "no rollover" rule `expandMonthly` applies, and with
 * the same documented `COUNT` caveat.
 */
function expandYearly(dtstart: IcsStamp, rrule: RRule, window: RecurrenceWindow): IcsStamp[] {
  const start = dateComponents(dtstart.date);
  const winStart = dateComponents(window.start);
  const winEnd = dateComponents(window.end);
  const loIndex = Math.max(0, Math.floor((winStart.year - start.year) / rrule.interval) - 1);
  const hiIndex = Math.floor((winEnd.year - start.year) / rrule.interval) + 1;
  const month = rrule.byMonth ?? start.month;
  const results: IcsStamp[] = [];

  for (let index = loIndex; index <= hiIndex; index++) {
    if (rrule.count !== null && index >= rrule.count) break;

    const year = start.year + index * rrule.interval;
    const dates =
      rrule.byDay.length > 0
        ? rrule.byDay
            .filter((entry): entry is ByDayRule & { ordinal: number } => entry.ordinal !== null)
            .map((entry) => nthWeekdayOfMonth(year, month, entry.weekday, entry.ordinal))
        : [monthDate(year, month, start.day)];

    for (const date of dates) {
      if (date === null || date < dtstart.date || !withinWindow(date, window)) continue;
      const occurrence: IcsStamp = { date, time: dtstart.time };
      if (rrule.until !== null && compareStamps(occurrence, rrule.until) > 0) continue;
      results.push(occurrence);
    }
  }
  return results;
}

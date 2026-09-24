/**
 * What the fourth cell counts toward.
 *
 * Sleeps, not days, because that is the unit a five-year-old actually has.
 * "Three sleeps" is a thing she can hold; "Thursday the 13th" is not.
 *
 * Two kinds of thing are worth waiting for and they compete on equal terms: an
 * allowed event from the school's feed, and a Non-School Day from the
 * checked-in calendar. The domain glossary calls the Non-School Day a thing
 * worth counting Sleeps toward in its own right, and from where she is
 * standing a day with no school is at least as exciting as a Book Fair.
 */

import { nightsBetween } from "./clock.js";
import { SCHOOL_CALENDAR, type SchoolCalendar } from "./school-calendar.js";
import type { EventFact } from "./events.js";
import type { Countdown, EventGlyph } from "./model.js";

export interface CountdownTarget {
  readonly date: string;
  readonly sleeps: number;
  readonly glyph: EventGlyph;
  readonly caption: string;
}

/**
 * Every Non-School Day gets the same words no matter which holiday it is.
 *
 * The district's own wording runs to "Martin Luther King Jr. Day", which does
 * not fit a 198px cell, and the Viewer cannot read it anyway. The house Glyph
 * already says what is being counted toward. On the day itself the whole panel
 * gives the reason in full, which is where that belongs.
 */
export const NON_SCHOOL_CAPTION = "No school";

/**
 * The nearest thing worth waiting for, or null if there is nothing ahead.
 *
 * Today counts as zero Sleeps rather than being skipped: the morning of the
 * Fall Festival is the morning she most needs to be told about the Fall
 * Festival.
 *
 * Weekends are not targets, and they drop out for free: the calendar's
 * non-school table lists weekdays only, so there is no Saturday in it to find.
 * Were they included, the answer would be "the weekend" almost every day and
 * the cell would stop meaning anything.
 */
export function nextTarget(
  today: string,
  events: readonly EventFact[] = [],
  calendar: SchoolCalendar = SCHOOL_CALENDAR,
): CountdownTarget | null {
  const candidates: CountdownTarget[] = [];

  for (const event of events) {
    const sleeps = nightsBetween(today, event.date);
    if (sleeps >= 0) {
      candidates.push({ date: event.date, sleeps, glyph: event.glyph, caption: event.caption });
    }
  }

  for (const date of Object.keys(calendar.nonSchoolDays)) {
    const sleeps = nightsBetween(today, date);
    if (sleeps >= 0) {
      candidates.push({ date, sleeps, glyph: "no-school", caption: NON_SCHOOL_CAPTION });
    }
  }

  if (candidates.length === 0) return null;

  // Soonest wins. On a tie the event wins, because "Book Fair" tells her more
  // about the day than "No school" does.
  candidates.sort((a, b) => a.sleeps - b.sleeps || rank(a) - rank(b));
  return candidates[0]!;
}

function rank(target: CountdownTarget): number {
  return target.glyph === "no-school" ? 1 : 0;
}

/**
 * The cell's fact, in the shape the DayModel carries.
 *
 * Separate from `nextTarget` because the target is a fact about the calendar
 * and this is a decision about the cell. The fallback for "nothing close
 * enough" lands here.
 */
export function countdownFor(
  today: string,
  events: readonly EventFact[] = [],
  calendar: SchoolCalendar = SCHOOL_CALENDAR,
): Countdown {
  const target = nextTarget(today, events, calendar);
  if (target === null) return null;
  return { kind: "sleeps", sleeps: target.sleeps, glyph: target.glyph, caption: target.caption };
}

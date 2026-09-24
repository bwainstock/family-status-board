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
import type { KidRelevantEvent } from "./kid-events.js";
import type { Sleeps, KidEventGlyph, WeatherFact } from "./model.js";

export interface SleepsTarget {
  readonly date: string;
  /** The count itself. Sleeps are nights, which is why this is not "days". */
  readonly nights: number;
  readonly glyph: KidEventGlyph;
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
  events: readonly KidRelevantEvent[] = [],
  calendar: SchoolCalendar = SCHOOL_CALENDAR,
): SleepsTarget | null {
  const candidates: SleepsTarget[] = [];

  for (const event of events) {
    const nights = nightsBetween(today, event.date);
    if (nights >= 0) {
      candidates.push({ date: event.date, nights, glyph: event.glyph, caption: event.caption });
    }
  }

  for (const date of Object.keys(calendar.nonSchoolDays)) {
    const nights = nightsBetween(today, date);
    if (nights >= 0) {
      candidates.push({ date, nights, glyph: "no-school", caption: NON_SCHOOL_CAPTION });
    }
  }

  if (candidates.length === 0) return null;

  // Soonest wins. On a tie the event wins, because "Book Fair" tells her more
  // about the day than "No school" does.
  candidates.sort((a, b) => a.nights - b.nights || rank(a) - rank(b));
  return candidates[0]!;
}

function rank(target: SleepsTarget): number {
  return target.glyph === "no-school" ? 1 : 0;
}

/**
 * How many Sleeps still mean something.
 *
 * Ten, because that is how many fingers she has to count on. Past that the
 * number stops being something she can feel and becomes arithmetic, and a cell
 * showing "47" is a cell she has stopped looking at. What replaces it has to
 * be worth the space, which is why the fallback is tomorrow's weather rather
 * than a blank.
 */
export const SLEEPS_HORIZON = 10;

/**
 * The cell's fact, in the shape the DayModel carries.
 *
 * Separate from `nextTarget` because the target is a fact about the calendar
 * and this is a decision about the cell: whether the nearest target is close
 * enough to be worth counting, and what to show instead when it is not.
 *
 * The cell is never empty. If there is nothing close enough it shows
 * tomorrow's weather; if there is no forecast either it falls to a question
 * mark, which still occupies the slot.
 */
export function sleepsFor(
  today: string,
  events: readonly KidRelevantEvent[] = [],
  calendar: SchoolCalendar = SCHOOL_CALENDAR,
  tomorrowWeather: WeatherFact | null = null,
): Sleeps {
  const target = nextTarget(today, events, calendar);

  if (target !== null && target.nights <= SLEEPS_HORIZON) {
    return { kind: "sleeps", nights: target.nights, glyph: target.glyph, caption: target.caption };
  }

  if (tomorrowWeather !== null) {
    return { kind: "tomorrow-weather", glyph: tomorrowWeather.glyph, tempF: tomorrowWeather.tempF };
  }

  return null;
}

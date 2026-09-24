/**
 * Whether there is school today.
 *
 * This is the most load-bearing fact the Board knows. Telling the Viewer there
 * is school on a day the school is shut is worse than telling her nothing — she
 * will act on it, and she cannot sanity-check it.
 *
 * So the checked-in School Calendar answers the question and nothing else does.
 * Live sources are read, compared, and reported on, but per ADR 0003 they never
 * change the answer. A feed that disagrees is far more likely to be wrong, or
 * to be describing something else, than the district's own published calendar.
 */

import type { SchoolState, StatusFlag } from "./model.js";
import { addDays, isWeekend } from "./clock.js";
import { SCHOOL_CALENDAR, type SchoolCalendar } from "./school-calendar.js";

export interface SchoolSignals {
  /**
   * A live source claiming the school is shut: MealViewer's `NO SCHOOL!`
   * sentinel, or a closure entry on the events feed.
   *
   * `null` means no signal at all, which is the common case and is not
   * evidence of anything. An *empty* menu is not a closure claim either — it
   * equally means a menu that is not published yet.
   */
  readonly liveClosureClaim?: boolean | null;
}

export interface SchoolResolution {
  readonly state: SchoolState;
  readonly flags: readonly StatusFlag[];
  /** True when the date falls outside the checked-in calendar's school year. */
  readonly outsideCalendarYear: boolean;
}

/**
 * How far either side of its own school year the checked-in table is still
 * trusted to mean "summer". Past this, a new calendar should have been checked
 * in — ADR 0003 puts that in August — and answering from the expired table is
 * a guess dressed up as a fact.
 */
const SUMMER_GRACE_DAYS = 70;

export function resolveSchool(
  date: string,
  signals: SchoolSignals = {},
  calendar: SchoolCalendar = SCHOOL_CALENDAR,
): SchoolResolution {
  const flags: StatusFlag[] = [];
  const outsideCalendarYear = date < calendar.firstDay || date > calendar.lastDay;

  const state = stateFor(date, calendar, outsideCalendarYear);

  /**
   * The table has run out, in one direction or the other. The answer above is
   * a plausible guess about summer rather than something the district
   * published, and the Caregiver should be told the Board is working from a
   * calendar that does not cover today.
   */
  if (
    date > addDays(calendar.lastDay, SUMMER_GRACE_DAYS) ||
    date < addDays(calendar.firstDay, -SUMMER_GRACE_DAYS)
  ) {
    flags.push("stale");
  }

  /**
   * A live source says shut on a day the table calls a school day. The table
   * still wins, but this most likely means a closure was added mid-year that no
   * published calendar predicted, so it is surfaced rather than resolved.
   */
  if (signals.liveClosureClaim === true && state.kind !== "no-school") {
    flags.push("closure-disagreement");
  }

  return { state, flags, outsideCalendarYear };
}

function stateFor(date: string, calendar: SchoolCalendar, outsideCalendarYear: boolean): SchoolState {
  if (outsideCalendarYear) {
    return { kind: "no-school", reason: "Summer break" };
  }

  // The table's own wording first, so a named recess beats a bare "Weekend"
  // on the days where a closure block happens to swallow one.
  const closure = calendar.nonSchoolDays[date];
  if (closure !== undefined) {
    return { kind: "no-school", reason: closure };
  }

  if (isWeekend(date)) {
    return { kind: "no-school", reason: "Weekend" };
  }

  if (date in calendar.minimumDays) {
    return { kind: "minimum-day" };
  }

  return { kind: "school" };
}

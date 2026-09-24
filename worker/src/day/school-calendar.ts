/**
 * The checked-in School Calendar, and the guards that keep it trustworthy.
 *
 * Per ADR 0003 this file is the *only* authority on whether there is school.
 * No feed, no holiday library and no inference from a menu may override it.
 * That makes its contents the most load-bearing data in the repository, so it
 * is validated on the way in rather than trusted.
 *
 * Regenerating it is a deliberate annual human step:
 *
 *     python3 tools/extract-school-calendar.py <new-calendar>.pdf
 *
 * and then the import below is pointed at the new file. That edit is the point
 * at which someone notices a year has gone by.
 */

import calendarJson from "../../../data/school-calendar-2026-2027.json";
import { SCHOOL_TIMEZONE, isIsoDate } from "./clock.js";

export interface SchoolCalendar {
  readonly schoolYear: string;
  readonly timezone: string;
  /** Must be "elementary" — see the audience guard below. */
  readonly audience: string;
  readonly firstDay: string;
  readonly lastDay: string;
  /** Local date -> the reason the school is shut, as the district words it. */
  readonly nonSchoolDays: Readonly<Record<string, string>>;
  /** Local date -> the district's note. Elementary only. */
  readonly minimumDays: Readonly<Record<string, string>>;
}

/**
 * Throws rather than degrades. A malformed closure table is the one input where
 * carrying on regardless is worse than not starting: the Board would answer the
 * Viewer's most important question confidently and wrongly, and she has no way
 * to tell.
 */
export function validateCalendar(candidate: SchoolCalendar): SchoolCalendar {
  const fail = (why: string): never => {
    throw new Error(`School Calendar is not usable: ${why}`);
  };

  /**
   * The district publishes early-dismissal blocks that apply to secondary
   * students only. A table built for any other audience would put an early
   * finish on an elementary Viewer's wall on days she is at school until the
   * usual time.
   */
  if (candidate.audience !== "elementary") {
    fail(`audience is "${candidate.audience}", expected "elementary"`);
  }

  if (candidate.timezone !== SCHOOL_TIMEZONE) {
    fail(`timezone is "${candidate.timezone}", expected "${SCHOOL_TIMEZONE}"`);
  }

  for (const field of ["firstDay", "lastDay"] as const) {
    if (!isIsoDate(candidate[field])) fail(`${field} is not a calendar date: "${candidate[field]}"`);
  }

  if (candidate.firstDay > candidate.lastDay) {
    fail(`firstDay ${candidate.firstDay} is after lastDay ${candidate.lastDay}`);
  }

  for (const [label, table] of [
    ["nonSchoolDays", candidate.nonSchoolDays],
    ["minimumDays", candidate.minimumDays],
  ] as const) {
    for (const [date, reason] of Object.entries(table)) {
      if (!isIsoDate(date)) fail(`${label} has a key that is not a calendar date: "${date}"`);
      if (typeof reason !== "string" || reason.length === 0) {
        fail(`${label}["${date}"] has no reason`);
      }
    }
  }

  /** A date cannot be both shut and finishing early. */
  for (const date of Object.keys(candidate.minimumDays)) {
    if (date in candidate.nonSchoolDays) {
      fail(`${date} is both a Non-School Day and a Minimum Day`);
    }
  }

  return candidate;
}

export const SCHOOL_CALENDAR: SchoolCalendar = validateCalendar(calendarJson as SchoolCalendar);

/**
 * Just enough iCalendar to read a school's event feed.
 *
 * Not a general RFC 5545 implementation, and deliberately so: recurrence,
 * attendees, alarms and the rest are not in this feed and carrying code for
 * them would only be code that has never been run.
 *
 * What it does take seriously is dates. The feed encodes DTSTART three ways
 * and one of them means a different day than it appears to. Every event leaves
 * here carrying a local calendar date at the school and nothing else, so that
 * no consumer downstream ever has to think about a timezone again.
 */

import { SCHOOL_TIMEZONE, localDate } from "../day/clock.js";

export interface IcsEvent {
  readonly uid: string;
  readonly summary: string;
  /** The local calendar date at the school. Already resolved; never a stamp. */
  readonly date: string;
}

export function parseIcs(body: string): IcsEvent[] {
  const events: IcsEvent[] = [];
  let current: Partial<Record<string, string>> | null = null;
  let currentDate: string | null = null;

  for (const line of unfold(body)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      currentDate = null;
      continue;
    }

    if (line === "END:VEVENT") {
      // A VEVENT with no DTSTART cannot be placed on the Board's calendar, and
      // guessing a date for it would be worse than dropping it.
      if (current !== null && currentDate !== null) {
        events.push({
          uid: current["UID"] ?? "",
          summary: unescapeText(current["SUMMARY"] ?? ""),
          date: currentDate,
        });
      }
      current = null;
      continue;
    }

    // Outside a VEVENT there is nothing to read. This is what keeps VTIMEZONE
    // out: its DAYLIGHT and STANDARD blocks each carry a bare DTSTART, and a
    // parser that scanned for DTSTART lines would invent an event for every
    // daylight-saving changeover in the file.
    if (current === null) continue;

    const parsed = splitLine(line);
    if (parsed === null) continue;
    const { name, params, value } = parsed;

    if (name === "DTSTART") currentDate = resolveDate(params, value);
    else current[name] = value;
  }

  return events;
}

/**
 * RFC 5545 folds long lines at 75 octets and continues them with a leading
 * space or tab. The feed's names are short enough today that nothing is
 * folded; one long event name is all it would take.
 */
function unfold(body: string): string[] {
  const lines: string[] = [];
  for (const raw of body.split(/\r?\n/)) {
    if ((raw.startsWith(" ") || raw.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += raw.slice(1);
    } else {
      lines.push(raw);
    }
  }
  return lines;
}

interface ContentLine {
  readonly name: string;
  readonly params: string;
  readonly value: string;
}

function splitLine(line: string): ContentLine | null {
  const colon = line.indexOf(":");
  if (colon === -1) return null;

  const left = line.slice(0, colon);
  const semicolon = left.indexOf(";");
  return {
    name: semicolon === -1 ? left : left.slice(0, semicolon),
    params: semicolon === -1 ? "" : left.slice(semicolon + 1),
    value: line.slice(colon + 1),
  };
}

/**
 * The three encodings, and why each is handled the way it is.
 *
 * `VALUE=DATE:20260925` is already a calendar date. There is no instant in it,
 * so there is nothing to convert, and converting it is exactly how such a date
 * ends up off by one.
 *
 * `TZID=America/Los_Angeles:20260924T083000` is wall time at the school. The
 * date part is the local date by definition.
 *
 * `20261225T000000Z` is an instant in UTC, and midnight UTC is four or five in
 * the afternoon of the previous day in Pacific time. So this form routinely
 * names the day before the one it appears to name. Converting the instant
 * rather than subtracting a fixed offset is what keeps this right across the
 * daylight-saving changeover.
 */
function resolveDate(params: string, value: string): string | null {
  if (/^\d{8}$/.test(value)) return isoFromCompact(value);

  const match = /^(\d{8})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (match === null) return null;

  const [, day, hour, minute, second, utc] = match;
  if (utc !== "Z") {
    // Either wall time at the school, or floating time, which for a school's
    // own feed means the same thing. A TZID naming some other zone does not
    // occur in this feed and would need converting if it ever did.
    void params;
    return isoFromCompact(day!);
  }

  const instant = new Date(`${isoFromCompact(day!)}T${hour}:${minute}:${second}Z`);
  return localDate(instant, SCHOOL_TIMEZONE);
}

function isoFromCompact(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 6)}-${compact.slice(6, 8)}`;
}

/** The feed escapes commas and semicolons; an allowlist rule will not. */
function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, " ")
    .replace(/\\([,;\\])/g, "$1")
    .trim();
}

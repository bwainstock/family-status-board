/**
 * Just enough iCalendar to read a school's event feed — and, now, a personal
 * Google calendar's.
 *
 * Still not a general RFC 5545 implementation: attendees, alarms, organizers
 * and the rest have never appeared in either feed this module reads, and
 * carrying code for them would only be code that has never been run. What
 * changed is recurrence and time-of-day, which were fair to skip for
 * ParentSquare — a school newsletter's events don't repeat and rarely name an
 * hour — and are not fair to skip for a Google calendar, where most entries
 * recur and nearly all have one.
 *
 * Recurrence is expanded, but only within the window the Frame can actually
 * display (see `IcsWindow`): a personal calendar's secret-address feed can
 * carry years of history, and walking an open-ended `RRULE` from whenever it
 * started is exactly the CPU a cron-triggered Worker on the free plan does
 * not have (ADR 0002). `./rrule.ts` jumps to the window arithmetically
 * instead of iterating toward it — see that file for the reasoning, and see
 * `masterCouldReachWindow` below for the equally important half of the same
 * idea: a `VEVENT` that provably cannot reach the window is discarded before
 * any `RRULE` is expanded, not after. ADR 0004 records the decision, the
 * rejected alternatives, and the measured cost.
 *
 * `EXDATE` and `RECURRENCE-ID` both exist to keep an expansion honest: a
 * deleted occurrence and a moved-or-renamed one. Skipping either produces a
 * Board that confidently shows a cancelled appointment, which is a worse
 * failure than the un-recurring parser this file used to be — that one at
 * least never claimed to know about something it never tried to expand.
 *
 * What it still takes just as seriously is dates, and that guarantee has not
 * moved: the feed encodes DTSTART three ways and one of them means a
 * different day than it appears to. Every event still leaves here carrying a
 * local calendar date at the school and nothing else — time is a *separate*,
 * optional field, resolved through the same machinery, so no consumer
 * downstream ever has to think about a timezone, and an all-day event stays
 * visibly different from one that merely happens not to name an hour.
 */

import { resolveStamp, type IcsStamp, type IcsTime } from "./ics-stamp.js";
import { expandRRule, parseRRule, type RRule } from "./rrule.js";

export type { IcsTime };

export interface IcsEvent {
  readonly uid: string;
  readonly summary: string;
  /** The local calendar date at the school. Already resolved; never a stamp. */
  readonly date: string;
  /**
   * The local wall-clock time at the school, resolved in the same pass as
   * `date` and through the same machinery — or `null` for an all-day event.
   * `null` is load-bearing: an all-day event and one that merely happens to
   * fall at midnight are different things, and a renderer that could not
   * tell them apart would draw a birthday party as a 12:00am appointment.
   */
  readonly time: IcsTime | null;
}

/**
 * An inclusive bound, in local calendar dates, on the work `parseIcs` will
 * do. Roughly "the days the Frame can display" — today through a couple of
 * days out — chosen by the caller, not by this file: what the Frame can show
 * is a rendering concern, and this module's job is only to honour whatever
 * bound it is given.
 */
export interface IcsWindow {
  /** Inclusive, `YYYY-MM-DD`. */
  readonly start: string;
  /** Inclusive, `YYYY-MM-DD`. */
  readonly end: string;
}

/**
 * A recurring VEVENT, held here only long enough to be expanded once the full
 * file has been read — a RECURRENCE-ID override for one of its instances can
 * legally appear anywhere else in the file, including before its master.
 */
interface PendingMaster {
  readonly uid: string;
  readonly summary: string;
  readonly dtstart: IcsStamp;
  readonly rrule: RRule;
  /** By date only — see the module-level note on EXDATE's matching grain. */
  readonly exdates: ReadonlySet<string>;
}

/** A RECURRENCE-ID VEVENT: a single occurrence moved, renamed, or both. */
interface PendingOverride {
  readonly uid: string;
  readonly summary: string;
  /** The occurrence's new date and time. */
  readonly dtstart: IcsStamp;
  /** The date of the generated instance this replaces. */
  readonly recurrenceIdDate: string;
}

/** The VEVENT currently being read, accumulated line by line. */
interface PendingVevent {
  fields: Partial<Record<string, string>>;
  dtstart: IcsStamp | null;
  rrule: string | null;
  exdates: IcsStamp[];
  recurrenceId: IcsStamp | null;
}

/**
 * Parses a calendar body into events, each already carrying a local date and,
 * when the event has one, a local time.
 *
 * `window`, when given, is a hard bound on the work this function will do: a
 * `VEVENT` — recurring or not — that provably cannot land inside it is
 * discarded before any `RRULE` is expanded, never after, which is what keeps
 * the cost proportional to the width of the window rather than to how much
 * history the feed carries.
 *
 * Omitting `window` preserves this function's original, pre-recurrence
 * behaviour: every plain `VEVENT` is returned regardless of date, which is
 * what every ParentSquare caller and test still relies on and what that feed
 * has always needed, since it carries no recurrence to bound. A recurring
 * `VEVENT` parsed without a window is still returned — as its literal
 * `DTSTART` occurrence only, never expanded — the same "do not guess"
 * instinct that already drops a `VEVENT` with no `DTSTART` rather than
 * inventing one.
 *
 * That last case is a real hazard for whichever caller reads a genuinely
 * recurring feed next (a personal calendar, per #26): forgetting `window`
 * there does not error, it silently reduces every recurring series to one
 * occurrence dated at its literal `DTSTART` — often years in the past — so
 * the series simply never appears. The result is an empty list of events,
 * which looks exactly like a calendar that is legitimately free that day.
 * `window` stays optional anyway, rather than becoming a required argument
 * with an explicit "no bound" alternative, because the only cost of that
 * change would be forcing an edit onto every one of ParentSquare's own
 * existing call sites and tests to say "no bound" out loud for a feed that
 * has never needed one — real present cost against a hazard a future caller
 * has not been written yet to trigger. `test/ics.test.ts` pins today's
 * no-window behaviour for a recurring event specifically, so the trade-off
 * stays visible rather than merely assumed; #26's own call site is where
 * this should be revisited, once it exists to be reasoned about directly.
 */
export function parseIcs(body: string, window?: IcsWindow): IcsEvent[] {
  const events: IcsEvent[] = [];
  const masters: PendingMaster[] = [];
  const overrides: PendingOverride[] = [];

  let current: PendingVevent | null = null;

  for (const line of unfold(body)) {
    if (line === "BEGIN:VEVENT") {
      current = { fields: {}, dtstart: null, rrule: null, exdates: [], recurrenceId: null };
      continue;
    }

    if (line === "END:VEVENT") {
      if (current !== null) finishVevent(current, window, events, masters, overrides);
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

    if (name === "DTSTART") current.dtstart = resolveStamp(params, value);
    else if (name === "RECURRENCE-ID") current.recurrenceId = resolveStamp(params, value);
    else if (name === "RRULE") current.rrule = value;
    else if (name === "EXDATE") {
      // A single EXDATE line may itself list several dates, comma-separated,
      // and a series may repeat the property across several lines — both
      // forms occur in real feeds, so both accumulate here rather than the
      // last one winning.
      for (const part of value.split(",")) {
        const stamp = resolveStamp(params, part);
        if (stamp !== null) current.exdates.push(stamp);
      }
    } else current.fields[name] = value;
  }

  // Expansion happens only now, after the whole file has been read, because
  // an override's RECURRENCE-ID has to be cross-referenced against instances
  // generated from a master that may appear anywhere else in the file.
  if (window !== undefined) {
    const overridden = new Set(overrides.map((override) => `${override.uid}|${override.recurrenceIdDate}`));
    for (const master of masters) {
      for (const occurrence of expandRRule(master.dtstart, master.rrule, window)) {
        if (master.exdates.has(occurrence.date)) continue;
        if (overridden.has(`${master.uid}|${occurrence.date}`)) continue;
        events.push({ uid: master.uid, summary: master.summary, date: occurrence.date, time: occurrence.time });
      }
    }
  }

  for (const override of overrides) {
    if (window === undefined || inWindow(override.dtstart.date, window)) {
      events.push({
        uid: override.uid,
        summary: override.summary,
        date: override.dtstart.date,
        time: override.dtstart.time,
      });
    }
  }

  return events;
}

function inWindow(date: string, window: IcsWindow): boolean {
  return date >= window.start && date <= window.end;
}

/**
 * A quick, exact rejection of a master series that cannot possibly produce an
 * instance inside `window` — a series that ends (`UNTIL`) before the window
 * opens, or one that has not even started (`DTSTART`) by the time the window
 * closes. This is the check that keeps a decade-old daily series from ever
 * reaching `expandRRule` at all when the window has already moved past it,
 * which matters because it is evaluated once per `VEVENT` while parsing,
 * before a single instance of anything is generated.
 */
function masterCouldReachWindow(dtstart: IcsStamp, rrule: RRule, window: IcsWindow): boolean {
  if (dtstart.date > window.end) return false;
  if (rrule.until !== null && rrule.until.date < window.start) return false;
  return true;
}

function finishVevent(
  current: PendingVevent,
  window: IcsWindow | undefined,
  events: IcsEvent[],
  masters: PendingMaster[],
  overrides: PendingOverride[],
): void {
  // A VEVENT with no DTSTART cannot be placed on the Board's calendar, and
  // guessing a date for it would be worse than dropping it.
  if (current.dtstart === null) return;

  const uid = current.fields["UID"] ?? "";
  const summary = unescapeText(current.fields["SUMMARY"] ?? "");
  const dtstart = current.dtstart;

  if (current.recurrenceId !== null) {
    const recurrenceIdDate = current.recurrenceId.date;
    // Kept only if either side of the move could touch the window: the slot
    // it vacates, or the slot it moved into. A rename or reschedule entirely
    // outside the displayable range affects nothing the Board will draw.
    if (window === undefined || inWindow(recurrenceIdDate, window) || inWindow(dtstart.date, window)) {
      overrides.push({ uid, summary, dtstart, recurrenceIdDate });
    }
    return;
  }

  const rrule = current.rrule === null ? null : parseRRule(current.rrule);
  if (rrule !== null && window !== undefined && masterCouldReachWindow(dtstart, rrule, window)) {
    masters.push({ uid, summary, dtstart, rrule, exdates: new Set(current.exdates.map((stamp) => stamp.date)) });
    return;
  }

  // Everything else — a plain non-recurring VEVENT, a recurring one this
  // module was asked to parse with no window at all, or a recurring one that
  // has already been proven unable to reach the window — reduces to the same
  // one honest fact: DTSTART itself, still subject to its own EXDATE and to
  // whatever window bound applies.
  const excludedByOwnExdate = current.exdates.some((stamp) => stamp.date === dtstart.date);
  if (!excludedByOwnExdate && (window === undefined || inWindow(dtstart.date, window))) {
    events.push({ uid, summary, date: dtstart.date, time: dtstart.time });
  }
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

/** The feed escapes commas and semicolons; an allowlist rule will not. */
function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, " ")
    .replace(/\\([,;\\])/g, "$1")
    .trim();
}

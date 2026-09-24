/**
 * When the Board wakes, how long it sleeps, and when a Frame has gone off.
 *
 * All three live on this side of the wire because the Board has no clock
 * (ADR 0001). It cannot work out when to wake next, and it cannot tell a Frame
 * rendered this morning from one rendered last Tuesday — e-paper holds its last
 * image forever, so a failed Refresh looks exactly like a successful one.
 */

import { localDate, addDays, SCHOOL_TIMEZONE } from "../day/clock.js";

/**
 * The Refresh Window: 06:30 local, which is while she is getting dressed and
 * before anyone has asked whether there is school today.
 *
 * One a day. A second window would only matter if the facts changed mid-morning,
 * and by then she has left the house.
 */
export const REFRESH_WINDOW_LOCAL = { hour: 6, minute: 30 } as const;

/**
 * How old a stored Frame may be before it is marked stale.
 *
 * Composition runs several times through the early hours, so a healthy Frame is
 * at most a few hours old when the Board collects it. Twelve hours is past the
 * point where that can still be true, and comfortably short of the twenty-four
 * that would let a whole missed day pass as fresh.
 */
export const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

/**
 * Never let the Board sleep through a whole day, and never let it hammer the
 * Worker in a loop. The floor matters most: a bug that computed zero would turn
 * a battery-powered device into a very short-lived one.
 */
const MIN_SLEEP_SECONDS = 60;
const MAX_SLEEP_SECONDS = 26 * 60 * 60;

const OFFSET_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHOOL_TIMEZONE,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** The zone's offset from UTC, in milliseconds, at a given instant. */
function zoneOffsetMs(instant: Date): number {
  const parts = OFFSET_PARTS.formatToParts(instant);
  const get = (type: string): number => Number(parts.find((p) => p.type === type)?.value ?? "0");
  // `hour12: false` renders midnight as 24 in some runtimes.
  const hour = get("hour") % 24;
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/**
 * The instant at which a given local date's Refresh Window falls.
 *
 * Resolved in two passes because the offset itself depends on the instant: the
 * first pass guesses, the second corrects. On the two days a year the clocks
 * move this is the difference between waking at 06:30 and waking at 05:30.
 */
export function refreshWindowAt(isoDate: string): Date {
  const wall = Date.parse(
    `${isoDate}T${String(REFRESH_WINDOW_LOCAL.hour).padStart(2, "0")}:${String(
      REFRESH_WINDOW_LOCAL.minute,
    ).padStart(2, "0")}:00Z`,
  );
  const guess = new Date(wall - zoneOffsetMs(new Date(wall)));
  return new Date(wall - zoneOffsetMs(guess));
}

/**
 * How many seconds the Board should sleep before its next Refresh.
 *
 * Rounded up, so the Board wakes just after the window rather than just before
 * it and finds a Frame that has already been composed.
 */
export function sleepSeconds(now: Date): number {
  const today = localDate(now);
  let next = refreshWindowAt(today);
  if (next.getTime() <= now.getTime()) next = refreshWindowAt(addDays(today, 1));

  const seconds = Math.ceil((next.getTime() - now.getTime()) / 1000);
  return Math.min(MAX_SLEEP_SECONDS, Math.max(MIN_SLEEP_SECONDS, seconds));
}

/**
 * Whether a Frame composed at `composedAt`, describing `date`, is stale now.
 *
 * Two questions, because they fail differently. Age catches composition having
 * quietly stopped. The date catches a Frame that is young but describes
 * yesterday — which is the failure the Viewer would actually notice, because it
 * is the one that says there is school when there is not.
 */
export function isStale(composedAt: Date, date: string, now: Date): boolean {
  if (now.getTime() - composedAt.getTime() > STALE_AFTER_MS) return true;
  return date !== localDate(now);
}

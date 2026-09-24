/**
 * The school's own event feed.
 *
 * The subscription URL authenticates by being unguessable, so it is a secret:
 * `.dev.vars` in development, `wrangler secret put` in production. It is never
 * a default and never appears in the source.
 */

import { parseIcs, type IcsEvent } from "./ics.js";

/**
 * Fetches and parses the feed, or returns null.
 *
 * Null covers every failure the same way — no URL configured, a network error,
 * a sign-in page returned with a 200 — because the Board's response to all of
 * them is identical: show what it already knows and leave the cell honest.
 */
export async function fetchEvents(icsUrl: string | undefined): Promise<IcsEvent[] | null> {
  if (icsUrl === undefined || icsUrl === "") return null;

  // Subscription URLs are commonly handed out as webcal://, which is the same
  // request over a different scheme name.
  const url = icsUrl.replace(/^webcal:\/\//i, "https://");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      console.warn(`parentsquare: ${response.status}`);
      return null;
    }
    const events = parseIcs(await response.text());
    // A parse that finds nothing usually means an error page arrived with a
    // 200 on it, which is how an expired subscription presents.
    return events.length === 0 ? null : events;
  } catch (error) {
    console.warn(`parentsquare: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

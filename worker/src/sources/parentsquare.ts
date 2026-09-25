/**
 * The school's own event feed.
 *
 * The subscription URL authenticates by being unguessable, so it is a secret:
 * `.dev.vars` in development, `wrangler secret put` in production. It is never
 * a default and never appears in the source.
 */

import { parseIcs, type IcsEvent } from "./ics.js";

/**
 * Three outcomes, not two, because two of them need a human and one does not.
 *
 * A timeout is Tuesday. A feed that answers and refuses, or that was never
 * configured, stays broken until someone goes and fixes it -- and that is the
 * only case worth a mark in the Status Corner. A corner that lit up for every
 * transient blip would be a corner the Caregiver learned to ignore, which costs
 * more than the blip does.
 */
export type EventsResult =
  | { readonly kind: "events"; readonly events: IcsEvent[] }
  | { readonly kind: "unavailable" }
  | { readonly kind: "reauth-needed" };

export async function fetchEvents(icsUrl: string | undefined): Promise<EventsResult> {
  // Not configured is not a transient failure: nobody has set the feed up.
  if (icsUrl === undefined || icsUrl === "") return { kind: "reauth-needed" };

  // Subscription URLs are commonly handed out as webcal://, which is the same
  // request over a different scheme name.
  const url = icsUrl.replace(/^webcal:\/\//i, "https://");

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) {
      console.warn(`parentsquare: ${response.status}`);
      // 4xx is the feed telling us who we are; 5xx is the feed having a bad day.
      return response.status < 500 ? { kind: "reauth-needed" } : { kind: "unavailable" };
    }

    // No window: ParentSquare's own feed carries no recurrence to bound (see
    // ics.ts's module comment), so there is nothing here for an omitted
    // window to silently collapse. That is a fact about *this* feed, not a
    // general safety rule — a future feed whose events do recur must pass an
    // explicit window, or every recurring event silently reduces to a single
    // long-past occurrence. See `parseIcs`'s doc comment for that hazard.
    const events = parseIcs(await response.text());
    // A parse that finds nothing usually means a sign-in page arrived with a
    // 200 on it, which is how a revoked subscription actually presents.
    return events.length === 0 ? { kind: "reauth-needed" } : { kind: "events", events };
  } catch (error) {
    console.warn(`parentsquare: ${error instanceof Error ? error.message : String(error)}`);
    return { kind: "unavailable" };
  }
}

/** The events, or none. For callers that need the calendar, not the cause. */
export function eventsOf(result: EventsResult): IcsEvent[] {
  return result.kind === "events" ? result.events : [];
}

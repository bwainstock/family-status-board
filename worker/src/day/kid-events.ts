/**
 * Which feed entries are Kid-Relevant Events, and so reach the Frame.
 *
 * Most entries are not. The glossary defines the concept as something the
 * Viewer will see, attend, or be asked to dress for, and the default is to
 * show nothing.
 *
 * The rule is an allowlist, not a filter, and that distinction is the whole
 * safeguard. The live ParentSquare feed carries several adult health
 * workshops — "Breast Cancer Workshop", "Cervical Cancer Prevention Workshop",
 * "What is cancer? Workshop" — none of which match any plausible keyword
 * filter, and all of which would otherwise land on a five-year-old's bedroom
 * wall. A filter has to anticipate what to exclude. An allowlist only has to
 * be right about what to include, and its failure mode is a blank cell.
 *
 * Adding an event is a one-line edit below. That is meant to be easy; it is
 * the only way anything new gets on the Board.
 */

import type { KidEventGlyph } from "./model.js";
import type { IcsEvent } from "../sources/ics.js";

export interface KidRelevantEvent {
  readonly date: string;
  readonly glyph: KidEventGlyph;
  readonly caption: string;
}

interface AllowRule {
  /** Matched case-insensitively against the event's summary. */
  readonly match: RegExp;
  readonly glyph: KidEventGlyph;
  /** What the cell says. Written short because it has 198px to live in. */
  readonly caption: string;
}

/**
 * Every rule here was written against a name that actually appears in the
 * feed, which is why some of them look odd. "SPIRTI DAY" is the school's own
 * spelling and has been for years; a rule that insisted on "spirit" would
 * silently drop the one event she most needs warning about, because it is the
 * one where she has to be dressed differently.
 *
 * Deliberately absent: the PTO and SELAC meetings, the volunteer and reader
 * trainings, parent-teacher conferences, the health workshops, and the
 * per-grade shows. None of those change the Viewer's own day, and the
 * per-grade ones belong to other children.
 *
 * Also absent: the feed's own "NO SCHOOL" and "MINIMUM DAY" entries. Per ADR
 * 0003 the checked-in calendar is the authority on those, and letting the feed
 * answer the same question twice is how the Board starts contradicting itself.
 */
export const KID_RELEVANT_ALLOWLIST: readonly AllowRule[] = [
  { match: /spirti day|spirit day/i, glyph: "dress-up", caption: "Spirit Day" },
  { match: /picture day/i, glyph: "star", caption: "Picture Day" },
  { match: /picture retake/i, glyph: "star", caption: "Photos again" },
  { match: /walk-?a-?thon/i, glyph: "sports", caption: "Walk-a-thon" },
  { match: /walk to school/i, glyph: "sports", caption: "Walk to school" },
  { match: /fall festival/i, glyph: "party", caption: "Fall Festival" },
  { match: /movie night/i, glyph: "party", caption: "Movie Night" },
  { match: /dance/i, glyph: "party", caption: "Dance" },
  { match: /science night/i, glyph: "star", caption: "Science Night" },
  { match: /art night/i, glyph: "star", caption: "Art Night" },
  { match: /garden celebration/i, glyph: "party", caption: "Garden Party" },
  { match: /book fair/i, glyph: "book", caption: "Book Fair" },
];

/** The rule a summary matches, or null — which is the default for everything. */
export function kidRelevantEvent(summary: string): Omit<KidRelevantEvent, "date"> | null {
  const rule = KID_RELEVANT_ALLOWLIST.find((candidate) => candidate.match.test(summary));
  return rule === undefined ? null : { glyph: rule.glyph, caption: rule.caption };
}

/**
 * The Kid-Relevant Events in a feed, earliest first.
 *
 * One recurring entry appears on several dates — the feed repeats a weekly
 * meeting as separate VEVENTs — so this is a list of dated facts rather than a
 * list of entries.
 */
export function kidRelevantEvents(events: readonly IcsEvent[]): KidRelevantEvent[] {
  return events
    .flatMap((event) => {
      const allowed = kidRelevantEvent(event.summary);
      return allowed === null ? [] : [{ date: event.date, ...allowed }];
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Dates on which the feed says there is no school.
 *
 * Per ADR 0003 the checked-in calendar still decides, and these never reach a
 * cell. They exist so that a closure the district added mid-year — which no
 * published calendar predicted, and which the table therefore cannot know —
 * shows up as a disagreement in the Status Corner instead of being dropped on
 * the floor by the allowlist.
 *
 * Only the start date is read. The summaries carry ranges in free text
 * ("NO SCHOOL * 9/28 - 10/02") and parsing prose into dates is how a Board
 * starts inventing closures.
 */
export function claimedClosures(events: readonly IcsEvent[]): ReadonlySet<string> {
  const claimed = new Set<string>();
  for (const event of events) {
    if (/^\s*no school\b/i.test(event.summary)) claimed.add(event.date);
  }
  return claimed;
}

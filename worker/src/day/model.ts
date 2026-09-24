/**
 * What the Board knows about one day.
 *
 * This is the seam the whole Worker is built around: everything upstream of it
 * fetches and decides, everything downstream of it only draws. It is a plain
 * object on purpose — a timezone bug should fail with a readable diff, not an
 * image comparison.
 *
 * `null` means "this source failed". It never means "this fact does not
 * apply": a failed source still occupies its cell, drawn as a question mark, so
 * that a missing fact is visible rather than invisible. The one exception is
 * the Entrée on a Non-School Day, where the Non-School layout has no Entrée
 * region at all — there is no lunch to be unsure about.
 */

/** Chosen for what to wear, not for meteorological accuracy. */
export const WEATHER_GLYPH_NAMES = [
  "sun",
  "partly-cloudy",
  "cloud",
  "rain",
  "snow",
  "wind",
  "hot",
  "cold",
] as const;

export type WeatherGlyph = (typeof WEATHER_GLYPH_NAMES)[number];

/**
 * One dish standing for the whole lunch.
 *
 * `hot-dog` and `breakfast` are here because the real SJUSD elementary menu
 * runs a hot dog every Friday and breakfast-for-lunch every few weeks. Drawing
 * either as a corn dog would be a lie the Viewer can see.
 */
export type EntreeGlyph =
  | "pizza"
  | "sandwich"
  | "pasta"
  | "chicken"
  | "taco"
  | "burger"
  | "corn-dog"
  | "hot-dog"
  | "breakfast"
  | "salad"
  /** The table has not learned this dish yet. Drawn as a plate, not as a
   *  question mark: there is a lunch, we just have no picture of it. */
  | "unknown";

/** What the Sleeps are being counted toward: a Kid-Relevant Event, or a Non-School Day. */
export type KidEventGlyph = "no-school" | "party" | "dress-up" | "book" | "sports" | "star";

/**
 * Small marks in the Status Corner, read by the Caregiver and not the Viewer.
 *
 * `closure-disagreement` is the odd one out: it reports that a live source
 * claimed the school was shut on a day the checked-in calendar calls a school
 * day. Per ADR 0003 the calendar still wins, so the Frame is unchanged — but a
 * disagreement about the Board's most load-bearing fact is worth a mark rather
 * than being silently swallowed.
 */
export const STATUS_FLAGS = ["stale", "reauth-needed", "charge-reminder", "closure-disagreement"] as const;

export type StatusFlag = (typeof STATUS_FLAGS)[number];

/**
 * Three states, not a boolean. A Minimum Day has school and has an Entrée; it
 * simply finishes early, and that is a different day from both of the others.
 */
export type SchoolState =
  | { kind: "school" }
  | { kind: "minimum-day" }
  | { kind: "no-school"; reason: string };

/**
 * One slot, two genuinely different cells. Sleeps is the primary use; when
 * nothing is close enough to count toward, the slot shows tomorrow's weather
 * rather than a number too large for the Viewer to hold in her head.
 */
export type Sleeps =
  | { kind: "sleeps"; nights: number; glyph: KidEventGlyph; caption: string }
  | { kind: "tomorrow-weather"; glyph: WeatherGlyph; tempF: number }
  | null;

export interface WeatherFact {
  readonly glyph: WeatherGlyph;
  readonly tempF: number;
}

export interface EntreeFact {
  readonly glyph: EntreeGlyph;
  readonly caption: string;
}

export interface DayModel {
  /** Local calendar date at the school, `YYYY-MM-DD`. */
  readonly date: string;
  readonly weather: WeatherFact | null;
  readonly entree: EntreeFact | null;
  readonly school: SchoolState;
  readonly sleeps: Sleeps;
  readonly status: readonly StatusFlag[];
}

/**
 * Today's lunch, as one dish.
 *
 * A school lunch is a list — an entrée, two fruits, a vegetable, milk. The
 * Viewer does not need the list; she needs to know whether it is pizza. So the
 * first-ordered entrée stands for the whole meal, and everything else is
 * dropped.
 *
 * Nothing here fetches. It is handed an already-parsed payload so the tests
 * can run the real recorded responses through it without a network.
 */

import type { EntreeFact, EntreeGlyph } from "./model.js";

/**
 * MealViewer's shape, as far as we read it. Everything is optional because
 * this API answers 200 with an empty body, a sentinel, or a real menu, and
 * only the body tells you which.
 */
export interface MealViewerPayload {
  readonly menuSchedules?: readonly {
    readonly dateInformation?: { readonly dateFull?: string };
    readonly menuBlocks?: readonly {
      readonly blockName?: string;
      readonly cafeteriaLineList?: {
        readonly data?: readonly {
          readonly foodItemList?: { readonly data?: readonly MealViewerItem[] };
        }[];
      };
    }[];
  }[];
}

export interface MealViewerItem {
  readonly item_Name?: string;
  /** Null on the closure sentinel. That null is the signal, not a defect. */
  readonly item_Type?: string | null;
  readonly item_Order_Id?: number;
}

/** MealViewer's own way of saying the school is shut on a weekday. */
export const NO_SCHOOL_SENTINEL = "NO SCHOOL!";

export type MenuReading =
  | { kind: "entree"; name: string }
  /** The feed says the school is shut. A claim, not a decision — see school.ts. */
  | { kind: "closure-claim" }
  /**
   * No menu blocks at all. This is a weekend *or* a date past the publishing
   * horizon, which is only about five weeks out, and there is nothing in the
   * payload that tells the two apart. It must never be read as a closure.
   */
  | { kind: "no-menu" };

/**
 * A word or two for the Caregiver, and a Glyph for the Viewer.
 *
 * Matched in order, because the menu names are compound: "Chicken Patty
 * Sandwich" is a sandwich, and "Corndog - Chicken" is a corn dog. Putting
 * `chicken` last is what makes both come out right.
 *
 * Every pattern below was written against a real month of the SJUSD elementary
 * menu; see tools/record-fixtures.py.
 */
export const ENTREE_TABLE: readonly {
  readonly match: RegExp;
  readonly glyph: EntreeGlyph;
  readonly caption: string;
}[] = [
  { match: /corn\s*dog/i, glyph: "corn-dog", caption: "Corn dog" },
  { match: /hot\s*dog|frankfurter/i, glyph: "hot-dog", caption: "Hot dog" },
  { match: /pizza/i, glyph: "pizza", caption: "Pizza" },
  { match: /taco|burrito|quesadilla|nacho|enchilada/i, glyph: "taco", caption: "Tacos" },
  { match: /hamburger|cheeseburger|\bburger\b|sloppy joe/i, glyph: "burger", caption: "Hamburger" },
  { match: /sandwich|\bsub\b|hoagie|wrap\b|slider/i, glyph: "sandwich", caption: "Sandwich" },
  { match: /pasta|spaghetti|alfredo|lasagna|macaroni|mac\s*(&|and)?\s*cheese|ziti/i, glyph: "pasta", caption: "Pasta" },
  {
    match: /french toast|pancake|waffle|\bbkfst\b|breakfast|cinnamon roll/i,
    glyph: "breakfast",
    caption: "Breakfast",
  },
  { match: /salad/i, glyph: "salad", caption: "Salad" },
  { match: /chicken|drumstick|tender|nugget|turkey|orange chicken/i, glyph: "chicken", caption: "Chicken" },
];

/**
  * What an Entrée the table has not learned yet looks like.
  *
  * The Caption says "Lunch" on purpose: there *is* a lunch, we just cannot name it, and
  * the plainest word is the honest one to print. Captions are exempt from the glossary's
  * avoid lists -- see the note under Language in CONTEXT.md.
  */
export const UNMAPPED_ENTREE: EntreeFact = { glyph: "unknown", caption: "Lunch" };

export function entreeFor(payload: MealViewerPayload | null, date: string): EntreeFact | null {
  const reading = readMenu(payload, date);
  if (reading.kind !== "entree") return null;
  return mapEntree(reading.name);
}

export function mapEntree(name: string): EntreeFact {
  for (const rule of ENTREE_TABLE) {
    if (rule.match.test(name)) return { glyph: rule.glyph, caption: rule.caption };
  }
  // Logged rather than swallowed: this is how the table finds out what it is
  // missing, and the fallback Glyph is a plate rather than a question mark
  // because there *is* a lunch.
  console.warn(`entree not in the table: ${JSON.stringify(name)}`);
  return UNMAPPED_ENTREE;
}

/**
 * Find the one item that stands for the meal.
 *
 * MealViewer returns 200 with nothing in it, so the payload shape is the only
 * signal. Note that the closure sentinel is a perfectly normal food item whose
 * `item_Type` is null — it is not an error, an empty block, or a status code.
 */
export function readMenu(payload: MealViewerPayload | null, date: string): MenuReading {
  const schedule = payload?.menuSchedules?.find(
    (candidate) => (candidate.dateInformation?.dateFull ?? "").slice(0, 10) === date,
  );
  const blocks = schedule?.menuBlocks ?? [];
  if (blocks.length === 0) return { kind: "no-menu" };

  const items = blocks.flatMap((block) =>
    (block.cafeteriaLineList?.data ?? []).flatMap((line) => line.foodItemList?.data ?? []),
  );
  if (items.length === 0) return { kind: "no-menu" };

  if (items.some((item) => (item.item_Name ?? "").trim().toUpperCase() === NO_SCHOOL_SENTINEL)) {
    return { kind: "closure-claim" };
  }

  // The hot main is the first-ordered ENTREES item. Filtering on the type is
  // also what skips the Breakfast block, whose items are typed BREAKFAST.
  const entrees = items.filter((item) => item.item_Type === "ENTREES");
  const first = entrees.reduce<MealViewerItem | null>((best, item) => {
    const order = item.item_Order_Id ?? Number.MAX_SAFE_INTEGER;
    const bestOrder = best?.item_Order_Id ?? Number.MAX_SAFE_INTEGER;
    return order < bestOrder ? item : best;
  }, null);

  const name = first?.item_Name?.trim();
  if (name === undefined || name === "") return { kind: "no-menu" };
  return { kind: "entree", name: tidy(name) };
}

/**
 * The feed leaves dangling prepositions on items that had a sub-list:
 * "Crispy Chicken Drumstick served with". Trimming it keeps the logged name
 * readable; it does not affect matching.
 */
function tidy(name: string): string {
  return name.replace(/\s*(served with|with)\s*$/i, "").trim();
}

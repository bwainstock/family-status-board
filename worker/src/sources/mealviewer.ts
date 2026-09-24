/**
 * MealViewer. Unauthenticated, CORS-open, and district-wide: the
 * `SJUSDElementarySchoolsSJUSD` slug covers every elementary school in SJUSD,
 * which is why no per-school configuration is needed.
 *
 * The API answers `200 OK` whatever happens, including when it has nothing to
 * say, so the status code is worth almost nothing here. Everything interesting
 * is decided by the payload shape in src/day/entree.ts.
 */

import type { MealViewerPayload } from "../day/entree.js";
import { fetchJson } from "./fetch.js";

export const ELEMENTARY_SLUG = "SJUSDElementarySchoolsSJUSD";

/** MealViewer wants MM-DD-YYYY, unlike everything else in this codebase. */
export function mealViewerDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${month}-${day}-${year}`;
}

export function menuUrl(isoDate: string, slug = ELEMENTARY_SLUG): string {
  const date = mealViewerDate(isoDate);
  return `https://api.mealviewer.com/api/v4/school/${slug}/${date}/${date}`;
}

export function fetchMenu(isoDate: string, slug?: string): Promise<MealViewerPayload | null> {
  return fetchJson<MealViewerPayload>(menuUrl(isoDate, slug), "mealviewer");
}

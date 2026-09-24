/**
 * The Entrée Cell's facts, run against real recorded MealViewer payloads.
 *
 * MealViewer answers 200 whatever happens, so every one of these tests is
 * really about telling four different kinds of "nothing" apart.
 */

import { describe, expect, it, vi } from "vitest";
import { ENTREE_TABLE, entreeFor, mapEntree, readMenu, type MealViewerPayload } from "../src/day/entree.js";
import { mealViewerDate, menuUrl } from "../src/sources/mealviewer.js";
import { fixture } from "./support/fixtures.js";

const normal = fixture<MealViewerPayload>("mealviewer-normal");
const noSchool = fixture<MealViewerPayload>("mealviewer-no-school");
const weekend = fixture<MealViewerPayload>("mealviewer-empty");
const unpublished = fixture<MealViewerPayload>("mealviewer-unpublished");

describe("the menu request", () => {
  it("uses MealViewer's own date format, which is not the one anything else uses", () => {
    expect(mealViewerDate("2026-09-24")).toBe("09-24-2026");
  });

  it("asks the district-wide elementary slug for a single day", () => {
    expect(menuUrl("2026-09-24")).toBe(
      "https://api.mealviewer.com/api/v4/school/SJUSDElementarySchoolsSJUSD/09-24-2026/09-24-2026",
    );
  });
});

describe("reading a recorded menu", () => {
  it("takes the first-ordered entree, which is the hot main", () => {
    expect(readMenu(normal, "2026-09-24")).toEqual({ kind: "entree", name: "Seasoned Turkey Soft Tacos" });
  });

  it("does not mistake the Breakfast block for lunch", () => {
    // The Breakfast block sits first in the payload and its items are ordered
    // from 1 as well. Only the item type separates them.
    expect(readMenu(normal, "2026-09-24")).not.toMatchObject({ name: expect.stringContaining("Bagel") });
  });

  it("maps the entree through the table to a Glyph and a short Caption", () => {
    expect(entreeFor(normal, "2026-09-24")).toEqual({ glyph: "taco", caption: "Tacos" });
  });

  it("reads the NO SCHOOL sentinel as a claim, not as an entree", () => {
    // A perfectly normal block holding one item called "NO SCHOOL!" whose
    // item_Type is null. It is a claim about the school, and school.ts decides
    // what to do with it; the calendar still wins.
    expect(readMenu(noSchool, "2026-09-28")).toEqual({ kind: "closure-claim" });
    expect(entreeFor(noSchool, "2026-09-28")).toBeNull();
  });

  it("reads an empty menuBlocks as no menu, never as a closure", () => {
    // This fixture is a Saturday and this one is a school day too far out to
    // have been published. The payloads are indistinguishable, which is the
    // entire reason emptiness cannot mean "no school".
    expect(readMenu(weekend, "2026-09-26")).toEqual({ kind: "no-menu" });
    expect(readMenu(unpublished, "2026-12-10")).toEqual({ kind: "no-menu" });
  });

  it("treats a success with an empty payload as no data", () => {
    // This API does not signal failure by status code, so the shape is all
    // there is to go on.
    expect(readMenu({}, "2026-09-24")).toEqual({ kind: "no-menu" });
    expect(readMenu({ menuSchedules: [] }, "2026-09-24")).toEqual({ kind: "no-menu" });
    expect(entreeFor(null, "2026-09-24")).toBeNull();
  });

  it("ignores a schedule for a different date", () => {
    expect(readMenu(normal, "2026-09-25")).toEqual({ kind: "no-menu" });
  });
});

describe("the Entree table", () => {
  it.each([
    ["Seasoned Turkey Soft Tacos", "taco", "Tacos"],
    ["Turkey Hot Dog", "hot-dog", "Hot dog"],
    ["Corndog - Chicken", "corn-dog", "Corn dog"],
    ["Cheese Pizza", "pizza", "Pizza"],
    ["Pepperoni Pizza", "pizza", "Pizza"],
    ["100% Beef Hamburger", "burger", "Hamburger"],
    ["Beef BBQ Rib Sandwich", "sandwich", "Sandwich"],
    ["Crispy Chicken Tenders", "chicken", "Chicken"],
    ["Crispy Chicken Drumstick served with", "chicken", "Chicken"],
    ["Orange Chicken White Rice", "chicken", "Chicken"],
    ["Butter Chicken served with", "chicken", "Chicken"],
    ["Italian Pasta Bake", "pasta", "Pasta"],
    ["Pasta Alfredo", "pasta", "Pasta"],
    ["Bkfst 4 Lunch - French Toast & Turkey Sausage Link", "breakfast", "Breakfast"],
  ])("maps the real menu item %j", (name, glyph, caption) => {
    expect(mapEntree(name)).toEqual({ glyph, caption });
  });

  it("reads a compound name as the thing it is served in", () => {
    // "Chicken Patty Sandwich" is a sandwich. Matching "chicken" first would
    // draw a drumstick, which is not what arrives on the tray.
    expect(mapEntree("Chicken Patty Sandwich")).toEqual({ glyph: "sandwich", caption: "Sandwich" });
    // And a corn dog is a corn dog, not chicken and not a hot dog.
    expect(mapEntree("Corndog - Chicken")).toEqual({ glyph: "corn-dog", caption: "Corn dog" });
  });

  it("falls back to a plate, not a question mark, and says so in the log", () => {
    // An unmapped Entree means there *is* a lunch and the table has not
    // learned its picture. That is a different thing from a failed source, and
    // the log line is how the table grows.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(mapEntree("Braised Jackfruit Bao")).toEqual({ glyph: "unknown", caption: "Lunch" });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("Braised Jackfruit Bao"));
    warn.mockRestore();
  });

  it("keeps every Caption short enough to be worth reading", () => {
    for (const rule of ENTREE_TABLE) {
      expect(rule.caption.length, rule.caption).toBeLessThanOrEqual(12);
    }
  });
});

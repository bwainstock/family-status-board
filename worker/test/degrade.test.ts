import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { composeDay } from "../src/board/compose.js";
import { fetchEvents, eventsOf } from "../src/sources/parentsquare.js";
import { chargeReminderDue } from "../src/day/charge.js";
import { claimedClosures } from "../src/day/kid-events.js";
import { renderFrame } from "../src/frame/render.js";
import { FRAME_BYTES } from "../src/framebuffer.js";
import { CELLS, glyphBox } from "../src/frame/layout.js";
import { countInk } from "./support/ink.js";
import { fixture, fixtureText } from "./support/fixtures.js";
import type { DayModel } from "../src/day/model.js";

const DATE = "2026-09-24";
const FEED = "https://feed.example/calendar.ics";

type Source = "open-meteo" | "mealviewer" | "parentsquare";

/**
 * Serves the recording for each source, except the ones named, which fail the
 * way that source actually fails.
 */
function serveExcept(down: readonly Source[]): void {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    const source: Source = url.includes("open-meteo")
      ? "open-meteo"
      : url.includes("mealviewer")
        ? "mealviewer"
        : "parentsquare";

    if (down.includes(source)) throw new Error(`${source} is down`);

    if (source === "parentsquare") {
      return new Response(fixtureText("parentsquare.ics"), { headers: { "content-type": "text/calendar" } });
    }
    const name = source === "open-meteo" ? "open-meteo-clear" : "mealviewer-normal";
    return new Response(JSON.stringify(fixture(name)), { headers: { "content-type": "application/json" } });
  });
}

function compose(down: readonly Source[]): Promise<DayModel> {
  serveExcept(down);
  return composeDay(DATE, { PARENTSQUARE_ICS_URL: FEED });
}

/**
 * The Viewer is five and cannot detect an error. A question mark is a good
 * outcome; a confident wrong Glyph is not, and a blank where a cell used to be
 * is worse than either, because she would not know anything was missing.
 */
describe("one broken source costs one cell", () => {
  beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
  afterEach(() => vi.unstubAllGlobals());

  it("loses the weather and keeps everything else", async () => {
    const day = await compose(["open-meteo"]);
    expect(day.weather).toBeNull();
    expect(day.entree).not.toBeNull();
    expect(day.school.kind).toBe("school");
    expect(day.date).toBe(DATE);
  });

  it("loses the Entree and keeps everything else", async () => {
    const day = await compose(["mealviewer"]);
    expect(day.entree).toBeNull();
    expect(day.weather).not.toBeNull();
    expect(day.sleeps).not.toBeNull();
  });

  it("loses the events and still counts toward the checked-in calendar", async () => {
    // Per ADR 0003 the calendar is bedrock and is not fetched. A dead feed
    // costs the events it would have added, not the sleeps itself.
    const day = await compose(["parentsquare"]);
    expect(day.sleeps).not.toBeNull();
    expect(day.weather).not.toBeNull();
  });

  it("still produces a servable Frame with every source down at once", async () => {
    const day = await compose(["open-meteo", "mealviewer", "parentsquare"]);
    expect(day.weather).toBeNull();
    expect(day.entree).toBeNull();
    // School comes from the checked-in calendar, which is why it survives.
    expect(day.school.kind).toBe("school");

    const frame = renderFrame(day);
    expect(frame.bytes.length).toBe(FRAME_BYTES);
  });

  it("keeps the Frame the same shape when a cell has nothing to say", async () => {
    // A blank cell would be invisible: she would see three facts and not know
    // a fourth was missing. Every cell draws something, always.
    const dark = renderFrame(await compose(["open-meteo", "mealviewer", "parentsquare"]));
    for (const name of ["weather", "entree", "school", "sleeps"] as const) {
      expect(countInk(dark, glyphBox(CELLS[name])), name).toBeGreaterThan(0);
    }
  });

  it("says it does not know rather than guessing", async () => {
    const day = await compose(["open-meteo", "mealviewer"]);
    // Null at the facts seam, so the renderer draws a question mark. A default
    // Glyph here would be a confident lie about a fact nobody checked.
    expect(day.weather).toBeNull();
    expect(day.entree).toBeNull();
  });
});

/**
 * Marks describe the Board, not the day. They are read by the Caregiver, and
 * the corner is empty when nothing needs attention so that its presence means
 * something.
 */
describe("the Status Corner", () => {
  beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
  afterEach(() => vi.unstubAllGlobals());

  it("stays empty on an ordinary day with everything working", async () => {
    const day = await compose([]);
    expect(chargeReminderDue(DATE)).toBe(false);
    expect(day.status).toEqual([]);
  });

  it("does not nag about a feed that is merely having a bad morning", async () => {
    // A corner that lit up for every timeout is a corner nobody reads.
    const day = await compose(["parentsquare"]);
    expect(day.status).not.toContain("reauth-needed");
  });

  it("asks for a human when the feed needs one", async () => {
    for (const response of [
      new Response("sign in", { status: 401 }),
      new Response("<html>Please sign in</html>", { status: 200 }),
    ]) {
      vi.stubGlobal("fetch", async () => response.clone());
      expect((await fetchEvents(FEED)).kind).toBe("reauth-needed");
    }
  });

  it("treats an unconfigured feed as needing a human, not as a blip", async () => {
    // Nobody set it up. That does not fix itself.
    expect((await fetchEvents(undefined)).kind).toBe("reauth-needed");
    expect((await fetchEvents("")).kind).toBe("reauth-needed");
  });

  it("waits out a feed having a server-side problem", async () => {
    vi.stubGlobal("fetch", async () => new Response("oops", { status: 503 }));
    expect((await fetchEvents(FEED)).kind).toBe("unavailable");
  });

  it("raises the reauth mark through composition", async () => {
    serveExcept([]);
    const day = await composeDay(DATE, {});
    expect(day.status).toContain("reauth-needed");
  });

  it("reminds about charging for a few days each month, and then stops", async () => {
    // One day would be missed by one holiday. A week would become wallpaper.
    const due = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-10-01", "2027-01-03"];
    const quiet = ["2026-09-04", "2026-09-15", "2026-09-30", "2026-08-31"];
    for (const date of due) expect(chargeReminderDue(date), date).toBe(true);
    for (const date of quiet) expect(chargeReminderDue(date), date).toBe(false);
  });

  it("raises the charge mark through composition", async () => {
    serveExcept([]);
    const day = await composeDay("2026-10-01", { PARENTSQUARE_ICS_URL: FEED });
    expect(day.status).toContain("charge-reminder");
  });
});

/**
 * Per ADR 0003 the checked-in calendar decides whether there is school, and
 * nothing fetched can overrule it. But a closure added mid-year is precisely
 * what the table cannot know, so a live source claiming one is surfaced rather
 * than resolved -- and, crucially, rather than dropped.
 */
describe("a live source disagreeing about a closure", () => {
  beforeEach(() => vi.spyOn(console, "warn").mockImplementation(() => {}));
  afterEach(() => vi.unstubAllGlobals());

  /**
   * The genuine recorded `NO SCHOOL!` payload, moved onto a date the
   * checked-in calendar calls an ordinary school day. That relabelling is the
   * scenario: a closure added mid-year, which no published calendar predicted
   * and which the table therefore cannot have.
   */
  function serveClosureClaim(): void {
    serveExcept([]);
    const inner = globalThis.fetch;
    const moved = JSON.parse(
      JSON.stringify(fixture("mealviewer-no-school")).replaceAll("2026-09-28", DATE),
    ) as unknown;
    vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input instanceof Request ? input.url : input);
      if (!url.includes("mealviewer")) return inner(input as RequestInfo, init);
      return new Response(JSON.stringify(moved), { headers: { "content-type": "application/json" } });
    });
  }

  it("marks the corner, and is reachable from real composition", async () => {
    // The regression this exists for: resolveSchool has always accepted the
    // signal, but nothing was passing it, so the mark could only be produced
    // by a hand-built DayModel in a test.
    serveClosureClaim();
    const day = await composeDay(DATE, { PARENTSQUARE_ICS_URL: FEED });
    expect(day.status).toContain("closure-disagreement");
  });

  it("still shows the school day the calendar says it is", async () => {
    // Surfaced, not obeyed. The Viewer sees a normal school day.
    serveClosureClaim();
    const day = await composeDay("2026-09-24", { PARENTSQUARE_ICS_URL: FEED });
    expect(day.school.kind).toBe("school");
  });

  it("hears the events feed claim a closure too", () => {
    expect(
      claimedClosures([
        { uid: "a@school", date: "2026-11-03", summary: "NO SCHOOL - Emergency closure", time: null },
        { uid: "b@school", date: "2026-11-04", summary: "Art Night", time: null },
      ]),
    ).toEqual(new Set(["2026-11-03"]));
  });

  it("reads the recorded feed's own closure entry without inventing the rest", async () => {
    // "NO SCHOOL * 9/28 - 10/02" carries its range in prose. Only the start
    // date is real; parsing the rest out of free text is how a Board starts
    // inventing closures.
    serveExcept([]);
    const claimed = claimedClosures(eventsOf(await fetchEvents(FEED)));
    expect(claimed.has("2026-09-28")).toBe(true);
    expect(claimed.has("2026-09-30")).toBe(false);
  });

  it("says nothing when the feed and the calendar agree", async () => {
    // 2026-09-28 is the first day of fall recess in the checked-in calendar,
    // and the feed says so too. Agreement is not a disagreement.
    serveExcept([]);
    const day = await composeDay("2026-09-28", { PARENTSQUARE_ICS_URL: FEED });
    expect(day.school.kind).toBe("no-school");
    expect(day.status).not.toContain("closure-disagreement");
  });
});

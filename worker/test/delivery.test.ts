import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../src/index.js";
import { serveFrame, refreshStoredFrame } from "../src/board/serve.js";
import { getFrame, putFrame } from "../src/board/store.js";
import {
  sleepSeconds,
  isStale,
  refreshWindowAt,
  REFRESH_WINDOW_LOCAL,
  STALE_AFTER_MS,
} from "../src/board/schedule.js";
import { renderFrame } from "../src/frame/render.js";
import { FRAME_BYTES } from "../src/framebuffer.js";
import { localDate } from "../src/day/clock.js";
import { MemoryKv } from "./support/kv.js";
import { fixture } from "./support/fixtures.js";
import type { DayModel } from "../src/day/model.js";

const SECRET = "correct-horse-battery-staple";

function env(kv: MemoryKv, overrides: Partial<Env> = {}): Env {
  return { FRAMES: kv, BOARD_SECRET: SECRET, ...overrides };
}

function boardRequest(headers: Record<string, string> = { authorization: `Bearer ${SECRET}` }): Request {
  return new Request("https://board.example/frame", { headers });
}

function model(overrides: Partial<DayModel> = {}): DayModel {
  return {
    date: "2026-09-24",
    weather: { glyph: "sun", tempF: 72 },
    entree: { glyph: "pizza", caption: "Pizza" },
    school: { kind: "school" },
    countdown: { kind: "sleeps", sleeps: 3, glyph: "party", caption: "Art Night" },
    status: [],
    ...overrides,
  };
}

/** The recorded payloads, so composition runs offline and repeatably. */
function serveRecordings(): void {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    if (url.includes("parentsquare")) {
      return new Response(fixture("parentsquare.ics"), { headers: { "content-type": "text/calendar" } });
    }
    const name = url.includes("open-meteo") ? "open-meteo-clear" : "mealviewer-normal";
    return new Response(JSON.stringify(fixture(name)), {
      headers: { "content-type": "application/json" },
    });
  });
}

/**
 * The delivery path, end to end.
 *
 * Everything here is a property the Board depends on and cannot check for
 * itself: it has no clock, no parser, and no way to tell a correct Frame from a
 * three-day-old one.
 */
describe("the Board's endpoint", () => {
  it("hands over exactly one panel's worth of bytes, uncompressed", async () => {
    // The device blits straight from the socket into a fixed buffer. A body
    // that is gzipped, JSON-wrapped, or one byte off is not something it can
    // recover from.
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/octet-stream");
    expect(response.headers.get("content-encoding")).toBeNull();
    expect((await response.arrayBuffer()).byteLength).toBe(FRAME_BYTES);
  });

  it("serves the stored bytes rather than composing on the Board's time", async () => {
    // Composition is the slow part: three third-party APIs. If it happened here
    // the Board would hold its radio on for all of it, on battery.
    const kv = new MemoryKv();
    const stored = renderFrame(model()).bytes;
    await putFrame(kv, { bytes: stored, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });

    vi.stubGlobal("fetch", () => {
      throw new Error("the endpoint must not reach an upstream");
    });
    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));
    vi.unstubAllGlobals();

    expect(new Uint8Array(await response.arrayBuffer())).toEqual(stored);
  });

  it("tells the Board how long to sleep, because it has no clock", async () => {
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));

    const seconds = Number(response.headers.get("x-sleep-seconds"));
    expect(Number.isInteger(seconds)).toBe(true);
    expect(seconds).toBeGreaterThan(0);
  });

  it("refuses to serve without the shared secret", async () => {
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });
    const now = new Date("2026-09-24T13:30:00Z");

    for (const headers of [
      {},
      { authorization: "Bearer" },
      { authorization: `Bearer ${SECRET}x` },
      { authorization: `Basic ${SECRET}` },
    ] as Record<string, string>[]) {
      const response = await serveFrame(boardRequest(headers), env(kv), now);
      expect(response.status, JSON.stringify(headers)).toBe(401);
      expect((await response.arrayBuffer()).byteLength).toBeLessThan(FRAME_BYTES);
    }
  });

  it("fails closed when no secret is configured", async () => {
    // A deploy that forgot the secret must not quietly publish a child's
    // school schedule to anyone who guesses the path.
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });

    const response = await serveFrame(boardRequest({}), { FRAMES: kv }, new Date("2026-09-24T13:30:00Z"));
    expect(response.status).toBe(503);
  });

  it("says try again rather than serving nothing at all", async () => {
    const response = await serveFrame(boardRequest(), env(new MemoryKv()), new Date("2026-09-24T13:30:00Z"));
    expect(response.status).toBe(503);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });

  it("never hands over a truncated Frame", async () => {
    // A short read blitted to the panel is not a degraded picture, it is noise.
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });
    kv.truncate();

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));
    expect(response.status).toBe(503);
  });

  it("is reachable through the request handler at /frame", async () => {
    const kv = new MemoryKv();
    await putFrame(kv, { bytes: renderFrame(model()).bytes, model: model(), composedAt: new Date() });

    const wired = await worker.fetch(boardRequest(), env(kv));
    expect(wired.status).toBe(200);

    const unrouted = await worker.fetch(new Request("https://board.example/frames"), env(kv));
    expect(unrouted.status).toBe(404);
  });
});

/**
 * Per ADR 0001 this is the one failure the Board cannot observe. E-paper holds
 * its last image with no power, so a Refresh that never happened looks exactly
 * like one that did.
 */
describe("staleness, decided here because the Board cannot", () => {
  it("marks a Frame that has outlived its Refresh Window", () => {
    const composedAt = new Date("2026-09-24T12:00:00Z");
    expect(isStale(composedAt, "2026-09-24", new Date(composedAt.getTime() + STALE_AFTER_MS - 1000))).toBe(false);
    expect(isStale(composedAt, "2026-09-24", new Date(composedAt.getTime() + STALE_AFTER_MS + 1000))).toBe(true);
  });

  it("marks a Frame that is young but describes yesterday", () => {
    // The failure that actually gets noticed: a Frame saying there is school on
    // a day there is not. Age alone would let it through.
    const now = new Date("2026-09-25T13:30:00Z");
    expect(localDate(now)).toBe("2026-09-25");
    expect(isStale(new Date("2026-09-25T11:00:00Z"), "2026-09-24", now)).toBe(true);
    expect(isStale(new Date("2026-09-25T11:00:00Z"), "2026-09-25", now)).toBe(false);
  });

  it("puts the mark on the Frame, not only in a header", async () => {
    // The Caregiver looks at the wall, not at curl.
    const kv = new MemoryKv();
    const fresh = renderFrame(model()).bytes;
    await putFrame(kv, { bytes: fresh, model: model(), composedAt: new Date("2026-09-20T12:00:00Z") });

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));
    const served = new Uint8Array(await response.arrayBuffer());

    expect(response.headers.get("x-frame-stale")).toBe("1");
    expect(served).not.toEqual(fresh);
    expect(served).toEqual(renderFrame(model({ status: ["stale"] })).bytes);
  });

  it("leaves a fresh Frame exactly as it was composed", async () => {
    const kv = new MemoryKv();
    const fresh = renderFrame(model()).bytes;
    await putFrame(kv, { bytes: fresh, model: model(), composedAt: new Date("2026-09-24T12:00:00Z") });

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));
    expect(response.headers.get("x-frame-stale")).toBe("0");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(fresh);
  });

  it("does not mark the same Frame stale twice", async () => {
    const kv = new MemoryKv();
    const already = model({ status: ["stale"] });
    await putFrame(kv, { bytes: renderFrame(already).bytes, model: already, composedAt: new Date("2026-09-20T12:00:00Z") });

    const response = await serveFrame(boardRequest(), env(kv), new Date("2026-09-24T13:30:00Z"));
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(renderFrame(already).bytes);
  });
});

/**
 * The Board obeys this number literally. Getting it wrong either flattens the
 * battery in a day or leaves yesterday on the wall.
 */
describe("the Refresh Window", () => {
  it("lands at 06:30 local on both sides of daylight saving", () => {
    // Pinned to a UTC hour instead, one of these would be an hour out for half
    // the school year.
    for (const date of ["2026-09-24", "2026-12-15", "2027-03-15"]) {
      const at = refreshWindowAt(date);
      const local = new Intl.DateTimeFormat("en-GB", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(at);
      expect(local, date).toBe(
        `${String(REFRESH_WINDOW_LOCAL.hour).padStart(2, "0")}:${String(REFRESH_WINDOW_LOCAL.minute).padStart(2, "0")}`,
      );
    }
  });

  it("counts to this morning's window if it has not happened yet", () => {
    // 2026-09-24 05:00 local is 12:00 UTC.
    expect(sleepSeconds(new Date("2026-09-24T12:00:00Z"))).toBe(90 * 60);
  });

  it("counts to tomorrow's window once today's has passed", () => {
    // 07:00 local, half an hour after the window.
    const seconds = sleepSeconds(new Date("2026-09-24T14:00:00Z"));
    expect(seconds).toBe(23 * 60 * 60 + 30 * 60);
  });

  it("never returns a sleep that would flatten the battery or skip a day", () => {
    // A zero here turns a device that wakes once a day into one that wakes
    // continuously; an enormous one leaves yesterday on the wall.
    for (let hour = 0; hour < 24; hour++) {
      const seconds = sleepSeconds(new Date(`2026-09-24T${String(hour).padStart(2, "0")}:00:00Z`));
      expect(seconds, `${hour}:00Z`).toBeGreaterThanOrEqual(60);
      expect(seconds, `${hour}:00Z`).toBeLessThanOrEqual(26 * 60 * 60);
    }
  });
});

describe("composing ahead of the window", () => {
  beforeEach(serveRecordings);
  afterEach(() => vi.unstubAllGlobals());

  it("stores a Frame the endpoint can then serve without touching a source", async () => {
    const kv = new MemoryKv();
    const now = new Date("2026-09-24T13:00:00Z");

    await refreshStoredFrame(env(kv), now);

    const stored = await getFrame(kv);
    expect(stored?.bytes.length).toBe(FRAME_BYTES);
    expect(stored?.model.date).toBe(localDate(now));
    expect(stored?.composedAt.toISOString()).toBe(now.toISOString());
  });

  it("keeps the facts small enough for KV to hold alongside the bytes", async () => {
    // Metadata is capped at 1 KiB. A Frame that stores but cannot be marked
    // stale would be a silent failure on exactly the morning it matters.
    const kv = new MemoryKv();
    await refreshStoredFrame(env(kv), new Date("2026-09-24T13:00:00Z"));
    const stored = await getFrame(kv);
    expect(JSON.stringify(stored?.model).length).toBeLessThan(768);
  });

  it("leaves the previous Frame alone when composing or storing fails", async () => {
    // With no local rendering, a bad write means garbage on the wall until the
    // next window. Yesterday is at least a day that happened, and the stale
    // mark will admit to it.
    const kv = new MemoryKv();
    const yesterday = model({ date: "2026-09-23" });
    const good = renderFrame(yesterday).bytes;
    await putFrame(kv, { bytes: good, model: yesterday, composedAt: new Date("2026-09-23T13:00:00Z") });

    // Sources swallow their own failures by design, so the failure is forced
    // past them at the one step that cannot be swallowed.
    const failing: Env = {
      ...env(kv),
      FRAMES: Object.create(kv, {
        put: { value: () => Promise.reject(new Error("kv unavailable")) },
      }) as MemoryKv,
    };
    await expect(refreshStoredFrame(failing, new Date("2026-09-24T13:00:00Z"))).rejects.toThrow();

    expect((await getFrame(kv))?.bytes).toEqual(good);
    expect((await getFrame(kv))?.model.date).toBe("2026-09-23");
  });

  it("composes well inside the CPU budget it is billed against", async () => {
    // The Free plan allows 10ms of CPU per invocation. Wall time here includes
    // the stubbed fetches, so this is a coarse alarm rather than a measurement:
    // it catches an accidentally quadratic renderer, not a slow morning.
    const kv = new MemoryKv();
    const started = performance.now();
    await refreshStoredFrame(env(kv), new Date("2026-09-24T13:00:00Z"));
    expect(performance.now() - started).toBeLessThan(250);
  });
});

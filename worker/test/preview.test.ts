import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import worker from "../src/index.js";
import { decodePng1Bit } from "../src/preview/png.js";
import { WIDTH, HEIGHT } from "../src/framebuffer.js";
import { fixture } from "./support/fixtures.js";

function get(path: string): Promise<Response> {
  return worker.fetch(new Request(`https://board.example${path}`));
}

/**
 * The route reaches two live upstreams. Serving recorded payloads instead keeps
 * the suite offline and repeatable, and still exercises the real fetch/parse
 * path rather than stubbing it out.
 */
function serveRecordings(): void {
  vi.stubGlobal("fetch", async (input: RequestInfo | URL) => {
    const url = String(input instanceof Request ? input.url : input);
    const name = url.includes("open-meteo") ? "open-meteo-clear" : "mealviewer-normal";
    return new Response(JSON.stringify(fixture(name)), {
      headers: { "content-type": "application/json" },
    });
  });
}

/**
 * The preview route is the development loop: change the layout, reload, look at
 * it. These tests keep that loop working, and keep the date override honest so
 * that Thanksgiving can be inspected in September.
 */
describe("preview route", () => {
  beforeEach(serveRecordings);
  afterEach(() => vi.unstubAllGlobals());
  it("serves a viewable image of the whole panel at true size", async () => {
    const response = await get("/preview.png");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");

    const decoded = decodePng1Bit(new Uint8Array(await response.arrayBuffer()));
    expect({ width: decoded.width, height: decoded.height }).toEqual({ width: WIDTH, height: HEIGHT });
  });

  it("serves a page that shows the Frame at true size", async () => {
    const response = await get("/preview");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");

    const body = await response.text();
    expect(body).toContain(`width: ${WIDTH}px`);
    expect(body).toContain(`height: ${HEIGHT}px`);
    // A smoothed preview would lie about a 1-bit panel.
    expect(body).toContain("image-rendering: pixelated");
  });

  it("accepts a date override so any day of the year can be inspected", async () => {
    const response = await get("/preview?date=2026-11-25");
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("2026-11-25");
  });

  it("passes the override through to the image", async () => {
    const response = await get("/preview.png?date=2027-03-11");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });

  it("rejects a date it cannot resolve rather than quietly showing today", async () => {
    for (const bad of ["2026-13-01", "2026-02-31", "tomorrow", ""]) {
      const response = await get(`/preview?date=${encodeURIComponent(bad)}`);
      expect(response.status, `date=${bad}`).toBe(400);
    }
  });

  it("does not reflect an unvalidated date into the page", async () => {
    const response = await get("/preview?date=%3Cscript%3E");
    expect(response.status).toBe(400);
    expect(await response.text()).not.toContain("<script>");
  });

  it("has nothing at the root yet", async () => {
    expect((await get("/")).status).toBe(404);
  });

  it("still draws a Frame when both upstreams are down", async () => {
    // The Board is on a wall. A failed source must degrade to a question mark,
    // never to a 500 and a blank panel.
    vi.stubGlobal("fetch", async () => {
      throw new Error("network down");
    });

    const response = await get("/preview.png");
    expect(response.status).toBe(200);
    const decoded = decodePng1Bit(new Uint8Array(await response.arrayBuffer()));
    expect({ width: decoded.width, height: decoded.height }).toEqual({ width: WIDTH, height: HEIGHT });
  });

  it("refuses anything but GET", async () => {
    const response = await worker.fetch(
      new Request("https://board.example/preview.png", { method: "POST" }),
    );
    expect(response.status).toBe(405);
  });
});

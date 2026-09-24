/**
 * The Worker's HTTP surface.
 *
 * Today this is only the development loop: a preview route that renders a Frame
 * as a viewable image so layout work needs no hardware. The Board's own
 * endpoint, its shared secret and the scheduled composition arrive with the
 * delivery path.
 */

import { renderFrame } from "./frame/render.js";
import { localDate, isIsoDate } from "./day/clock.js";
import type { DayModel } from "./day/model.js";
import { encodePng1Bit } from "./preview/png.js";
import { WIDTH, HEIGHT } from "./framebuffer.js";

export interface Env {
  readonly [key: string]: unknown;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return new Response("method not allowed", { status: 405 });
    }

    switch (url.pathname) {
      case "/preview":
        return previewPage(url);
      case "/preview.png":
        return previewImage(url);
      default:
        return new Response("not found", { status: 404 });
    }
  },
};

/**
 * The date override exists so that Thanksgiving or a Minimum Day can be
 * inspected today rather than waited for.
 */
function requestedDate(url: URL): string | { error: string } {
  const override = url.searchParams.get("date");
  if (override === null) return localDate(new Date());
  // The rejected value is deliberately not echoed back: it is attacker-chosen.
  if (!isIsoDate(override)) return { error: "date must be a calendar date in YYYY-MM-DD form" };
  return override;
}

function previewImage(url: URL): Response {
  const date = requestedDate(url);
  if (typeof date !== "string") return new Response(date.error, { status: 400 });

  const frame = renderFrame(placeholderDay(date));
  const png = encodePng1Bit(frame.bytes, WIDTH, HEIGHT);

  return new Response(png, {
    headers: {
      "content-type": "image/png",
      "cache-control": "no-store",
    },
  });
}

function previewPage(url: URL): Response {
  const date = requestedDate(url);
  if (typeof date !== "string") return new Response(date.error, { status: 400 });

  const src = `/preview.png?date=${encodeURIComponent(date)}`;
  const body = `<!doctype html>
<meta charset="utf-8">
<title>Frame preview — ${escapeHtml(date)}</title>
<style>
  body { background: #555; color: #eee; font: 14px system-ui, sans-serif; margin: 24px; }
  /* image-rendering matters: the panel is 1-bit and a smoothed preview lies about it */
  img { display: block; width: ${WIDTH}px; height: ${HEIGHT}px; image-rendering: pixelated; background: #fff; }
  form { margin: 0 0 12px; }
</style>
<form method="get" action="/preview">
  <label>Date <input type="date" name="date" value="${escapeHtml(date)}"></label>
  <button type="submit">Show</button>
</form>
<img src="${src}" alt="Frame for ${escapeHtml(date)}" width="${WIDTH}" height="${HEIGHT}">
<p>${WIDTH}&times;${HEIGHT}, shown at true size.</p>`;

  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

/** Stands in until the sources are wired up. */
function placeholderDay(date: string): DayModel {
  return { date, weather: null, entree: null, school: { kind: "school" }, countdown: null, status: [] };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

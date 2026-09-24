/**
 * The Worker's HTTP surface, and the schedule behind it.
 *
 * Two audiences. `/frame` is the Board: raw bytes and a sleep duration, behind
 * a shared secret. `/preview` is a human with a browser, so that layout work
 * needs no hardware.
 */

import { renderFrame } from "./frame/render.js";
import { localDate, isIsoDate } from "./day/clock.js";
import { composeDay } from "./board/compose.js";
import { serveFrame, refreshStoredFrame, type BoardEnv } from "./board/serve.js";
import { encodePng1Bit } from "./preview/png.js";
import { WIDTH, HEIGHT } from "./framebuffer.js";

export interface Env extends BoardEnv {
  /**
   * The ParentSquare iCal subscription URL. A credential, because it
   * authenticates by being unguessable: `.dev.vars` in development,
   * `wrangler secret put` in production, never a default in the source.
   */
  readonly PARENTSQUARE_ICS_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method !== "GET") {
      return new Response("method not allowed", { status: 405 });
    }

    switch (url.pathname) {
      case "/frame":
        return serveFrame(request, env, new Date());
      case "/preview":
        return previewPage(url);
      case "/preview.png":
        return previewImage(url, env);
      default:
        return new Response("not found", { status: 404 });
    }
  },

  /**
   * Composition runs ahead of the Refresh Window, not during it. The Board is
   * awake for a few seconds on battery; making it wait on three third-party
   * APIs is the difference between a download and an outage.
   */
  async scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(refreshStoredFrame(env, new Date(event.scheduledTime)));
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

async function previewImage(url: URL, env: Env): Promise<Response> {
  const date = requestedDate(url);
  if (typeof date !== "string") return new Response(date.error, { status: 400 });

  const frame = renderFrame(await composeDay(date, env));
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

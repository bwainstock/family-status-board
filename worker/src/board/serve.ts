/**
 * The Board's endpoint.
 *
 * Everything the Board needs in one response: the packed bytes to blit, and how
 * long to sleep afterwards. No JSON, no PNG, no compression — the device has
 * about 30 KB of usable RAM and nothing to decode with.
 */

import { renderFrame } from "../frame/render.js";
import { FRAME_BYTES } from "../framebuffer.js";
import { getFrame, putFrame, type FrameStore } from "./store.js";
import { composeDay, type Sources } from "./compose.js";
import { sleepSeconds, isStale } from "./schedule.js";
import { localDate } from "../day/clock.js";
import type { DayModel } from "../day/model.js";

export interface BoardEnv extends Sources {
  readonly FRAMES: FrameStore;
  /** Shared with the Board and nothing else. No default, ever. */
  readonly BOARD_SECRET?: string;
}

/** How long to wait before trying again when there is nothing to serve yet. */
const RETRY_SECONDS = 15 * 60;

export async function serveFrame(request: Request, env: BoardEnv, now: Date): Promise<Response> {
  // An unconfigured secret must fail closed. Treating a missing secret as "no
  // authentication required" is how a misconfigured deploy ends up publishing
  // a child's school schedule.
  if (!env.BOARD_SECRET) {
    return new Response("board secret not configured", { status: 503 });
  }
  if (!authorised(request, env.BOARD_SECRET)) {
    // No detail: the difference between "missing" and "wrong" is free
    // information about how close a guess was.
    return new Response("unauthorised", { status: 401 });
  }

  const stored = await getFrame(env.FRAMES);
  if (stored === null) {
    return new Response("no frame composed yet", {
      status: 503,
      headers: { "retry-after": String(RETRY_SECONDS) },
    });
  }

  const stale = isStale(stored.composedAt, stored.model.date, now);
  // Redrawn rather than stamped, because the status corner packs its marks
  // together and where they sit depends on how many there are.
  const bytes = stale ? renderFrame(withStale(stored.model)).bytes : stored.bytes;

  return new Response(bytes, {
    headers: {
      "content-type": "application/octet-stream",
      "content-length": String(FRAME_BYTES),
      "cache-control": "no-store",
      // The Board has no clock, so this is not advice.
      "x-sleep-seconds": String(sleepSeconds(now)),
      // Diagnostics for a human with curl. The Board ignores both.
      "x-frame-date": stored.model.date,
      "x-frame-stale": stale ? "1" : "0",
    },
  });
}

function withStale(model: DayModel): DayModel {
  if (model.status.includes("stale")) return model;
  return { ...model, status: [...model.status, "stale"] };
}

function authorised(request: Request, secret: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const prefix = "Bearer ";
  if (!header.startsWith(prefix)) return false;
  return constantTimeEquals(header.slice(prefix.length), secret);
}

/**
 * Compared byte by byte to the end, so that how long the answer takes says
 * nothing about how much of the guess was right.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  let difference = left.length ^ right.length;
  for (let i = 0; i < left.length; i++) {
    difference |= left[i]! ^ (right[i % right.length] ?? 0);
  }
  return difference === 0;
}

/**
 * Compose today's Frame and store it.
 *
 * A render that throws leaves the previous Frame alone. Per ADR 0001 the Board
 * cannot draw anything itself, so a bad write means a wall showing garbage until
 * the next window — where doing nothing means it shows yesterday, which is at
 * least a day that happened, and which the stale mark will admit to.
 */
export async function refreshStoredFrame(env: BoardEnv, now: Date): Promise<void> {
  const date = localDate(now);
  const model = await composeDay(date, env);
  const frame = renderFrame(model);
  await putFrame(env.FRAMES, { bytes: frame.bytes, model, composedAt: now });
}

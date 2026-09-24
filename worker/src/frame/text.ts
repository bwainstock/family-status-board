/**
 * Drawing text into a Frame.
 *
 * Text is blitted from pre-baked bitmaps a character at a time, using bearings
 * baked in by the asset tool. Nothing here measures a font or shapes a string:
 * the Worker has 10 ms of CPU and the panel has no grey to anti-alias into.
 *
 * Advances are whole pixels, which means `measureText` and `drawText` agree
 * exactly. That is what lets an over-long Caption fail a test rather than
 * silently overflow its cell.
 *
 * A character the font was not built with is dropped rather than substituted.
 * A missing character is a mistake in a checked-in table and should show up as
 * a visibly wrong Caption in a golden, not as a confident tofu box.
 */

import type { Framebuffer } from "../framebuffer.js";
import { font, type FontRole } from "../assets/index.js";
import type { Rect } from "./layout.js";

export interface TextMetrics {
  /** Sum of whole-pixel advances. Conservative: at least as wide as the ink. */
  readonly width: number;
  /** Ink extent relative to the pen position, which side bearings offset from. */
  readonly inkLeft: number;
  readonly inkRight: number;
  readonly inkWidth: number;
  /** Relative to the baseline; negative is above it. Zero-height for no ink. */
  readonly inkTop: number;
  readonly inkBottom: number;
  readonly inkHeight: number;
}

export function measureText(role: FontRole, text: string): TextMetrics {
  const face = font(role);
  let width = 0;
  let inkLeft = Number.POSITIVE_INFINITY;
  let inkRight = Number.NEGATIVE_INFINITY;
  let inkTop = Number.POSITIVE_INFINITY;
  let inkBottom = Number.NEGATIVE_INFINITY;

  for (const ch of text) {
    const glyph = face.char(ch);
    if (glyph === null) continue;
    if (glyph.bitmap.width > 0 && glyph.bitmap.height > 0) {
      inkLeft = Math.min(inkLeft, width + glyph.left);
      inkRight = Math.max(inkRight, width + glyph.left + glyph.bitmap.width);
      inkTop = Math.min(inkTop, glyph.top);
      inkBottom = Math.max(inkBottom, glyph.top + glyph.bitmap.height);
    }
    width += glyph.advance;
  }

  if (inkTop === Number.POSITIVE_INFINITY) {
    return { width, inkLeft: 0, inkRight: 0, inkWidth: 0, inkTop: 0, inkBottom: 0, inkHeight: 0 };
  }
  return {
    width,
    inkLeft,
    inkRight,
    inkWidth: inkRight - inkLeft,
    inkTop,
    inkBottom,
    inkHeight: inkBottom - inkTop,
  };
}

export type HorizontalAlign = "left" | "center" | "right";

export interface TextOptions {
  readonly role: FontRole;
  readonly align?: HorizontalAlign;
  /** `false` stamps the text in white, for text sitting on the filled top bar. */
  readonly ink?: boolean;
}

/**
 * Draw `text` positioned on its *ink* rather than on the font's em box and
 * advance widths.
 *
 * A single line of a known string looks centred when its ink is centred.
 * Em-box centring leaves a 32px date floating in a 40px bar because of
 * descender space that nothing in "September 24, 2026" uses, and advance-width
 * centring is thrown off by the side bearings of whichever letters happen to
 * start and end the string.
 */
export function drawTextIn(frame: Framebuffer, box: Rect, text: string, options: TextOptions): TextMetrics {
  const metrics = measureText(options.role, text);
  const baseline = Math.round(box.y + (box.height - metrics.inkHeight) / 2 - metrics.inkTop);

  let pen: number;
  switch (options.align ?? "left") {
    case "center":
      pen = Math.round(box.x + (box.width - metrics.inkWidth) / 2 - metrics.inkLeft);
      break;
    case "right":
      pen = Math.round(box.x + box.width - metrics.inkRight);
      break;
    default:
      pen = Math.round(box.x - metrics.inkLeft);
  }

  drawText(frame, text, pen, baseline, options);
  return metrics;
}

/** `x` is the pen position, `baseline` the baseline — not the top of the ink. */
export function drawText(
  frame: Framebuffer,
  text: string,
  x: number,
  baseline: number,
  options: TextOptions,
): void {
  const face = font(options.role);
  const ink = options.ink ?? true;
  let pen = x;

  for (const ch of text) {
    const glyph = face.char(ch);
    if (glyph === null) continue;
    if (glyph.bitmap.width > 0) {
      frame.blit(glyph.bitmap, pen + glyph.left, baseline + glyph.top, ink);
    }
    pen += glyph.advance;
  }
}

/**
 * Whether a string will stay inside a box. Used to keep Captions short by
 * construction: the checked-in Caption tables are asserted against this, so a
 * Caption that would overflow fails a test instead of bleeding into the next
 * fact on the Board.
 */
export function textFitsIn(box: Rect, text: string, role: FontRole): boolean {
  const metrics = measureText(role, text);
  return metrics.width <= box.width && metrics.inkHeight <= box.height;
}

/** Characters the given font was never built with. Empty means the string is drawable. */
export function unsupportedCharacters(role: FontRole, text: string): string[] {
  const face = font(role);
  return [...new Set(text)].filter((ch) => face.char(ch) === null);
}

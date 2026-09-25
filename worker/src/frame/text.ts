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
 * ## Two policies for a character the font was not built with
 *
 * Which one applies depends entirely on where the string came from, and the
 * two must not be blurred together.
 *
 * **Strict** — `measureText`, `drawText`, `drawTextIn` and
 * `unsupportedCharacters`, used exactly as before. A character these
 * functions cannot draw is dropped rather than substituted. This is correct
 * only for a string we wrote ourselves: every Caption table checked into this
 * repo is asserted against `unsupportedCharacters` in a test, so a missing
 * character there is a mistake in that table, and it must show up as a
 * visibly wrong Caption in a golden — not as a confident placeholder that
 * makes a broken table look intentional. Call these functions directly on a
 * Caption we authored.
 *
 * **Forgiving** — `foldForDrawing`, composed with the strict functions above
 * at the call site. A calendar title is not a string anyone here wrote or
 * golden-tested: it is arbitrary text two adults typed on their phones (see
 * issue #22), and there is no table for a missing character to be a bug in.
 * Dropping silently there is not a safeguard, it is data loss on the wall
 * that every test still shows as green. `foldForDrawing` folds the common
 * cases a phone keyboard actually produces — curly quotes, en/em dashes, a
 * non-breaking space, an accented Latin letter the font was not built with —
 * and turns anything left over into a visible placeholder, never nothing.
 * Pass its result, not the raw string, to the strict drawers:
 *
 *     drawTextIn(frame, box, foldForDrawing("caption", event.summary), { role: "caption" });
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

/**
 * Characters the given font was never built with. Empty means the string is
 * drawable. This is the strict policy's check: run it against a checked-in
 * Caption table, never against text a stranger typed — see the header
 * comment above for why the two must not share a code path.
 */
export function unsupportedCharacters(role: FontRole, text: string): string[] {
  const face = font(role);
  return [...new Set(text)].filter((ch) => face.char(ch) === null);
}

/**
 * What a character neither the font, `foldForDrawing`'s folds, nor its
 * invisible-character list can carry becomes.
 *
 * Deliberately **not** `"?"`. A question mark is already load-bearing
 * elsewhere on this Board: `day/model.ts` documents `null` as "drawn as a
 * question mark," and every cell that draws a value falls back to the
 * literal string `"?"` when its source failed to load (see the weather and
 * Entrée cells and the generic `PLACEHOLDER_CAPTIONS` fallback in
 * `render.ts`). Reusing it here would mean an ordinary undrawable character
 * inside an otherwise-fine calendar title — `50€`, say — renders
 * indistinguishably from "this cell's source failed," which is a different
 * and much more alarming fact. The two hazards this file's header comment
 * already keeps apart — a bug in a table we wrote, and an input we can't
 * fully render — must not collapse into a symbol the Board uses for a third
 * thing entirely.
 *
 * `\uFFFD` REPLACEMENT CHARACTER ("�") is the standard convention for
 * exactly this situation, and — checked against `NotoSans-Bold.ttf` — the
 * font already has it. It is baked into *every* `FontRole` in
 * `tools/build-assets.py`, `display` included, rather than assembled from a
 * fold: `foldForDrawing` promises "never nothing" for any role it is given,
 * and that promise is only as strong as the weakest role's ability to draw
 * this one character. `worker/test/text.test.ts` asserts this for every role
 * the asset table defines, so a future role that forgets it fails a test
 * instead of reopening this hole silently.
 */
export const PLACEHOLDER_CHARACTER = "\ufffd";

/**
 * Characters that are invisible by definition: a soft hyphen (an optional
 * break point some word processors insert mid-word), a zero-width space, and
 * the zero-width no-break space historically doubling as a UTF-8 byte-order
 * mark. Text copied from a web page carries these more often than it's
 * noticed.
 *
 * These fold to nothing, not to `PLACEHOLDER_CHARACTER` — dropping one of
 * these is not the "we don't know how to draw this" call the placeholder
 * exists for, it is "we know exactly what this is, and what it is is
 * nothing." Rendering a visible placeholder for an invisible character would
 * be the exact failure this whole file exists to end, aimed at a different
 * character.
 */
const FOLDS_TO_NOTHING = new Set<string>([
  "\u00ad", // soft hyphen
  "\u200b", // zero-width space
  "\ufeff", // zero-width no-break space / UTF-8 byte-order mark
]);

/**
 * Typographic substitutions a phone keyboard — or a paste from a web page —
 * produces automatically, which a caller of `foldForDrawing` should never
 * have to special-case. None of these are an accented letter with its
 * diacritic stripped — they are different characters standing in for an
 * ASCII one — so they need an explicit fold rather than the
 * Unicode-decomposition fallback below.
 *
 * The curly right single quotation mark is the one that matters most: iOS and
 * Android both substitute it for a typed straight apostrophe by default, which
 * makes it the single most likely non-ASCII character in a real calendar
 * title.
 *
 * The Unicode hyphen and non-breaking hyphen are in `NotoSans-Bold.ttf` and
 * would be indistinguishable from ASCII `-` if baked, so they are folded
 * rather than given their own near-duplicate glyphs. The minus sign is not in
 * the font at all. Prime and double prime turn up in durations and
 * measurements ("3'2\"") and read the same as an apostrophe and a straight
 * quote at this size, so they fold rather than earning a dedicated glyph too.
 */
const TYPOGRAPHIC_FOLDS: Readonly<Record<string, string>> = {
  "\u2018": "'", // ‘ left single quotation mark
  "\u2019": "'", // ’ right single quotation mark — the curly apostrophe a phone types
  "\u201a": "'", // ‚ single low-9 quotation mark
  "\u201c": '"', // “ left double quotation mark
  "\u201d": '"', // ” right double quotation mark
  "\u201e": '"', // „ double low-9 quotation mark
  "\u2032": "'", // ′ prime
  "\u2033": '"', // ″ double prime
  "\u2013": "-", // – en dash
  "\u2014": "-", // — em dash
  "\u2010": "-", // ‐ hyphen
  "\u2011": "-", // ‑ non-breaking hyphen
  "\u2212": "-", // − minus sign
  "\u00a0": " ", // non-breaking space
};

/** Combining marks a NFD-decomposed accented letter splits into around its base letter. */
const COMBINING_MARKS = /\p{Mn}/gu;

/**
 * Fold arbitrary text into a string every character of which `role`'s font
 * can draw — the forgiving policy described in this file's header comment.
 * Never call this on a Caption we authored; call it on text that came from
 * outside this repo, such as a calendar title, before handing the result to
 * `drawText` or `drawTextIn`.
 *
 * Each character is tried against these in order, and falls to
 * `PLACEHOLDER_CHARACTER` only once all of them have failed:
 *
 *  0. It is invisible by definition (`FOLDS_TO_NOTHING`) — dropped, on
 *     purpose, before anything else gets a chance to turn it into visible
 *     ink.
 *  1. The font already has it — used as-is. This is why widening the baked
 *     charset (`tools/build-assets.py`) still matters even though folding
 *     exists: a character drawn directly looks like itself, where a fold can
 *     only ever look like an approximation of itself.
 *  2. It is one of `TYPOGRAPHIC_FOLDS` — substituted for the ASCII character
 *     it stands in for.
 *  3. It is a Latin letter with a diacritic the font was not built with —
 *     Unicode-normalised to base-letter-plus-combining-marks (NFD) and
 *     stripped of the marks, provided the font can draw the bare letter that
 *     leaves behind. A letter with no diacritic to strip — a currency symbol,
 *     an emoji, a script this font was never given — has no decomposition
 *     and falls through to the placeholder rather than being guessed at.
 */
export function foldForDrawing(role: FontRole, text: string): string {
  const face = font(role);
  let out = "";

  for (const ch of text) {
    if (FOLDS_TO_NOTHING.has(ch)) continue;

    if (face.char(ch) !== null) {
      out += ch;
      continue;
    }

    const substituted = TYPOGRAPHIC_FOLDS[ch];
    if (substituted !== undefined && face.char(substituted) !== null) {
      out += substituted;
      continue;
    }

    const stripped = ch.normalize("NFD").replace(COMBINING_MARKS, "");
    if (stripped.length > 0 && stripped !== ch && [...stripped].every((base) => face.char(base) !== null)) {
      out += stripped;
      continue;
    }

    out += PLACEHOLDER_CHARACTER;
  }

  return out;
}

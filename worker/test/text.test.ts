import { describe, expect, it } from "vitest";
import { Framebuffer, HEIGHT, WIDTH } from "../src/framebuffer.js";
import { bitmap, font } from "../src/assets/index.js";
import { FONTS, type FontRole } from "../src/assets/generated.js";
import {
  drawText,
  drawTextIn,
  foldForDrawing,
  measureText,
  PLACEHOLDER_CHARACTER,
  textFitsIn,
  unsupportedCharacters,
} from "../src/frame/text.js";
import { CELLS, CELL_ORDER, DATE_BOX, STATUS_SLOTS, TOP_BAR, captionBox, type Rect } from "../src/frame/layout.js";
import { PLACEHOLDER_CAPTION_VALUES } from "../src/frame/render.js";

/** The tight box around everything drawn, or null if nothing was. */
function inkBounds(frame: Framebuffer, region: Rect, ink = true): Rect | null {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let y = region.y; y < region.y + region.height; y++) {
    for (let x = region.x; x < region.x + region.width; x++) {
      if (frame.getPixel(x, y) !== ink) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

describe("text", () => {
  describe("measuring", () => {
    it("is the sum of whole-pixel advances, so measuring and drawing agree", () => {
      const face = font("caption");
      const expected = [..."Pizza"].reduce((n, ch) => n + (face.char(ch)?.advance ?? 0), 0);
      expect(measureText("caption", "Pizza").width).toBe(expected);
    });

    it("grows with the string", () => {
      expect(measureText("caption", "Pizza").width).toBeLessThan(measureText("caption", "Pizza Pizza").width);
    });

    it("reports no ink for an empty string", () => {
      expect(measureText("caption", "")).toEqual({
        width: 0,
        inkLeft: 0,
        inkRight: 0,
        inkWidth: 0,
        inkTop: 0,
        inkBottom: 0,
        inkHeight: 0,
      });
    });

    it("gives a space an advance but no ink", () => {
      const space = measureText("caption", " ");
      expect(space.width).toBeGreaterThan(0);
      expect(space.inkHeight).toBe(0);
    });

    /** What actually gets drawn must match what was measured, or Captions lie. */
    it("predicts the drawn extent exactly", () => {
      const frame = new Framebuffer();
      const metrics = measureText("caption", "Chicken");
      drawText(frame, "Chicken", 100, 150, { role: "caption" });

      const bounds = inkBounds(frame, { x: 0, y: 0, width: WIDTH, height: HEIGHT })!;
      expect(bounds.x).toBe(100 + metrics.inkLeft);
      expect(bounds.x + bounds.width).toBe(100 + metrics.inkRight);
      expect(bounds.y).toBe(150 + metrics.inkTop);
      expect(bounds.y + bounds.height).toBe(150 + metrics.inkBottom);
    });

    it("never claims to be narrower than the ink it draws", () => {
      for (const sample of ["Chicken", "September 24, 2026", "Taco", "?", "88"]) {
        const metrics = measureText("caption", sample);
        expect(metrics.inkWidth, sample).toBeLessThanOrEqual(metrics.width);
      }
    });
  });

  describe("placement", () => {
    it("centres on the ink of the string, not on the font's em box", () => {
      const frame = new Framebuffer();
      const box: Rect = { x: 100, y: 100, width: 200, height: 60 };
      drawTextIn(frame, box, "September", { role: "caption", align: "center" });

      const bounds = inkBounds(frame, box)!;
      const leftGap = bounds.x - box.x;
      const rightGap = box.x + box.width - (bounds.x + bounds.width);
      const topGap = bounds.y - box.y;
      const bottomGap = box.y + box.height - (bounds.y + bounds.height);

      expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(1);
      expect(Math.abs(topGap - bottomGap)).toBeLessThanOrEqual(1);
    });

    it("aligns left and right against the box edges", () => {
      const box: Rect = { x: 100, y: 100, width: 200, height: 60 };

      const left = new Framebuffer();
      drawTextIn(left, box, "Taco", { role: "caption", align: "left" });
      expect(inkBounds(left, box)!.x).toBe(box.x);

      const right = new Framebuffer();
      drawTextIn(right, box, "Taco", { role: "caption", align: "right" });
      const bounds = inkBounds(right, box)!;
      expect(box.x + box.width - (bounds.x + bounds.width)).toBeLessThanOrEqual(1);
    });

    it("draws nothing outside the box it was given", () => {
      const frame = new Framebuffer();
      const box = captionBox(CELLS.entree);
      drawTextIn(frame, box, "Chicken Bowl", { role: "caption", align: "center" });
      const bounds = inkBounds(frame, { x: 0, y: 0, width: WIDTH, height: HEIGHT })!;
      expect(bounds.x).toBeGreaterThanOrEqual(box.x);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(box.x + box.width);
      expect(bounds.y).toBeGreaterThanOrEqual(box.y);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(box.y + box.height);
    });
  });

  describe("white on a filled bar", () => {
    it("stamps text in white without carrying a box around with it", () => {
      const frame = new Framebuffer();
      frame.fillRect(TOP_BAR.x, TOP_BAR.y, TOP_BAR.width, TOP_BAR.height, true);
      drawTextIn(frame, DATE_BOX, "September 24, 2026", { role: "date", ink: false });

      const holes = inkBounds(frame, DATE_BOX, false);
      expect(holes, "the date should punch white out of the bar").not.toBeNull();
      // The bar itself survives outside the date box.
      expect(frame.getPixel(TOP_BAR.width - 1, 0)).toBe(true);
    });

    it("stamps a Glyph in white onto the filled bar", () => {
      const frame = new Framebuffer();
      frame.fillRect(TOP_BAR.x, TOP_BAR.y, TOP_BAR.width, TOP_BAR.height, true);

      const slot = STATUS_SLOTS[0]!;
      frame.blit(bitmap("charge-reminder@32"), slot.x, slot.y, false);

      expect(inkBounds(frame, slot, false), "the Glyph should appear as white ink").not.toBeNull();
      // Corners of the slot are outside the battery outline and stay black.
      expect(frame.getPixel(slot.x, slot.y)).toBe(true);
    });
  });

  describe("fitting by construction", () => {
    /**
     * An over-long Caption must fail here rather than bleed into the next fact
     * on the Board. Every checked-in Caption table is asserted against this.
     */
    it("rejects a Caption too wide for its cell", () => {
      const box = captionBox(CELLS.entree);
      expect(textFitsIn(box, "Chicken", "caption")).toBe(true);
      expect(textFitsIn(box, "Chicken and Broccoli Alfredo Bake", "caption")).toBe(false);
    });

    it("accepts every placeholder Caption in every cell", () => {
      for (const name of CELL_ORDER) {
        const box = captionBox(CELLS[name]);
        for (const caption of PLACEHOLDER_CAPTION_VALUES) {
          expect(textFitsIn(box, caption, "caption"), `"${caption}" in ${name}`).toBe(true);
        }
      }
    });

    /** The longest date the Board can ever show must not reach the status corner. */
    it("fits the widest possible date in the bar, clear of the status corner", () => {
      const widest = "September 28, 2026";
      expect(textFitsIn(DATE_BOX, widest, "date")).toBe(true);
      expect(DATE_BOX.x + measureText("date", widest).width).toBeLessThan(STATUS_SLOTS[0]!.x);
    });
  });

  describe("characters the font was not built with", () => {
    /**
     * `\u0161` (š) is Latin but outside the accented set `tools/build-assets.py`
     * bakes in, and stays that way deliberately: the strict policy needs a
     * character that is genuinely undrawable to prove it still drops one.
     */
    it("names them, so a checked-in table can be asserted drawable", () => {
      expect(unsupportedCharacters("caption", "Pizza")).toEqual([]);
      expect(unsupportedCharacters("caption", "Piz\u0161a")).toEqual(["\u0161"]);
    });

    it("drops them rather than drawing a tofu box", () => {
      const frame = new Framebuffer();
      drawText(frame, "\u0161\u0161\u0161", 10, 100, { role: "caption" });
      expect(inkBounds(frame, { x: 0, y: 0, width: WIDTH, height: HEIGHT })).toBeNull();
    });

    it("can draw every character each role was built with", () => {
      for (const role of ["caption", "date", "value", "display"] as const) {
        const face = font(role);
        expect(face.char("0")).not.toBeNull();
        expect(face.size).toBeGreaterThan(0);
        expect(face.lineHeight).toBeGreaterThan(face.size / 2);
      }
    });

    /** Every month name has to be drawable at date size or the bar shows a gap. */
    it("can draw every month name at date size", () => {
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
      for (const month of months) {
        expect(unsupportedCharacters("date", `${month} 24, 2026`), month).toEqual([]);
      }
    });
  });

  describe("folding text nobody on this team wrote", () => {
    /**
     * Every row of the table in issue #22, verbatim: the Caption a calendar
     * app hands us on the left, what actually reaches the panel — via
     * `foldForDrawing` — on the right. Before this issue every row here
     * dropped a character silently; none of them do now.
     */
    it.each([
      ["Dr. Smith @ 3:30", "Dr. Smith @ 3:30"],
      ["Café", "Café"],
      ["Parent\u2013teacher", "Parent-teacher"], // en dash
      ["Mum\u2019s birthday", "Mum's birthday"], // curly apostrophe
      ["Pick up @ 50%", "Pick up @ 50%"],
    ])("folds %j to %j", (input, expected) => {
      expect(foldForDrawing("caption", input)).toBe(expected);
    });

    it("folds curly quotes, en/em dashes and a non-breaking space to their ASCII equivalents", () => {
      expect(foldForDrawing("caption", "\u2018quoted\u2019")).toBe("'quoted'");
      expect(foldForDrawing("caption", "\u201cquoted\u201d")).toBe('"quoted"');
      expect(foldForDrawing("caption", "en\u2013dash")).toBe("en-dash");
      expect(foldForDrawing("caption", "em\u2014dash")).toBe("em-dash");
      expect(foldForDrawing("caption", "a\u00a0b")).toBe("a b");
    });

    it("folds the Unicode hyphen, non-breaking hyphen and minus sign to ASCII '-'", () => {
      expect(foldForDrawing("caption", "co\u2010op")).toBe("co-op");
      expect(foldForDrawing("caption", "co\u2011op")).toBe("co-op");
      expect(foldForDrawing("caption", "\u22125")).toBe("-5");
    });

    it("folds prime and double prime to a straight apostrophe and a straight quote", () => {
      expect(foldForDrawing("caption", "3\u2032")).toBe("3'");
      expect(foldForDrawing("caption", "3\u2032 2\u2033")).toBe("3' 2\"");
    });

    it("folds a soft hyphen, a zero-width space and a byte-order mark to nothing, not to a placeholder", () => {
      expect(foldForDrawing("caption", "un\u00adbroken")).toBe("unbroken");
      expect(foldForDrawing("caption", "zero\u200bwidth")).toBe("zerowidth");
      expect(foldForDrawing("caption", "\ufeffleading")).toBe("leading");
    });

    it("draws a folded curly apostrophe identically to a typed straight one", () => {
      const curly = new Framebuffer();
      drawText(curly, foldForDrawing("caption", "Mum\u2019s"), 10, 100, { role: "caption" });

      const straight = new Framebuffer();
      drawText(straight, "Mum's", 10, 100, { role: "caption" });

      expect(curly.bytes).toEqual(straight.bytes);
    });

    it("leaves an already-drawable accented letter alone rather than needlessly folding it", () => {
      // "café" draws directly: é is in the widened caption charset, so there is
      // nothing to fold, and folding it anyway would throw away information
      // the font is perfectly capable of keeping.
      expect(foldForDrawing("caption", "café")).toBe("café");
      expect(unsupportedCharacters("caption", "café")).toEqual([]);
    });

    it("bakes an ellipsis and letters with no diacritic to strip, rather than folding or placeholdering them", () => {
      // æ, ß, ø, Þ and ð are ligatures or stroked letters, not a base letter
      // plus an accent — `foldForDrawing`'s decomposition step has nothing to
      // grab onto for any of them — so they are baked directly instead. "…"
      // is the exact character a calendar app supplies when it has already
      // truncated a title, and is baked so it draws as itself.
      for (const ch of ["æ", "ß", "ø", "Þ", "ð", "\u2026"]) {
        expect(unsupportedCharacters("caption", ch), ch).toEqual([]);
        expect(foldForDrawing("caption", ch), ch).toBe(ch);
      }
    });

    it("decomposes an accented letter the font was not built with to its unaccented base", () => {
      // š (s-caron) is deliberately outside the baked charset — see the note
      // above — so it exercises the Unicode-decomposition fallback rather
      // than the "already in the font" fast path.
      expect(unsupportedCharacters("caption", "Ku\u0161trica")).toEqual(["\u0161"]);
      expect(foldForDrawing("caption", "Ku\u0161trica")).toBe("Kustrica");
    });

    it("substitutes a visible placeholder for a character it can neither draw nor fold, never nothing", () => {
      // € has no accent to strip and no ASCII stand-in — the case
      // `foldForDrawing`'s two folds cannot reach.
      expect(foldForDrawing("caption", "50\u20ac")).toBe(`50${PLACEHOLDER_CHARACTER}`);

      const frame = new Framebuffer();
      drawText(frame, foldForDrawing("caption", "\u20ac"), 10, 100, { role: "caption" });
      expect(inkBounds(frame, { x: 0, y: 0, width: WIDTH, height: HEIGHT }), "a placeholder must draw ink").not.toBeNull();
    });

    /**
     * "?" is already spoken for: `render.ts` draws it for a cell whose source
     * failed to load. A placeholder that reused it would make an ordinary
     * undrawable character in an otherwise-fine title look like that same
     * failure, which is a claim about the wrong thing going wrong.
     */
    it("never uses '?' as the placeholder, because '?' already means a source failed to load on this Board", () => {
      expect(PLACEHOLDER_CHARACTER).not.toBe("?");
      expect(PLACEHOLDER_CHARACTER).toBe("\ufffd");
    });

    /**
     * `foldForDrawing`'s "never nothing" guarantee only holds if the
     * placeholder itself is drawable in whichever role it's asked to fall
     * back in — including a role, like `display`, that never widens its
     * authored vocabulary for arbitrary text. Iterating `FONTS`'s own keys
     * rather than a hand-written list of role names means a fifth `FontRole`
     * that forgets this glyph fails this test, instead of silently reopening
     * the hole `display` closed.
     */
    it("can draw the placeholder in every FontRole, not just the ones widened for arbitrary text", () => {
      for (const role of Object.keys(FONTS) as FontRole[]) {
        expect(font(role).char(PLACEHOLDER_CHARACTER), role).not.toBeNull();
      }
    });

    it("still lets a Caption we authored drop an unsupported character rather than folding it", () => {
      // The strict functions are untouched by any of the above: a table we
      // wrote gets the old, deliberately unforgiving behaviour, because a
      // character missing there is a bug to catch in a golden, not an input
      // to survive at runtime. Dropping š leaves exactly the width of
      // "Kutrica"; folding it to "Kustrica" is one character wider.
      expect(measureText("caption", "Ku\u0161trica").width).toBe(measureText("caption", "Kutrica").width);
      expect(measureText("caption", foldForDrawing("caption", "Ku\u0161trica")).width).toBe(
        measureText("caption", "Kustrica").width,
      );
    });
  });
});

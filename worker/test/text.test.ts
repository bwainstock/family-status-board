import { describe, expect, it } from "vitest";
import { Framebuffer } from "../src/framebuffer.js";
import { bitmap, font } from "../src/assets/index.js";
import { drawText, drawTextIn, measureText, textFitsIn, unsupportedCharacters } from "../src/frame/text.js";
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

      const bounds = inkBounds(frame, { x: 0, y: 0, width: 792, height: 272 })!;
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
      const bounds = inkBounds(frame, { x: 0, y: 0, width: 792, height: 272 })!;
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
    it("names them, so a checked-in table can be asserted drawable", () => {
      expect(unsupportedCharacters("caption", "Pizza")).toEqual([]);
      expect(unsupportedCharacters("caption", "Piz\u00e7a")).toEqual(["\u00e7"]);
    });

    it("drops them rather than drawing a tofu box", () => {
      const frame = new Framebuffer();
      drawText(frame, "\u00e7\u00e7\u00e7", 10, 100, { role: "caption" });
      expect(inkBounds(frame, { x: 0, y: 0, width: 792, height: 272 })).toBeNull();
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
});

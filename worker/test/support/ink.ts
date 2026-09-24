import type { Framebuffer } from "../../src/framebuffer.js";
import type { Rect } from "../../src/frame/layout.js";

/**
 * Set pixels in a region.
 *
 * The blunt instrument that catches what goldens cannot say out loud: that a
 * cell drew *something*, that the Non-School slab is still mostly black, that a
 * badge did not weld itself to the Glyph underneath.
 */
export function countInk(frame: Framebuffer, region: Rect): number {
  let count = 0;
  for (let y = region.y; y < region.y + region.height; y++) {
    for (let x = region.x; x < region.x + region.width; x++) {
      if (frame.getPixel(x, y)) count++;
    }
  }
  return count;
}

import { describe, expect, it } from "vitest";

import {
  BYTES_PER_ROW,
  FRAME_BYTES,
  Framebuffer,
  HEIGHT,
  WIDTH,
  bitmapBytesPerRow,
  type Bitmap,
} from "../src/framebuffer.js";

/**
 * These assert the wire contract with the firmware, not merely that the class
 * works. If one of them fails, the Board draws garbage — so prefer changing the
 * caller over changing the expectation.
 */
describe("wire contract", () => {
  it("matches the panel geometry the firmware expects", () => {
    expect(WIDTH).toBe(800);
    expect(HEIGHT).toBe(480);
    expect(BYTES_PER_ROW).toBe(100);
    expect(FRAME_BYTES).toBe(48_000);
  });

  it("starts white, because a Frame is composed onto blank paper", () => {
    const fb = new Framebuffer();
    expect(fb.bytes).toHaveLength(FRAME_BYTES);
    expect(fb.bytes.every((b) => b === 0x00)).toBe(true);
  });

  it("packs the leftmost pixel of a row into the high bit", () => {
    const fb = new Framebuffer();
    fb.setPixel(0, 0, true);
    expect(fb.bytes[0]).toBe(0x80);
  });

  it("packs pixels left to right within a byte", () => {
    const fb = new Framebuffer();
    fb.setPixel(7, 0, true);
    expect(fb.bytes[0]).toBe(0x01);
  });

  it("lays rows out top to bottom, 100 bytes apart", () => {
    const fb = new Framebuffer();
    fb.setPixel(0, 1, true);
    expect(fb.bytes[0]).toBe(0x00);
    expect(fb.bytes[BYTES_PER_ROW]).toBe(0x80);
  });

  it("puts the last pixel of the panel in the final bit of the buffer", () => {
    const fb = new Framebuffer();
    fb.setPixel(WIDTH - 1, HEIGHT - 1, true);
    expect(fb.bytes[FRAME_BYTES - 1]).toBe(0x01);
  });

  it("has no dead column gap at the panel's centre, where the old seam used to be", () => {
    // The previous panel's raw controller path needed an 8px dead gap
    // straddling its centre column, where its two SSD1683 controllers met. The
    // GDEY075T7 is a single UC8179 with no seam anywhere, so there is no longer
    // a specific column this guards — but the buffer must still never reserve
    // a gap for one, so this stays as a general regression check at the same
    // landmark: these 8 pixels straddle a byte boundary with nothing skipped.
    const fb = new Framebuffer();
    const x = WIDTH / 2;
    fb.fillRect(x - 4, 0, 8, 1, true);
    expect(fb.bytes[x / 8 - 1]).toBe(0x0f);
    expect(fb.bytes[x / 8]).toBe(0xf0);
    expect(fb.getPixel(x - 5, 0)).toBe(false);
    expect(fb.getPixel(x + 4, 0)).toBe(false);
  });
});

describe("drawing", () => {
  it("clears to solid black and back to white", () => {
    const fb = new Framebuffer();
    fb.clear(true);
    expect(fb.bytes.every((b) => b === 0xff)).toBe(true);
    fb.clear();
    expect(fb.bytes.every((b) => b === 0x00)).toBe(true);
  });

  it("round-trips a pixel through getPixel", () => {
    const fb = new Framebuffer();
    fb.setPixel(123, 45, true);
    expect(fb.getPixel(123, 45)).toBe(true);
    expect(fb.getPixel(124, 45)).toBe(false);
    fb.setPixel(123, 45, false);
    expect(fb.getPixel(123, 45)).toBe(false);
  });

  it("fills a rect without touching its neighbours", () => {
    const fb = new Framebuffer();
    fb.fillRect(10, 10, 3, 2, true);
    expect(fb.getPixel(10, 10)).toBe(true);
    expect(fb.getPixel(12, 11)).toBe(true);
    expect(fb.getPixel(13, 11)).toBe(false);
    expect(fb.getPixel(12, 12)).toBe(false);
    expect(fb.getPixel(9, 10)).toBe(false);
  });

  it("strokes only the border", () => {
    const fb = new Framebuffer();
    fb.strokeRect(0, 0, 4, 3, true);
    expect(fb.getPixel(0, 0)).toBe(true);
    expect(fb.getPixel(3, 2)).toBe(true);
    expect(fb.getPixel(1, 1)).toBe(false);
  });

  it("clips rather than wrapping or throwing at the edges", () => {
    const fb = new Framebuffer();
    fb.setPixel(-1, 0, true);
    fb.setPixel(WIDTH, 0, true);
    fb.setPixel(0, HEIGHT, true);
    expect(fb.bytes.every((b) => b === 0x00)).toBe(true);
    // A pixel pushed off the right edge must not reappear on the next row.
    fb.fillRect(WIDTH - 2, 0, 8, 1, true);
    expect(fb.bytes[BYTES_PER_ROW]).toBe(0x00);
  });
});

describe("blit", () => {
  // A 3x2 checker: ink at (0,0), (2,0), (1,1).
  const checker: Bitmap = {
    width: 3,
    height: 2,
    data: new Uint8Array([0b1010_0000, 0b0100_0000]),
  };

  it("computes a padded stride for non-byte-aligned widths", () => {
    expect(bitmapBytesPerRow(3)).toBe(1);
    expect(bitmapBytesPerRow(8)).toBe(1);
    expect(bitmapBytesPerRow(9)).toBe(2);
  });

  it("draws ink where the bitmap has bits set", () => {
    const fb = new Framebuffer();
    fb.blit(checker, 5, 5);
    expect(fb.getPixel(5, 5)).toBe(true);
    expect(fb.getPixel(6, 5)).toBe(false);
    expect(fb.getPixel(7, 5)).toBe(true);
    expect(fb.getPixel(6, 6)).toBe(true);
  });

  it("leaves the background intact where the bitmap is clear", () => {
    const fb = new Framebuffer();
    fb.clear(true);
    fb.blit(checker, 5, 5);
    expect(fb.getPixel(6, 5)).toBe(true); // untouched black, not punched white
  });

  it("stamps in white so a glyph can sit on a filled bar", () => {
    const fb = new Framebuffer();
    fb.fillRect(0, 0, 20, 10, true);
    fb.blit(checker, 5, 5, false);
    expect(fb.getPixel(5, 5)).toBe(false);
    expect(fb.getPixel(6, 5)).toBe(true);
    expect(fb.getPixel(6, 6)).toBe(false);
  });

  it("clips at every edge", () => {
    const fb = new Framebuffer();
    fb.blit(checker, -1, -1);
    expect(fb.getPixel(0, 0)).toBe(true); // checker (1,1)
    fb.clear();
    fb.blit(checker, WIDTH - 1, HEIGHT - 1);
    expect(fb.getPixel(WIDTH - 1, HEIGHT - 1)).toBe(true);
    expect(fb.bytes[BYTES_PER_ROW - 1]).toBe(0x00); // nothing wrapped to row 0
  });
});

describe("inverted", () => {
  it("flips polarity without disturbing the original", () => {
    const fb = new Framebuffer();
    fb.setPixel(0, 0, true);
    const inv = fb.inverted();
    expect(inv.bytes[0]).toBe(0x7f);
    expect(inv.bytes[1]).toBe(0xff);
    expect(fb.bytes[0]).toBe(0x80);
  });
});

/**
 * The 1-bit framebuffer that every Frame is composed into.
 *
 * The byte layout here is a contract with the firmware, not an implementation
 * detail — see docs/adr/0002-hand-rolled-1bit-framebuffer.md. Changing it means
 * reflashing the Board.
 *
 *   row-major, top-left origin, MSB first, 1bpp, a set bit is black
 *   99 bytes per row x 272 rows = 26,928 bytes
 *
 * Trap worth knowing about: the panel is driven by two SSD1683 controllers with
 * 400 RAM columns each, but only 396 of each are wired. Talking to the
 * controllers directly needs a 100-byte row with a dead 8-pixel gap at columns
 * 396-403. This buffer is the *logical* 792-wide image with no gap; the firmware
 * hands it to GxEPD2's writeImage(), which owns that quirk. Do not bake the gap
 * in here.
 */

export const WIDTH = 792;
export const HEIGHT = 272;
export const BYTES_PER_ROW = WIDTH / 8; // 99
export const FRAME_BYTES = BYTES_PER_ROW * HEIGHT; // 26,928

/** A pre-baked 1-bit image, packed exactly like the framebuffer's rows. */
export interface Bitmap {
  readonly width: number;
  readonly height: number;
  /** ceil(width / 8) * height bytes, MSB first, a set bit is ink. */
  readonly data: Uint8Array;
}

export function bitmapBytesPerRow(width: number): number {
  return (width + 7) >> 3;
}

export class Framebuffer {
  readonly bytes: Uint8Array;

  constructor() {
    this.bytes = new Uint8Array(FRAME_BYTES);
  }

  /** Paint the whole panel. Defaults to white, which is how a Frame starts. */
  clear(black = false): void {
    this.bytes.fill(black ? 0xff : 0x00);
  }

  getPixel(x: number, y: number): boolean {
    if (!inBounds(x, y)) return false;
    const byte = this.bytes[y * BYTES_PER_ROW + (x >> 3)]!;
    return (byte & (0x80 >> (x & 7))) !== 0;
  }

  /** Out-of-bounds writes are dropped, so callers may draw off the edge freely. */
  setPixel(x: number, y: number, black: boolean): void {
    if (!inBounds(x, y)) return;
    const index = y * BYTES_PER_ROW + (x >> 3);
    const mask = 0x80 >> (x & 7);
    if (black) {
      this.bytes[index]! |= mask;
    } else {
      this.bytes[index]! &= ~mask;
    }
  }

  fillRect(x: number, y: number, width: number, height: number, black = true): void {
    const x1 = Math.min(x + width, WIDTH);
    const y1 = Math.min(y + height, HEIGHT);
    for (let py = Math.max(y, 0); py < y1; py++) {
      for (let px = Math.max(x, 0); px < x1; px++) {
        this.setPixel(px, py, black);
      }
    }
  }

  strokeRect(x: number, y: number, width: number, height: number, black = true): void {
    if (width <= 0 || height <= 0) return;
    this.fillRect(x, y, width, 1, black);
    this.fillRect(x, y + height - 1, width, 1, black);
    this.fillRect(x, y, 1, height, black);
    this.fillRect(x + width - 1, y, 1, height, black);
  }

  /**
   * Stamp a bitmap, drawing only where it has ink. Cleared bits leave whatever
   * is underneath alone, so a glyph can sit on a filled bar without carrying a
   * white box around with it.
   *
   * `ink` is the colour that a set bit paints — pass `false` to stamp a glyph in
   * white onto a black background.
   */
  blit(bitmap: Bitmap, x: number, y: number, ink = true): void {
    const stride = bitmapBytesPerRow(bitmap.width);
    for (let sy = 0; sy < bitmap.height; sy++) {
      const py = y + sy;
      if (py < 0 || py >= HEIGHT) continue;
      for (let sx = 0; sx < bitmap.width; sx++) {
        const byte = bitmap.data[sy * stride + (sx >> 3)];
        if (byte === undefined) continue;
        if ((byte & (0x80 >> (sx & 7))) === 0) continue;
        this.setPixel(x + sx, py, ink);
      }
    }
  }

  /**
   * Escape hatch for the one thing we cannot confirm without hardware: whether a
   * set bit really does come out black on this panel. If the first flash renders
   * a photographic negative, invert here rather than unpicking the bit maths.
   */
  inverted(): Framebuffer {
    const out = new Framebuffer();
    for (let i = 0; i < FRAME_BYTES; i++) out.bytes[i] = ~this.bytes[i]! & 0xff;
    return out;
  }
}

function inBounds(x: number, y: number): boolean {
  return x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;
}

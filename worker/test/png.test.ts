import { describe, expect, it } from "vitest";
import { decodePng1Bit, encodePng1Bit } from "../src/preview/png.js";
import { Framebuffer, WIDTH, HEIGHT, BYTES_PER_ROW } from "../src/framebuffer.js";

/**
 * Chunk types are found by matching raw bytes rather than by decoding the PNG
 * to text: the WHATWG "latin1" label is really windows-1252, which rewrites
 * bytes such as 0x82 and would make byte offsets lie.
 */
function indexOfAscii(bytes: Uint8Array, needle: string): number {
  const target = [...needle].map((c) => c.charCodeAt(0));
  outer: for (let at = 0; at + target.length <= bytes.length; at++) {
    for (let i = 0; i < target.length; i++) {
      if (bytes[at + i] !== target[i]) continue outer;
    }
    return at;
  }
  return -1;
}

/**
 * The preview and the golden harness both go through this codec, so a polarity
 * or packing mistake here would quietly corrupt every layout review rather than
 * failing anything. These tests exist to make that impossible.
 */
describe("1-bit PNG codec", () => {
  it("emits a PNG signature and the chunks a decoder expects", () => {
    const png = encodePng1Bit(new Uint8Array(BYTES_PER_ROW * HEIGHT), WIDTH, HEIGHT);
    expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    expect(indexOfAscii(png, "IHDR")).toBe(12);
    expect(indexOfAscii(png, "IDAT")).toBeGreaterThan(12);
    // A trailing IEND: zero length, the type, and the constant CRC of an empty chunk.
    expect([...png.subarray(-12)]).toEqual([
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);
  });

  it("declares the dimensions it was handed", () => {
    const png = encodePng1Bit(new Uint8Array(BYTES_PER_ROW * HEIGHT), WIDTH, HEIGHT);
    const decoded = decodePng1Bit(png);
    expect(decoded.width).toBe(WIDTH);
    expect(decoded.height).toBe(HEIGHT);
  });

  /**
   * The trap: the framebuffer says a set bit is black, PNG greyscale says a
   * zero sample is black. Getting this backwards produces a photographic
   * negative and no error anywhere.
   */
  it("inverts polarity on the way out, so ink becomes a dark PNG sample", () => {
    const ink = Uint8Array.from([0b10000000, 0x00]);
    const png = encodePng1Bit(ink, 16, 1);
    const idatAt = indexOfAscii(png, "IDAT") + 4;
    // zlib header (2) + stored block header (5) + filter byte (1)
    expect(png[idatAt + 8]).toBe(0b01111111);
  });

  it("round-trips an arbitrary Frame without losing a pixel", () => {
    const frame = new Framebuffer();
    frame.fillRect(0, 0, WIDTH, 56);
    frame.strokeRect(100, 100, 90, 90, true);
    frame.setPixel(WIDTH - 1, HEIGHT - 1, true);
    frame.setPixel(0, HEIGHT - 1, true);

    const decoded = decodePng1Bit(encodePng1Bit(frame.bytes, WIDTH, HEIGHT));
    expect(decoded.ink).toEqual(frame.bytes);
  });

  it("round-trips an all-black Frame, which exercises every byte", () => {
    const frame = new Framebuffer();
    frame.clear(true);
    const decoded = decodePng1Bit(encodePng1Bit(frame.bytes, WIDTH, HEIGHT));
    expect(decoded.ink).toEqual(frame.bytes);
  });

  /**
   * Stored deflate blocks cap at 65535 bytes and a Frame's scanlines come to
   * 27,200, so today it fits in one block. This pins the multi-block path so
   * that a larger panel later does not silently produce a broken stream.
   */
  it("spans multiple stored deflate blocks when the image is large", () => {
    const width = 800;
    const height = 800; // 100 bytes/row + filter = 80,800 raw bytes
    const ink = new Uint8Array((width / 8) * height);
    for (let i = 0; i < ink.length; i++) ink[i] = i & 0xff;

    const decoded = decodePng1Bit(encodePng1Bit(ink, width, height));
    expect(decoded.ink).toEqual(ink);
  });

  it("refuses a buffer that is not the size its dimensions imply", () => {
    expect(() => encodePng1Bit(new Uint8Array(10), WIDTH, HEIGHT)).toThrow(/expected 26928 bytes/);
  });

  it("refuses to decode something that is not a PNG", () => {
    expect(() => decodePng1Bit(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]))).toThrow(/not a PNG/);
  });
});

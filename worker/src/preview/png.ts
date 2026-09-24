/**
 * A minimal 1-bit PNG codec, used for previewing a Frame and for the golden
 * images that layout work is reviewed through.
 *
 * This never touches the Board. The Frame that reaches the firmware is raw
 * packed bytes with no container at all (ADR 0002); PNG exists here purely so
 * that a human can look at a Frame in a browser or a diff.
 *
 * Deflate is emitted as *stored* blocks only. That costs about five bytes per
 * 65535 and saves pulling a compressor into a Worker with a 10 ms CPU budget.
 * The decoder understands exactly what the encoder emits and nothing more,
 * which is all the golden harness needs.
 */

const SIGNATURE = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_STORED_BLOCK = 0xffff;

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]!) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function adler32(bytes: Uint8Array): number {
  let a = 1;
  let b = 0;
  for (let i = 0; i < bytes.length; i++) {
    a = (a + bytes[i]!) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function be32(value: number): Uint8Array {
  return Uint8Array.from([(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);
}

function concat(parts: readonly Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const part of parts) {
    out.set(part, at);
    at += part.length;
  }
  return out;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = Uint8Array.from([...type].map((c) => c.charCodeAt(0)));
  const body = concat([typeBytes, data]);
  return concat([be32(data.length), body, be32(crc32(body))]);
}

function storedDeflate(raw: Uint8Array): Uint8Array {
  const parts: Uint8Array[] = [Uint8Array.from([0x78, 0x01])];
  if (raw.length === 0) {
    parts.push(Uint8Array.from([0x01, 0x00, 0x00, 0xff, 0xff]));
  }
  for (let at = 0; at < raw.length; at += MAX_STORED_BLOCK) {
    const len = Math.min(MAX_STORED_BLOCK, raw.length - at);
    const final = at + len >= raw.length ? 1 : 0;
    parts.push(Uint8Array.from([final, len & 0xff, (len >>> 8) & 0xff, ~len & 0xff, (~len >>> 8) & 0xff]));
    parts.push(raw.subarray(at, at + len));
  }
  parts.push(be32(adler32(raw)));
  return concat(parts);
}

function inflateStored(stream: Uint8Array): Uint8Array {
  if (stream.length < 2 || (stream[0]! & 0x0f) !== 8) throw new Error("not a zlib stream");
  const parts: Uint8Array[] = [];
  let at = 2;
  for (;;) {
    if (at + 5 > stream.length) throw new Error("truncated deflate stream");
    const header = stream[at]!;
    if ((header & 0x06) !== 0) throw new Error("only stored deflate blocks are supported");
    const len = stream[at + 1]! | (stream[at + 2]! << 8);
    at += 5;
    if (at + len > stream.length) throw new Error("truncated stored block");
    parts.push(stream.subarray(at, at + len));
    at += len;
    if ((header & 0x01) === 1) break;
  }
  return concat(parts);
}

export interface Png1Bit {
  readonly width: number;
  readonly height: number;
  /** Packed exactly like a Framebuffer row: MSB first, a set bit is black. */
  readonly ink: Uint8Array;
}

/**
 * `ink` is packed the way the framebuffer packs it — a set bit means black.
 * PNG greyscale runs the other way (0 is black), so every byte is inverted on
 * the way out. Getting this backwards yields a photographic negative and no
 * error anywhere, which is exactly the class of mistake ADR 0002 warns about.
 */
export function encodePng1Bit(ink: Uint8Array, width: number, height: number): Uint8Array {
  const bytesPerRow = (width + 7) >> 3;
  if (ink.length !== bytesPerRow * height) {
    throw new Error(`expected ${bytesPerRow * height} bytes for ${width}x${height}, got ${ink.length}`);
  }

  const raw = new Uint8Array((bytesPerRow + 1) * height);
  for (let y = 0; y < height; y++) {
    const dest = y * (bytesPerRow + 1);
    raw[dest] = 0; // filter type: none
    for (let b = 0; b < bytesPerRow; b++) {
      raw[dest + 1 + b] = ~ink[y * bytesPerRow + b]! & 0xff;
    }
  }

  const ihdr = concat([
    be32(width),
    be32(height),
    // bit depth 1, greyscale, deflate, no filter, no interlace
    Uint8Array.from([1, 0, 0, 0, 0]),
  ]);

  return concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", storedDeflate(raw)),
    chunk("IEND", new Uint8Array(0)),
  ]);
}

/** Understands only what encodePng1Bit emits. Enough for the golden harness. */
export function decodePng1Bit(png: Uint8Array): Png1Bit {
  for (let i = 0; i < SIGNATURE.length; i++) {
    if (png[i] !== SIGNATURE[i]) throw new Error("not a PNG");
  }

  let width = 0;
  let height = 0;
  const idat: Uint8Array[] = [];
  let at = SIGNATURE.length;

  while (at + 8 <= png.length) {
    const length = (png[at]! << 24) | (png[at + 1]! << 16) | (png[at + 2]! << 8) | png[at + 3]!;
    const type = String.fromCharCode(png[at + 4]!, png[at + 5]!, png[at + 6]!, png[at + 7]!);
    const body = png.subarray(at + 8, at + 8 + length);
    if (type === "IHDR") {
      width = (body[0]! << 24) | (body[1]! << 16) | (body[2]! << 8) | body[3]!;
      height = (body[4]! << 24) | (body[5]! << 16) | (body[6]! << 8) | body[7]!;
      if (body[8] !== 1 || body[9] !== 0) throw new Error("expected a 1-bit greyscale PNG");
      if (body[12] !== 0) throw new Error("interlaced PNGs are not supported");
    } else if (type === "IDAT") {
      idat.push(body);
    } else if (type === "IEND") {
      break;
    }
    at += 12 + length;
  }

  const bytesPerRow = (width + 7) >> 3;
  const raw = inflateStored(concat(idat));
  if (raw.length !== (bytesPerRow + 1) * height) throw new Error("unexpected scanline count");

  const ink = new Uint8Array(bytesPerRow * height);
  for (let y = 0; y < height; y++) {
    const src = y * (bytesPerRow + 1);
    if (raw[src] !== 0) throw new Error(`unsupported PNG filter ${raw[src]} on row ${y}`);
    for (let b = 0; b < bytesPerRow; b++) {
      ink[y * bytesPerRow + b] = ~raw[src + 1 + b]! & 0xff;
    }
  }

  return { width, height, ink };
}

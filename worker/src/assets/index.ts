/**
 * Access to the pre-baked assets.
 *
 * Everything here is committed bitmap data being unpacked — nothing is
 * rasterised, measured or laid out at request time. See ADR 0002 for why.
 *
 * Decoding is lazy and cached. A Frame draws a handful of Glyphs and a few
 * dozen characters, so unpacking the whole asset table on every isolate start
 * would be work done for nothing.
 */

import type { Bitmap } from "../framebuffer.js";
import { BITMAPS, FONTS, type BitmapName, type FontRole, type PackedGlyph } from "./generated.js";

export type { BitmapName, FontRole };

function decodeBase64(encoded: string): Uint8Array {
  const binary = atob(encoded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

const EMPTY: Bitmap = { width: 0, height: 0, data: new Uint8Array(0) };

const bitmapCache = new Map<string, Bitmap>();

function unpack(key: string, width: number, height: number, data: string): Bitmap {
  const cached = bitmapCache.get(key);
  if (cached !== undefined) return cached;
  const made: Bitmap = width === 0 || height === 0 ? EMPTY : { width, height, data: decodeBase64(data) };
  bitmapCache.set(key, made);
  return made;
}

/** A Glyph, at the size the layout asks for. `weather-rain` at 96px is `weather-rain@96`. */
export function bitmap(name: BitmapName): Bitmap {
  const packed = BITMAPS[name];
  return unpack(`b:${name}`, packed.w, packed.h, packed.data);
}

export function hasBitmap(name: string): name is BitmapName {
  return Object.prototype.hasOwnProperty.call(BITMAPS, name);
}

/** One drawable character: where its ink sits relative to the pen and baseline. */
export interface CharBitmap {
  readonly bitmap: Bitmap;
  readonly left: number;
  readonly top: number;
  readonly advance: number;
}

export interface Font {
  readonly role: FontRole;
  readonly size: number;
  readonly ascent: number;
  readonly lineHeight: number;
  char(ch: string): CharBitmap | null;
}

const fontCache = new Map<FontRole, Font>();

export function font(role: FontRole): Font {
  const cached = fontCache.get(role);
  if (cached !== undefined) return cached;

  const packed = FONTS[role];
  const glyphs = packed.glyphs as Readonly<Record<string, PackedGlyph>>;

  const made: Font = {
    role,
    size: packed.size,
    ascent: packed.ascent,
    lineHeight: packed.lineHeight,
    char(ch: string): CharBitmap | null {
      const glyph = glyphs[ch];
      if (glyph === undefined) return null;
      return {
        bitmap: unpack(`f:${role}:${ch}`, glyph.w, glyph.h, glyph.data),
        left: glyph.left,
        top: glyph.top,
        advance: glyph.adv,
      };
    },
  };

  fontCache.set(role, made);
  return made;
}

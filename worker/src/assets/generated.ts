/**
 * GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:
 *
 *     python3 tools/build-assets.py
 *
 * Bitmaps are base64 of packed 1-bit rows: MSB first, a set bit is ink, which
 * is exactly how the framebuffer packs a row. Font glyphs carry their bearings
 * so that text can be laid out from a baseline without measuring anything at
 * render time.
 *
 * Source: tools/assets/glyphs.py and tools/assets/fonts/NotoSans-Bold.ttf
 * (SIL Open Font License 1.1 — see tools/assets/fonts/OFL.txt).
 */

export interface PackedGlyph {
  /** Zero for a space, which is an advance and nothing else. */
  readonly w: number;
  readonly h: number;
  /** Offset from the pen position to the left edge of the ink. */
  readonly left: number;
  /** Offset from the baseline to the top of the ink. Negative is above. */
  readonly top: number;
  /** How far the pen moves after drawing, in whole pixels. */
  readonly adv: number;
  readonly data: string;
}

export interface PackedFont {
  readonly size: number;
  readonly ascent: number;
  readonly lineHeight: number;
  readonly glyphs: Readonly<Record<string, PackedGlyph>>;
}

export interface PackedBitmap {
  readonly w: number;
  readonly h: number;
  readonly data: string;
}

export const FONTS = {
  "caption": {
    "ascent": 22,
    "glyphs": {
      " ": {
        "adv": 5,
        "data": "",
        "h": 0,
        "left": 0,
        "top": 0,
        "w": 0
      },
      "!": {
        "adv": 6,
        "data": "8ODg4ODgYGBgAADg8OA=",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 4
      },
      "\"": {
        "adv": 9,
        "data": "7ubmZmY=",
        "h": 5,
        "left": 1,
        "top": -14,
        "w": 7
      },
      "#": {
        "adv": 13,
        "data": "BmAO4AzADMB/8H/wHMAZgP/w//AZgBmAMwAzAA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 12
      },
      "%": {
        "adv": 18,
        "data": "eDj8MPxwzGDM4Mze/b/9v3szBzMGMw4/DD8YHg==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 16
      },
      "&": {
        "adv": 15,
        "data": "HwB/gHOAc4B3gD8Afjj/OOf44/Dh4PPwf/g/PA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 14
      },
      "'": {
        "adv": 5,
        "data": "4ODgYGA=",
        "h": 5,
        "left": 1,
        "top": -14,
        "w": 3
      },
      "(": {
        "adv": 7,
        "data": "ODBwYODg4MDAwODg4GBwMDg=",
        "h": 17,
        "left": 1,
        "top": -14,
        "w": 5
      },
      ")": {
        "adv": 7,
        "data": "wGBwcDA4ODg4ODg4MDBwYMA=",
        "h": 17,
        "left": 1,
        "top": -14,
        "w": 5
      },
      "*": {
        "adv": 11,
        "data": "HAAcABgA64D/gBwANgB3ACIA",
        "h": 9,
        "left": 1,
        "top": -15,
        "w": 9
      },
      "+": {
        "adv": 11,
        "data": "DAAMAAwADAD/wP/ADAAMAAwADAA=",
        "h": 10,
        "left": 1,
        "top": -12,
        "w": 10
      },
      ",": {
        "adv": 6,
        "data": "YODgwMA=",
        "h": 5,
        "left": 1,
        "top": -2,
        "w": 3
      },
      "-": {
        "adv": 6,
        "data": "+Pg=",
        "h": 2,
        "left": 1,
        "top": -7,
        "w": 5
      },
      ".": {
        "adv": 6,
        "data": "4PDg",
        "h": 3,
        "left": 1,
        "top": -3,
        "w": 4
      },
      "/": {
        "adv": 8,
        "data": "BwcGDgwcHBg4OHBwYOA=",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 8
      },
      "0": {
        "adv": 11,
        "data": "PgB/APeA44DhgOHA4cDhwOHA4cDjgHeAfwA+AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "1": {
        "adv": 11,
        "data": "Dh4+/m4ODg4ODg4ODg4=",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 7
      },
      "2": {
        "adv": 11,
        "data": "PgD/gPeAQ4ADgAOAB4APAB4APAB4APAA/8D/wA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "3": {
        "adv": 11,
        "data": "fgD/gGeAA4ADgAcAPgA/gAOAA8ADwMeA/4D+AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "4": {
        "adv": 11,
        "data": "A4ADgAeADYAfgBuAM4BzgGOA/+D/4AOAA4ADgA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 11
      },
      "5": {
        "adv": 11,
        "data": "f4B/gGAAYADgAP8A/4ADgAOAA8ADgOeA/wB+AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "6": {
        "adv": 11,
        "data": "D4A/gHyAYADgAP8A/4DjwOHA4cDhwPOAf4AeAA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "7": {
        "adv": 11,
        "data": "/8D/wAGAA4ADgAcABwAOAA4AHAAcADgAOAB4AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "8": {
        "adv": 11,
        "data": "PgB/gPeA44DjgH8APgB/AOOA4cDhwPPA/4A+AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      "9": {
        "adv": 11,
        "data": "PgB/APeA44DhwOHA98D/wD3AA4ADgI8AfgB8AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 10
      },
      ":": {
        "adv": 6,
        "data": "4PDgAAAAAADg8OA=",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 4
      },
      ";": {
        "adv": 6,
        "data": "4PDgAAAAAABg4ODAwA==",
        "h": 13,
        "left": 1,
        "top": -11,
        "w": 4
      },
      "=": {
        "adv": 11,
        "data": "/8D/wAAAAAD/wP/A",
        "h": 6,
        "left": 1,
        "top": -10,
        "w": 10
      },
      "?": {
        "adv": 10,
        "data": "PgD/AGeAA4ADgAcADgAcABgAAAAAABgAPAAYAA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 9
      },
      "@": {
        "adv": 18,
        "data": "B/Af+Dgcc/Zn9+4zzDPMc8xzzHbv/mOceAg/+A/w",
        "h": 15,
        "left": 1,
        "top": -14,
        "w": 16
      },
      "A": {
        "adv": 14,
        "data": "B4AHgA/AD8AcwBzgHOA4YD/wP/B/+HA4cDjgPA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 14
      },
      "B": {
        "adv": 13,
        "data": "/wD/gOPA4cDhwOPA/wD/gOHA4cDhwOPA/4D/AA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 10
      },
      "C": {
        "adv": 13,
        "data": "D8A/4HzAcADwAOAA4ADgAOAA8ABwAHzgP+APwA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 11
      },
      "D": {
        "adv": 15,
        "data": "/gD/gOPA4eDg4ODw4PDg8ODw4ODh4OfA/4D+AA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 12
      },
      "E": {
        "adv": 11,
        "data": "///g4ODg///g4ODg//8=",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 8
      },
      "F": {
        "adv": 11,
        "data": "///g4ODg///g4ODg4OA=",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 8
      },
      "G": {
        "adv": 14,
        "data": "D+Af8D5geABwAOAA4/Dj8OBw8HBwcHzwP/AP4A==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 12
      },
      "H": {
        "adv": 15,
        "data": "4PDg8ODw4PDg8ODw//D/8ODw4PDg8ODw4PDg8A==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 12
      },
      "I": {
        "adv": 8,
        "data": "/Px4cHBwcHBwcHBw/Pw=",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 6
      },
      "J": {
        "adv": 7,
        "data": "HBwcHBwcHBwcHBwcHBwcPPjw",
        "h": 18,
        "left": -2,
        "top": -14,
        "w": 6
      },
      "K": {
        "adv": 13,
        "data": "4eDhwOOA5wDvAO4A/AD+AP8A5wDjgOPA4cDg4A==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 11
      },
      "L": {
        "adv": 11,
        "data": "4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA/4D/gA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 9
      },
      "M": {
        "adv": 19,
        "data": "8B7wPvg+2D7YftxuzG7s7u7O7s7nzueO547jjg==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 15
      },
      "N": {
        "adv": 16,
        "data": "8DD4MPgw/DDcMM4wzjDnMOew47Dh8OHw4PDg8A==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 12
      },
      "O": {
        "adv": 16,
        "data": "D8A/8Hz4cDjwOOA84BzgHOA88DhwOHz4P/APwA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 14
      },
      "P": {
        "adv": 13,
        "data": "/gD/gOeA48DhwOPA54D/gP4A4ADgAOAA4ADgAA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 10
      },
      "Q": {
        "adv": 16,
        "data": "D8A/8Hz4cDjwOOA84BzgHOA88DhwOHz4P/APwADgAPAAfA==",
        "h": 17,
        "left": 1,
        "top": -14,
        "w": 14
      },
      "R": {
        "adv": 13,
        "data": "/gD/gOeA48DhwOOA/4D+AOcA5wDjgOPA4cDg4A==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 11
      },
      "S": {
        "adv": 11,
        "data": "PwB/gPOA4ADgAPgAfgAfAAeAA4CDgOeA/wB+AA==",
        "h": 14,
        "left": 1,
        "top": -14,
        "w": 9
      },
      "T": {
        "adv": 12,
        "data": "/+D/4A4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOAA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 11
      },
      "U": {
        "adv": 15,
        "data": "4ODg4ODg4ODg4ODg4ODg4ODg4ODg4P/gf8AfAA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 11
      },
      "V": {
        "adv": 13,
        "data": "4DhwcHBwcHA44DjgOOAYwB3AHcANgA+AD4AHAA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 13
      },
      "W": {
        "adv": 19,
        "data": "4ODg4ODgcPDgcfDAcbHAcbnAObnAO5mAO5uAOx+AGx+AHw8AHg8ADg8A",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 19
      },
      "X": {
        "adv": 13,
        "data": "8Hh4cDjgHOAdwA+AB4APgA/AHcA44DjwcHDwOA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 13
      },
      "Y": {
        "adv": 12,
        "data": "8HBw8HjgOeA9wB+AD4APAAcABwAHAAcABwAHAA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 12
      },
      "Z": {
        "adv": 12,
        "data": "f+B/4AHAAcADgAcADwAOABwAPAA4AHAA/+D/4A==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 11
      },
      "[": {
        "adv": 7,
        "data": "+Pjg4ODg4ODg4ODg4ODg4Pj4",
        "h": 18,
        "left": 1,
        "top": -14,
        "w": 5
      },
      "]": {
        "adv": 7,
        "data": "+PgYGBgYGBgYGBgYGBgYGPj4",
        "h": 18,
        "left": 0,
        "top": -14,
        "w": 5
      },
      "_": {
        "adv": 8,
        "data": "/w==",
        "h": 1,
        "left": -1,
        "top": 2,
        "w": 8
      },
      "a": {
        "adv": 12,
        "data": "PwB/gDOAAcA/wP/A4cDjwPfA/8B5wA==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 10
      },
      "b": {
        "adv": 13,
        "data": "4ADgAOAA4ADvAN+A94DjwOHA4cDhwOPA94D/gN8A",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 10
      },
      "c": {
        "adv": 10,
        "data": "H4B/AHMA4ADgAOAA4ADgAPMAfwA/AA==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 9
      },
      "d": {
        "adv": 13,
        "data": "AcABwAHAAcA9wH/A88DhwOHA4cDhwOHA88B/wDzA",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "e": {
        "adv": 12,
        "data": "HwB/gHOA4cD/wP/A4ADgAHmAf4AfgA==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 10
      },
      "f": {
        "adv": 8,
        "data": "H4A/AD0AOAB/AP8AOAA4ADgAOAA4ADgAOAA4ADgA",
        "h": 15,
        "left": 0,
        "top": -15,
        "w": 9
      },
      "g": {
        "adv": 13,
        "data": "PMB/wPPA4cDhwOHA4cDhwPPAf8A9wAHAAcBjwH+AfwA=",
        "h": 16,
        "left": 1,
        "top": -11,
        "w": 10
      },
      "h": {
        "adv": 13,
        "data": "4ADgAOAA4ADPAN+A84DjwOHA4cDhwOHA4cDhwOHA",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 10
      },
      "i": {
        "adv": 6,
        "data": "YPAAAHBwcHBwcHBwcHBw",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 4
      },
      "j": {
        "adv": 6,
        "data": "GDwAABwcHBwcHBwcHBwcHBy4+PA=",
        "h": 20,
        "left": -2,
        "top": -15,
        "w": 6
      },
      "k": {
        "adv": 12,
        "data": "4ADgAOAA4ADjwOeA5wDuANwA/AD+AO8A54DjgOHA",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 10
      },
      "l": {
        "adv": 6,
        "data": "4ODg4ODg4ODg4ODg4ODg",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 3
      },
      "m": {
        "adv": 20,
        "data": "zx7f//fv48fjh+OH44fjh+OH44fjhw==",
        "h": 11,
        "left": 2,
        "top": -11,
        "w": 16
      },
      "n": {
        "adv": 13,
        "data": "zwD/gPOA48DhwOHA4cDhwOHA4cDhwA==",
        "h": 11,
        "left": 2,
        "top": -11,
        "w": 10
      },
      "o": {
        "adv": 12,
        "data": "HwB/gHPA4cDhwOHA4cDhwHPAf4AfAA==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 10
      },
      "p": {
        "adv": 13,
        "data": "zwDfgPeA48DhwOHA4cDjwPeA/4DvAOAA4ADgAOAA4AA=",
        "h": 16,
        "left": 2,
        "top": -11,
        "w": 10
      },
      "q": {
        "adv": 13,
        "data": "PcB/wPPA4cDhwOHA4cDhwPPAf8A9wAHAAcABwAHAAcA=",
        "h": 16,
        "left": 1,
        "top": -11,
        "w": 10
      },
      "r": {
        "adv": 9,
        "data": "zt764ODg4ODg4OA=",
        "h": 11,
        "left": 2,
        "top": -11,
        "w": 7
      },
      "s": {
        "adv": 10,
        "data": "fv/m4Pg+DwfH//w=",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 8
      },
      "t": {
        "adv": 9,
        "data": "GBg4f/84ODg4ODg5Px8=",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 8
      },
      "u": {
        "adv": 13,
        "data": "4ODg4ODg4ODg4ODg4OBx4HHgf+A+4A==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 11
      },
      "v": {
        "adv": 11,
        "data": "4OBw4HHAccA5wDuAO4AfgB8ADwAOAA==",
        "h": 11,
        "left": 0,
        "top": -11,
        "w": 11
      },
      "w": {
        "adv": 17,
        "data": "4cOAceMAc2cAc2cAc2cAO3YAPz4APj4AHjwAHjwAHjwA",
        "h": 11,
        "left": 0,
        "top": -11,
        "w": 17
      },
      "x": {
        "adv": 12,
        "data": "8OB5wDvAH4AfAA8AHwA/gDnAccDw4A==",
        "h": 11,
        "left": 0,
        "top": -11,
        "w": 11
      },
      "y": {
        "adv": 11,
        "data": "4OBw4HHAccA5wDuAG4AfgB8ADwAPAA4ADgAcAHwAcAA=",
        "h": 16,
        "left": 0,
        "top": -11,
        "w": 11
      },
      "z": {
        "adv": 10,
        "data": "//8HDhw4OHDg//8=",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 8
      },
      "°": {
        "adv": 9,
        "data": "ePzuxu78eA==",
        "h": 7,
        "left": 1,
        "top": -15,
        "w": 7
      },
      "À": {
        "adv": 14,
        "data": "DwAHAAGAAAAHgAeAD8APwBzAHOAc4DhgP/A/8H/4cDhwOOA8",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 14
      },
      "Á": {
        "adv": 14,
        "data": "AOABwAOAAAAHgAeAD8APwBzAHOAc4DhgP/A/8H/4cDhwOOA8",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 14
      },
      "Â": {
        "adv": 14,
        "data": "B4APwBzgAAAHgAeAD8APwBzAHOAc4DhgP/A/8H/4cDhwOOA8",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 14
      },
      "Ã": {
        "adv": 14,
        "data": "D2Af4BvAAAAHgAeAD8APwBzAHOAc4DhgP/A/8H/4cDhwOOA8",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 14
      },
      "Ä": {
        "adv": 14,
        "data": "DMAMwAAAB4AHgA/AD8AcwBzgHOA4YD/wP/B/+HA4cDjgPA==",
        "h": 17,
        "left": 0,
        "top": -18,
        "w": 14
      },
      "Å": {
        "adv": 14,
        "data": "A4AEwATAB4AHgA/AD8AcwBzgHOA4YD/wP/B/+HA4cDjgPA==",
        "h": 17,
        "left": 0,
        "top": -17,
        "w": 14
      },
      "Æ": {
        "adv": 19,
        "data": "A//AA//AB3AAB3AADnAADnAAHH/AHH/AH/AAP/AAOHAAcHAAcH/A4H/A",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 18
      },
      "Ç": {
        "adv": 13,
        "data": "D8A/4HzAcADwAOAA4ADgAOAA8ABwAHzgP+APwAMABwABgAeABwA=",
        "h": 19,
        "left": 1,
        "top": -14,
        "w": 11
      },
      "È": {
        "adv": 11,
        "data": "eDgMAP//4ODg4P//4ODg4P//",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 8
      },
      "É": {
        "adv": 11,
        "data": "Bw4cAP//4ODg4P//4ODg4P//",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 8
      },
      "Ê": {
        "adv": 11,
        "data": "PH7nAP//4ODg4P//4ODg4P//",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 8
      },
      "Ë": {
        "adv": 11,
        "data": "ZmYA///g4ODg///g4ODg//8=",
        "h": 17,
        "left": 2,
        "top": -18,
        "w": 8
      },
      "Ì": {
        "adv": 8,
        "data": "8HAYAPz8eHBwcHBwcHBwcPz8",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 6
      },
      "Í": {
        "adv": 8,
        "data": "Dhw4APz8eHBwcHBwcHBwcPz8",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 7
      },
      "Î": {
        "adv": 8,
        "data": "PH7nAH5+PDg4ODg4ODg4OH5+",
        "h": 18,
        "left": -1,
        "top": -18,
        "w": 8
      },
      "Ï": {
        "adv": 8,
        "data": "zMwA/Px4cHBwcHBwcHBw/Pw=",
        "h": 17,
        "left": 1,
        "top": -18,
        "w": 6
      },
      "Ð": {
        "adv": 15,
        "data": "P4A/4DjwOHg4ODg8/jz+PDg8ODg4eDnwP+A/gA==",
        "h": 14,
        "left": 0,
        "top": -14,
        "w": 14
      },
      "Ñ": {
        "adv": 16,
        "data": "HsA/wDeAAADwMPgw+DD8MNwwzjDOMOcw57DjsOHw4fDg8ODw",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 12
      },
      "Ò": {
        "adv": 16,
        "data": "DwAHAAGAAAAPwD/wfPhwOPA44DzgHOAc4DzwOHA4fPg/8A/A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "Ó": {
        "adv": 16,
        "data": "AOABwAOAAAAPwD/wfPhwOPA44DzgHOAc4DzwOHA4fPg/8A/A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "Ô": {
        "adv": 16,
        "data": "B4APwBzgAAAPwD/wfPhwOPA44DzgHOAc4DzwOHA4fPg/8A/A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "Õ": {
        "adv": 16,
        "data": "D2Af4BvAAAAPwD/wfPhwOPA44DzgHOAc4DzwOHA4fPg/8A/A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "Ö": {
        "adv": 16,
        "data": "DMAMwAAAD8A/8Hz4cDjwOOA84BzgHOA88DhwOHz4P/APwA==",
        "h": 17,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "Ø": {
        "adv": 16,
        "data": "ABAP+D/wfPhw+PD44bzjnOMc5jz8OHw4fPg/8H/AIAA=",
        "h": 16,
        "left": 1,
        "top": -15,
        "w": 14
      },
      "Ù": {
        "adv": 15,
        "data": "HgAOAAMAAADg4ODg4ODg4ODg4ODg4ODg4ODg4ODg/+B/wB8A",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 11
      },
      "Ú": {
        "adv": 15,
        "data": "AcADgAcAAADg4ODg4ODg4ODg4ODg4ODg4ODg4ODg/+B/wB8A",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 11
      },
      "Û": {
        "adv": 15,
        "data": "DwAfgDnAAADg4ODg4ODg4ODg4ODg4ODg4ODg4ODg/+B/wB8A",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 11
      },
      "Ü": {
        "adv": 15,
        "data": "GYAZgAAA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4P/gf8AfAA==",
        "h": 17,
        "left": 2,
        "top": -18,
        "w": 11
      },
      "Ý": {
        "adv": 12,
        "data": "AcADgAcAAADwcHDweOA54D3AH4APgA8ABwAHAAcABwAHAAcA",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 12
      },
      "Þ": {
        "adv": 13,
        "data": "4ADgAP4A/4DngOPA4cDjwOeA/4D+AOAA4ADgAA==",
        "h": 14,
        "left": 2,
        "top": -14,
        "w": 10
      },
      "ß": {
        "adv": 14,
        "data": "PwB/wPPA4cDhwOOA5wDvAOeA4+Dg4ODw7ODv4O/A",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 12
      },
      "à": {
        "adv": 12,
        "data": "PAAcAAYAAAA/AH+AM4ABwD/A/8DhwOPA98D/wHnA",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "á": {
        "adv": 12,
        "data": "A4AHAA4AAAA/AH+AM4ABwD/A/8DhwOPA98D/wHnA",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "â": {
        "adv": 12,
        "data": "HgA/AHOAAAA/AH+AM4ABwD/A/8DhwOPA98D/wHnA",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ã": {
        "adv": 12,
        "data": "PYB/gG8AAAA/AH+AM4ABwD/A/8DhwOPA98D/wHnA",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ä": {
        "adv": 12,
        "data": "MwAzAAAAPwB/gDOAAcA/wP/A4cDjwPfA/8B5wA==",
        "h": 14,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "å": {
        "adv": 12,
        "data": "DgATABMAHgAAAD8Af4AzgAHAP8D/wOHA48D3wP/AecA=",
        "h": 16,
        "left": 1,
        "top": -16,
        "w": 10
      },
      "æ": {
        "adv": 18,
        "data": "Pnx//iPnA8M/////44DjwPfj/v98Pg==",
        "h": 11,
        "left": 1,
        "top": -11,
        "w": 16
      },
      "ç": {
        "adv": 10,
        "data": "H4B/AHMA4ADgAOAA4ADgAPMAfwA/AAwAHAAGAB4AHAA=",
        "h": 16,
        "left": 1,
        "top": -11,
        "w": 9
      },
      "è": {
        "adv": 12,
        "data": "PAAcAAYAAAAfAH+Ac4DhwP/A/8DgAOAAeYB/gB+A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "é": {
        "adv": 12,
        "data": "A4AHAA4AAAAfAH+Ac4DhwP/A/8DgAOAAeYB/gB+A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ê": {
        "adv": 12,
        "data": "HgA/AHOAAAAfAH+Ac4DhwP/A/8DgAOAAeYB/gB+A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ë": {
        "adv": 12,
        "data": "MwAzAAAAHwB/gHOA4cD/wP/A4ADgAHmAf4AfgA==",
        "h": 14,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ì": {
        "adv": 6,
        "data": "8HAYADg4ODg4ODg4ODg4",
        "h": 15,
        "left": -1,
        "top": -15,
        "w": 5
      },
      "í": {
        "adv": 6,
        "data": "OHDgAODg4ODg4ODg4ODg",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 5
      },
      "î": {
        "adv": 6,
        "data": "PH7nABwcHBwcHBwcHBwc",
        "h": 15,
        "left": -2,
        "top": -15,
        "w": 8
      },
      "ï": {
        "adv": 6,
        "data": "zMwAODg4ODg4ODg4ODg=",
        "h": 14,
        "left": -1,
        "top": -15,
        "w": 6
      },
      "ð": {
        "adv": 12,
        "data": "EIAZgD8AHwA7gBGAP8B/wPPA4cDhwOHA4cDzwH+AHwA=",
        "h": 16,
        "left": 1,
        "top": -16,
        "w": 10
      },
      "ñ": {
        "adv": 13,
        "data": "PYB/gG8AAADPAP+A84DjwOHA4cDhwOHA4cDhwOHA",
        "h": 15,
        "left": 2,
        "top": -15,
        "w": 10
      },
      "ò": {
        "adv": 12,
        "data": "PAAcAAYAAAAfAH+Ac8DhwOHA4cDhwOHAc8B/gB8A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ó": {
        "adv": 12,
        "data": "A4AHAA4AAAAfAH+Ac8DhwOHA4cDhwOHAc8B/gB8A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ô": {
        "adv": 12,
        "data": "HgA/AHOAAAAfAH+Ac8DhwOHA4cDhwOHAc8B/gB8A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "õ": {
        "adv": 12,
        "data": "PYB/gG8AAAAfAH+Ac8DhwOHA4cDhwOHAc8B/gB8A",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ö": {
        "adv": 12,
        "data": "MwAzAAAAHwB/gHPA4cDhwOHA4cDhwHPAf4AfAA==",
        "h": 14,
        "left": 1,
        "top": -15,
        "w": 10
      },
      "ø": {
        "adv": 12,
        "data": "H8B/gHPA48DnwO3A7cD5wHPAf4B/ACAA",
        "h": 12,
        "left": 1,
        "top": -12,
        "w": 10
      },
      "ù": {
        "adv": 13,
        "data": "HgAOAAMAAADg4ODg4ODg4ODg4ODg4HHgceB/4D7g",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 11
      },
      "ú": {
        "adv": 13,
        "data": "AcADgAcAAADg4ODg4ODg4ODg4ODg4HHgceB/4D7g",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 11
      },
      "û": {
        "adv": 13,
        "data": "DwAfgDnAAADg4ODg4ODg4ODg4ODg4HHgceB/4D7g",
        "h": 15,
        "left": 1,
        "top": -15,
        "w": 11
      },
      "ü": {
        "adv": 13,
        "data": "GYAZgAAA4ODg4ODg4ODg4ODg4OBx4HHgf+A+4A==",
        "h": 14,
        "left": 1,
        "top": -15,
        "w": 11
      },
      "ý": {
        "adv": 11,
        "data": "AcADgAcAAADg4HDgccBxwDnAO4AbgB+AHwAPAA8ADgAOABwAfABwAA==",
        "h": 20,
        "left": 0,
        "top": -15,
        "w": 11
      },
      "þ": {
        "adv": 13,
        "data": "4ADgAOAA4ADvAN+A94DjwOHA4cDhwOPA94D/gO8A4ADgAOAA4ADgAA==",
        "h": 20,
        "left": 2,
        "top": -15,
        "w": 10
      },
      "ÿ": {
        "adv": 11,
        "data": "GYAZgAAA4OBw4HHAccA5wDuAG4AfgB8ADwAPAA4ADgAcAHwAcAA=",
        "h": 19,
        "left": 0,
        "top": -15,
        "w": 11
      },
      "…": {
        "adv": 17,
        "data": "45zz3uOc",
        "h": 3,
        "left": 1,
        "top": -3,
        "w": 15
      },
      "�": {
        "adv": 20,
        "data": "AIAAAMAAAeAAA/AABhgADAwAHM4AP88Af8+A/x/Afz+APz8AH/4ADzwABjgAA3AAAeAAAMAA",
        "h": 18,
        "left": 1,
        "top": -16,
        "w": 18
      }
    },
    "lineHeight": 28,
    "size": 20
  },
  "date": {
    "ascent": 35,
    "glyphs": {
      " ": {
        "adv": 8,
        "data": "",
        "h": 0,
        "left": 0,
        "top": 0,
        "w": 0
      },
      "!": {
        "adv": 9,
        "data": "+Pj4+Pj4+Pj4+Ph4eHh4AAAAcPj4+HA=",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 5
      },
      "\"": {
        "adv": 15,
        "data": "8eDx4PHg8eDx4HHgceBxwA==",
        "h": 8,
        "left": 2,
        "top": -23,
        "w": 11
      },
      "#": {
        "adv": 21,
        "data": "A8cAA8cAA4cAA48AA48AB44Af//gf//gf//gf//gBx4ADxwADxwA///A///A///AHjgAHjgAHHgAHHgAHHgAPHAAPHAA",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 19
      },
      "%": {
        "adv": 29,
        "data": "HwA8AD+AeAB/wPAA/8DwAPPh4ADx4eAA8ePAAPHjgADx558A8ec/gPvPf8B/3n/AP5774B888eAAPPHgAHjx4AB48eAA8PHgAODx4AHge8ABwH/AA8A/gAeAHwA=",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 27
      },
      "&": {
        "adv": 24,
        "data": "A/AAD/wAH/4AH/4APj4APh4APh4AHj4AH3wAD/gAD/AAH+B8P/B8fvj4fHz4+D/w+B/w/A/g/g/gf//wP//4H/78B/B+",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 23
      },
      "'": {
        "adv": 9,
        "data": "8PDw8PBwcHA=",
        "h": 8,
        "left": 2,
        "top": -23,
        "w": 4
      },
      "(": {
        "adv": 11,
        "data": "B4APAB4AHgA8ADwAfAB4AHgAeAB4APgA8ADwAPAA8AD4APgAeAB4AHgAfAA8ADwAHgAeAA8AB4A=",
        "h": 28,
        "left": 1,
        "top": -23,
        "w": 9
      },
      ")": {
        "adv": 11,
        "data": "8AB4AHwAPAA+AB4AHgAfAA8ADwAPAA8AD4APgA+AD4APAA8ADwAPAA8AHgAeAB4APAA8AHgA8AA=",
        "h": 28,
        "left": 1,
        "top": -23,
        "w": 9
      },
      "*": {
        "adv": 17,
        "data": "A8ADwAOAA4BDgvu+//7//gfgB+AP8B7wPng8fAwg",
        "h": 15,
        "left": 1,
        "top": -25,
        "w": 15
      },
      "+": {
        "adv": 18,
        "data": "A8ADwAPAA8ADwAPA//////////8DwAPAA8ADwAPAA8A=",
        "h": 16,
        "left": 1,
        "top": -20,
        "w": 16
      },
      ",": {
        "adv": 9,
        "data": "fHx8eHhw8PA=",
        "h": 8,
        "left": 1,
        "top": -4,
        "w": 6
      },
      "-": {
        "adv": 10,
        "data": "/////w==",
        "h": 4,
        "left": 1,
        "top": -11,
        "w": 8
      },
      ".": {
        "adv": 9,
        "data": "cPj4+HA=",
        "h": 5,
        "left": 2,
        "top": -5,
        "w": 5
      },
      "/": {
        "adv": 13,
        "data": "AHgA+ADwAfAB4AHgA+ADwAPAB8AHgA+ADwAPAB8AHgAeAD4APAB8AHgAeAD4AA==",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 13
      },
      "0": {
        "adv": 18,
        "data": "B+Af+D/8P/x8Pnw+eB/4H/gf+B/4H/gf+B/4H/gf+B94H3w+fD4//j/8H/gH4A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "1": {
        "adv": 18,
        "data": "AeAH4A/gH+A/4H3g++Bz4CPgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4A==",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 11
      },
      "2": {
        "adv": 18,
        "data": "B+A/+H/8//58PjAfAB8AHwA+AD4AfAD8AfgD8APgB8APgB8APgB//////////w==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "3": {
        "adv": 18,
        "data": "D+B/+P/+f/4wPgA+AB4APgB8D/gP4A/4D/4APgAfAB8AHwAfwD///v/8//g/4A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "4": {
        "adv": 18,
        "data": "AHwAAHwAAPwAAfwAA/wAA/wAB/wAD3wAD3wAHnwAPHwAPHwAeHwA8HwA//+A//+A//+A//+AAHwAAHwAAHwAAHwAAHwA",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 17
      },
      "5": {
        "adv": 18,
        "data": "f/h/+H/4f/h4APgA+AD4AP/g//D/+P/8APwAfgA+AD4APgB8wPz//P/4//B/gA==",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 15
      },
      "6": {
        "adv": 18,
        "data": "Af4H/g/+H/4/AD4AfAB4AHn4+/z//v///D/4H/gf+A/4H3wffj8//j/+D/gH8A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "7": {
        "adv": 18,
        "data": "//////////8AHwA+AD4AfAB8AHgA+AD4AfAB8APgA+AHwAfAB8APgA+AHwAfAA==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "8": {
        "adv": 18,
        "data": "B+Af+D/+f/58PngeeB58Pj5+P/wP8A/wP/x+fnw/+B/4D/gf/B9//3/+P/wP8A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      "9": {
        "adv": 18,
        "data": "B+Af+D/8f/58Pvgf+B/4H/gf+B/8P3//f+8/zw+fAB4AHgA+APw/+D/4P+A/gA==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 16
      },
      ":": {
        "adv": 9,
        "data": "cPj4+HAAAAAAAAAAAHD4+Phw",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 5
      },
      ";": {
        "adv": 9,
        "data": "OHx8fDgAAAAAAAAAAAB8fHx4eHDw8A==",
        "h": 22,
        "left": 1,
        "top": -18,
        "w": 6
      },
      "=": {
        "adv": 18,
        "data": "//////////8AAAAA//////////8=",
        "h": 10,
        "left": 1,
        "top": -17,
        "w": 16
      },
      "?": {
        "adv": 15,
        "data": "D+B/+P/8f/xwfEA+ADwAfAD8AfgD8AfgB4APgA8AAAAAAAAABwAPgA+AD4AHAA==",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 15
      },
      "@": {
        "adv": 29,
        "data": "AH+AAAH/8AAH//gAD8D8AB8APgA8AA8AeD+PAHj/54Bx/+eA8+HngOPB44DjgcOA44HDgOeBw4DjgceA44PHAOPH5wDx//8A8f7+AHB4OAB4AAAAPAAAAB+A8AAP//AAB//wAAD/AAA=",
        "h": 26,
        "left": 2,
        "top": -23,
        "w": 25
      },
      "A": {
        "adv": 22,
        "data": "APwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 22
      },
      "B": {
        "adv": 22,
        "data": "//AA//wA//4A//8A+D8A+B8A+B8A+B8A+D8A//4A//wA//wA//8A+B8A+B+A+A+A+A+A+B+A+B8A//8A//4A//wA//AA",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 17
      },
      "C": {
        "adv": 20,
        "data": "AfwAB/+AH/+AP/+APwcAfgEAfAAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAAfAAAfAAAfwEAP/8AH/8AD/8AA/wA",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 17
      },
      "D": {
        "adv": 24,
        "data": "/+AA//wA//4A//8A+D+A+A/A+AfA+AfA+Afg+APg+APg+APg+APg+APg+Afg+AfA+AfA+A+A+D+A//8A//4A//wA/+AA",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 19
      },
      "E": {
        "adv": 18,
        "data": "//j/+P/4//j4APgA+AD4APgA//D/8P/w//D4APgA+AD4APgA+AD/+P/4//j/+A==",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 13
      },
      "F": {
        "adv": 18,
        "data": "//j/+P/4//j4APgA+AD4APgA+AD/8P/w//D/8PgA+AD4APgA+AD4APgA+AD4AA==",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 13
      },
      "G": {
        "adv": 23,
        "data": "AP8AB//gD//AH//AP4GAfgAAfAAA/AAA+AAA+AAA+D/g+D/g+D/g+D/g+APg+APgfAPgfgPgfwPgP//gH//gD//gAf8A",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 19
      },
      "H": {
        "adv": 24,
        "data": "+APg+APg+APg+APg+APg+APg+APg+APg+APg///g///g///g///g+APg+APg+APg+APg+APg+APg+APg+APg+APg+APg",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 19
      },
      "I": {
        "adv": 12,
        "data": "/8D/wP/Af4AfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA/gP/A/8D/wA==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 10
      },
      "J": {
        "adv": 11,
        "data": "B8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAD4APgP+A/wD+APgA",
        "h": 30,
        "left": -3,
        "top": -23,
        "w": 10
      },
      "K": {
        "adv": 21,
        "data": "+A/A+A+A+B8A+D8A+H4A+HwA+PgA+fAA+/AA++AA/8AA/+AA//AA//AA+fgA+PwA+HwA+H4A+D4A+B8A+B+A+A+A+A/A",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 18
      },
      "L": {
        "adv": 18,
        "data": "+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD//P/8//z//A==",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 14
      },
      "M": {
        "adv": 30,
        "data": "/gA//gB//gB//wB//wD//wD//wDv94Hv94Hv94HP88PP88PP88OP8eeP8eeP8ecP8P8P8P8P8P4P8P4P8H4P8HwP8HwP",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 24
      },
      "N": {
        "adv": 26,
        "data": "/ADw/gDw/gDw/wDw/4Dw/4Dw/8Dw98Dw8+Dw8+Dw8fDw8fjw8Pjw8Pzw8Hzw8D7w8D7w8B/w8B/w8A/w8Afw8Afw8APw",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 20
      },
      "O": {
        "adv": 25,
        "data": "Af4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 23,
        "left": 2,
        "top": -23,
        "w": 22
      },
      "P": {
        "adv": 20,
        "data": "/+D/+P/8//74fvg/+B/4H/gf+D74fv/+//z/+P/A+AD4APgA+AD4APgA+AD4AA==",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 16
      },
      "Q": {
        "adv": 25,
        "data": "Af4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf8AAA+AAA/AAAfgAAPwAAH4",
        "h": 28,
        "left": 2,
        "top": -23,
        "w": 22
      },
      "R": {
        "adv": 21,
        "data": "/+AA//gA//wA//4A+H4A+D8A+B8A+B8A+D4A+H4A//wA//wA//AA//AA+PgA+PgA+HwA+H4A+D4A+B8A+B8A+A+A+A/A",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 18
      },
      "S": {
        "adv": 18,
        "data": "B/Af/j/+f/x8DHwAfAB8AH4AP4A/4B/4B/wB/gB+AD4AHoA+8D7//v/8//gf4A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 15
      },
      "T": {
        "adv": 19,
        "data": "//+A//+A//+A//+AA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AA",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 17
      },
      "U": {
        "adv": 24,
        "data": "+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+AfA+AfA/A/Af/+AP/8AH/4AB/gA",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 18
      },
      "V": {
        "adv": 21,
        "data": "+AD4eAHwfAHwfAHwPAPgPgPgPgPgHgPAHwfAHwfADweADw+AD4+AB48AB58AB98AA94AA94AA/4AAfwAAfwAAfwAAPgA",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 21
      },
      "W": {
        "adv": 31,
        "data": "+AfAPvgHwD54B8A8fA/gfHwP4Hx8D+B8PB7geD4e8Pg+HvD4Ph7w+B4+8PAePHjwHzx58B88efAPfHngD3g94A94P+AP+D/gB/g/wAfwH8AH8B/AB/AfwAPgH4A=",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 31
      },
      "X": {
        "adv": 21,
        "data": "/AH4fgHwPgPgHwPgHwfAD4+AB8+AB98AA/8AA/4AAfwAAfwAAfwAA/4AB98AB98AD4+AD4/AHwfAPgPgPgPwfAHw/AH4",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 21
      },
      "Y": {
        "adv": 20,
        "data": "/APwfAPgfgfgPgfAPw/AHw+AH5+AD58AD/4AB/4AA/wAA/wAAfgAAfgAAPAAAPAAAPAAAPAAAPAAAPAAAPAAAPAAAPAA",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 20
      },
      "Z": {
        "adv": 19,
        "data": "//8A//8A//8A//8AAD4AAD4AAHwAAPgAAPgAAfAAA+AAA+AAB8AAD4AAH4AAHwAAPgAAfgAAfAAA//+A//+A//+A//+A",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 17
      },
      "[": {
        "adv": 11,
        "data": "//////Dw8PDw8PDw8PDw8PDw8PDw8PDw8P////8=",
        "h": 29,
        "left": 2,
        "top": -23,
        "w": 8
      },
      "]": {
        "adv": 11,
        "data": "/v7+/h4eHh4eHh4eHh4eHh4eHh4eHh4eHv7+/v4=",
        "h": 29,
        "left": 1,
        "top": -23,
        "w": 7
      },
      "_": {
        "adv": 13,
        "data": "//j/+A==",
        "h": 2,
        "left": -1,
        "top": 3,
        "w": 13
      },
      "a": {
        "adv": 19,
        "data": "B/A//D/+H/4YPwAfAB8P/z//f/98H/gf+B/8P3//f+8/zx+P",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 16
      },
      "b": {
        "adv": 20,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+PgA+/wA//4A//8A/j8A/B8A+A+A+A+A+A+A+A+A+A+A/A+A/B8A/j8A//8A//4A+/wA8fgA",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "c": {
        "adv": 16,
        "data": "A/gP/D/8P/x+CHwAfAB4APgA+AD4AHwAfAB+DD/8P/wf/Afw",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "d": {
        "adv": 20,
        "data": "AA+AAA+AAA+AAA+AAA+AAA+AAA+AB8+AH++AP/+AP/+Afh+AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+Af/+AP/+AH+eAB8eA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "e": {
        "adv": 19,
        "data": "A/AAD/wAH/4AP/8Afh8AfA8AeA8Af/+A//+A//+A+AAAfAAAfAAAfgMAP/8AH/8AD/8AA/gA",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 17
      },
      "f": {
        "adv": 12,
        "data": "B/AP+B/wH/A+AD4APgB/4P/g/+D/4D4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA=",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 13
      },
      "g": {
        "adv": 20,
        "data": "B8eAH++AP/+AP/+Afh+AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+Af/+AP/+AH++AD8+AAA+AAA+AAB8AcB8Af/8Af/4Af/wAH/AA",
        "h": 26,
        "left": 1,
        "top": -18,
        "w": 17
      },
      "h": {
        "adv": 21,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+PgA+/4A//8A//8A/h8A/B+A/A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "i": {
        "adv": 10,
        "data": "ePj4+HgAAPj4+Pj4+Pj4+Pj4+Pj4+Pj4+A==",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 5
      },
      "j": {
        "adv": 10,
        "data": "B4APgA+AD4AHgAAAAAAPgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgP+A/wD/APwA",
        "h": 33,
        "left": -3,
        "top": -25,
        "w": 9
      },
      "k": {
        "adv": 20,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+A+A+B8A+D4A+HwA+PgA+fgA+/AA++AA/+AA//AA//AA/PgA+HwA+H4A+D4A+B8A+B+A+A/A",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 18
      },
      "l": {
        "adv": 10,
        "data": "+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+A==",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 5
      },
      "m": {
        "adv": 31,
        "data": "8PgfAPP8f4D//v/A////4P4/x+D8H4Pg/B8D4PgfA+D4HwPg+B8D4PgfA+D4HwPg+B8D4PgfA+D4HwPg+B8D4PgfA+D4HwPg",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 27
      },
      "n": {
        "adv": 21,
        "data": "8PgA+/4A//8A//8A/h8A/B+A/A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 17
      },
      "o": {
        "adv": 20,
        "data": "A/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 17
      },
      "p": {
        "adv": 20,
        "data": "+PgA+/wA//4A//8A/h8A/B8A+A+A+A+A+A+A+A+A+A+A/A+A/B8A/h8A//8A//4A+/wA+fgA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA",
        "h": 26,
        "left": 2,
        "top": -18,
        "w": 17
      },
      "q": {
        "adv": 20,
        "data": "B8eAH++AP/+AP/+Afh+AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+Af/+AP/+AH++AD8+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+A",
        "h": 26,
        "left": 1,
        "top": -18,
        "w": 17
      },
      "r": {
        "adv": 15,
        "data": "8PDz8P/w//D+APwA/AD4APgA+AD4APgA+AD4APgA+AD4APgA",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 12
      },
      "s": {
        "adv": 16,
        "data": "D+A//H/4f/j4MPgAfgB/gD/gD/gD+AD8AHzgfP/4//j/8D/A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "t": {
        "adv": 14,
        "data": "DgAeAB4AHgA/8P/w//D/8D4APgA+AD4APgA+AD4APgA+AD4AP/Af8B/wB+A=",
        "h": 22,
        "left": 1,
        "top": -22,
        "w": 12
      },
      "u": {
        "adv": 21,
        "data": "+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A/B+AfD+Af/+Af/+AP++AD4eA",
        "h": 18,
        "left": 2,
        "top": -18,
        "w": 17
      },
      "v": {
        "adv": 18,
        "data": "+AfAeAfAfA+AfA+APA+APh8APh8AHh4AHz4ADz4ADzwAD7wAB/wAB/gAB/gAA/AAA/AAA/AA",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 18
      },
      "w": {
        "adv": 27,
        "data": "+B8D4Hgfg+B8P4PAfD+HwDw7h8A8O8fAPnvHgD55z4Aeec+AHnHvAB9x7wAf8e8AD/D/AA/g/gAP4P4AB+D+AAfgfAAH4HwA",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 27
      },
      "x": {
        "adv": 19,
        "data": "/A/Afg+APh8AHx8AH74AD/4AB/wAB/gAA/gAA/gAB/gAD/wAD74AHz4APx8APh+AfA+A/AfA",
        "h": 18,
        "left": 0,
        "top": -18,
        "w": 18
      },
      "y": {
        "adv": 18,
        "data": "+AfAfAfAfA+AfA+APg+APh8APh8AHx4AHz4ADz4AD7wAD7wAB/wAB/gAA/gAA/gAA/AAAfAAAfAAA+AAA+AAB8AAf8AAf4AAfwAAfAAA",
        "h": 26,
        "left": 0,
        "top": -18,
        "w": 18
      },
      "z": {
        "adv": 16,
        "data": "//j/+P/4//gB+AHwA+AHwAfAD4AfAD4APgB8AP/8//z//P/8",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "°": {
        "adv": 14,
        "data": "HwA/wH/gceDw4ODg8OBx4H/gP8AfAA==",
        "h": 11,
        "left": 1,
        "top": -24,
        "w": 11
      },
      "À": {
        "adv": 22,
        "data": "B+AAAfAAAPgAAHgAADwAAAAAAAAAAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 22
      },
      "Á": {
        "adv": 22,
        "data": "AA+AAB8AAD4AAHwAAPAAAAAAAAAAAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 22
      },
      "Â": {
        "adv": 22,
        "data": "APwAAf4AA/8AB8+ADwPAAAAAAAAAAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 22
      },
      "Ã": {
        "adv": 22,
        "data": "AcGAB/OAB/+ADj8ADh4AAAAAAAAAAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 22
      },
      "Ä": {
        "adv": 22,
        "data": "A44AB88AB88AA44AAAAAAAAAAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 29,
        "left": 0,
        "top": -29,
        "w": 22
      },
      "Å": {
        "adv": 22,
        "data": "AHwAAP4AAc4AAcYAAc4AAPwAAP4AAf4AAf4AA/8AA88AA88AB8+AB8eAB4eAD4fAD4PADwPAH//gH//gH//gP//wPgHwPAD4fAD4fAD4fAD8+AB8",
        "h": 28,
        "left": 0,
        "top": -29,
        "w": 22
      },
      "Æ": {
        "adv": 30,
        "data": "AD//+AA///gAf//4AH//+AD58AAA8fAAAfHwAAHh8AAD4fAAA+H/8APB//AHwf/wB4H/8A//8AAP//AAH//wAB//8AA+AfAAPgHwADwB//h8Af/4fAH/+PgB//g=",
        "h": 23,
        "left": 0,
        "top": -23,
        "w": 29
      },
      "Ç": {
        "adv": 20,
        "data": "AfwAB/+AH/+AP/+APwcAfgEAfAAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAAfAAAfAAAfwEAP/8AH/8AD/8AA/wAAOAAAPAAAfgAAHgAADwAA/gAA/gAA/AA",
        "h": 31,
        "left": 2,
        "top": -23,
        "w": 17
      },
      "È": {
        "adv": 18,
        "data": "fgAfAA+AB4ADwAAAAAD/+P/4//j/+PgA+AD4APgA+AD/8P/w//D/8PgA+AD4APgA+AD4AP/4//j/+P/4",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 13
      },
      "É": {
        "adv": 18,
        "data": "APgB8APgB8APAAAAAAD/+P/4//j/+PgA+AD4APgA+AD/8P/w//D/8PgA+AD4APgA+AD4AP/4//j/+P/4",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 13
      },
      "Ê": {
        "adv": 18,
        "data": "D8Af4D/wfPjwPAAAAAD/+P/4//j/+PgA+AD4APgA+AD/8P/w//D/8PgA+AD4APgA+AD4AP/4//j/+P/4",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 14
      },
      "Ë": {
        "adv": 18,
        "data": "OOB88HzwOOAAAAAA//j/+P/4//j4APgA+AD4APgA//D/8P/w//D4APgA+AD4APgA+AD/+P/4//j/+A==",
        "h": 29,
        "left": 3,
        "top": -29,
        "w": 13
      },
      "Ì": {
        "adv": 12,
        "data": "/AA+AB8ADwAHgAAAAAB/4H/gf+A/wA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgB/Af+B/4H/g",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 11
      },
      "Í": {
        "adv": 12,
        "data": "AfAD4AfAD4AeAAAAAAD/wP/A/8B/gB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAD+A/8D/wP/A",
        "h": 30,
        "left": 1,
        "top": -30,
        "w": 12
      },
      "Î": {
        "adv": 12,
        "data": "D8Af4D/wfPjwPAAAAAA/8D/wP/Af4AfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA/gP/A/8D/w",
        "h": 30,
        "left": -1,
        "top": -30,
        "w": 14
      },
      "Ï": {
        "adv": 12,
        "data": "ccD54PngccAAAAAAf+B/4H/gP8APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4AfwH/gf+B/4A==",
        "h": 29,
        "left": 0,
        "top": -29,
        "w": 11
      },
      "Ð": {
        "adv": 24,
        "data": "P/gAP/8AP/+AP//APg/gPgPwPgHwPgHwPgH4PgD4/8D4/8D4/8D4/8D4PgH4PgHwPgHwPgPgPg/gP//AP/+AP/8AP/gA",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 21
      },
      "Ñ": {
        "adv": 26,
        "data": "A4MAD+cAD/8AHH4AHDwAAAAAAAAA/ADw/gDw/gDw/wDw/4Dw/4Dw/8Dw98Dw8+Dw8+Dw8fDw8fjw8Pjw8Pzw8Hzw8D7w8D7w8B/w8B/w8A/w8Afw8Afw8APw",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 20
      },
      "Ò": {
        "adv": 25,
        "data": "B+AAAfAAAPgAAHgAADwAAAAAAAAAAf4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 30,
        "left": 2,
        "top": -30,
        "w": 22
      },
      "Ó": {
        "adv": 25,
        "data": "AA+AAB8AAD4AAHwAAPAAAAAAAAAAAf4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 30,
        "left": 2,
        "top": -30,
        "w": 22
      },
      "Ô": {
        "adv": 25,
        "data": "APwAAf4AA/8AB8+ADwPAAAAAAAAAAf4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 30,
        "left": 2,
        "top": -30,
        "w": 22
      },
      "Õ": {
        "adv": 25,
        "data": "AcGAB/OAB/+ADj8ADh4AAAAAAAAAAf4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 30,
        "left": 2,
        "top": -30,
        "w": 22
      },
      "Ö": {
        "adv": 25,
        "data": "A44AB88AB88AA44AAAAAAAAAAf4AD/+AH//AP//gfwPwfgHwfAH4/AD4+AD4+AD8+AD8+AB8+AD8+AD4+AD4/AD4fAD4fgHwfwPwP//gH//AD/+AAf4A",
        "h": 29,
        "left": 2,
        "top": -29,
        "w": 22
      },
      "Ø": {
        "adv": 25,
        "data": "AABAAf5wD//gH//gP//gfwfwfgfwfA/4/A74+B74+Dz8+Dj8+Hh8+PD8+OD4+eD4+8D4f4D4f4HwfwPwP//gH//AP/+AOf4AGAAA",
        "h": 25,
        "left": 2,
        "top": -24,
        "w": 22
      },
      "Ù": {
        "adv": 24,
        "data": "H4AAB8AAA+AAAeAAAPAAAAAAAAAA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+AfA+AfA/A/Af/+AP/8AH/4AB/gA",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 18
      },
      "Ú": {
        "adv": 24,
        "data": "AD4AAHwAAPgAAfAAA8AAAAAAAAAA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+AfA+AfA/A/Af/+AP/8AH/4AB/gA",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 18
      },
      "Û": {
        "adv": 24,
        "data": "A/AAB/gAD/wAHz4APA8AAAAAAAAA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+AfA+AfA/A/Af/+AP/8AH/4AB/gA",
        "h": 30,
        "left": 3,
        "top": -30,
        "w": 18
      },
      "Ü": {
        "adv": 24,
        "data": "DjgAHzwAHzwADjgAAAAAAAAA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+APA+AfA+AfA/A/Af/+AP/8AH/4AB/gA",
        "h": 29,
        "left": 3,
        "top": -29,
        "w": 18
      },
      "Ý": {
        "adv": 20,
        "data": "AB8AAD4AAHwAAPgAAeAAAAAAAAAA/APwfAPgfgfgPgfAPw/AHw+AH5+AD58AD/4AB/4AA/wAA/wAAfgAAfgAAPAAAPAAAPAAAPAAAPAAAPAAAPAAAPAAAPAA",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 20
      },
      "Þ": {
        "adv": 20,
        "data": "+AD4APgA+AD/4P/4//z//vg++D/4H/gf+D74fv/+//z/+P/g+AD4APgA+AD4AA==",
        "h": 23,
        "left": 3,
        "top": -23,
        "w": 16
      },
      "ß": {
        "adv": 23,
        "data": "B/gAH/4AP/+Af/+Afg+AfAeAeAeA+A+A+B8A+D4A+HwA+PgA+PwA+H4A+H+A+D/A+A/g+APg+AHw+AHw+IPw+P/g+P/g+P/A+P8A",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 20
      },
      "à": {
        "adv": 19,
        "data": "H4AHwAPgAeAA8AAAAAAH8D/8P/4f/hg/AB8AHw//P/9//3wf+B/4H/w/f/9/7z/PH48=",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 16
      },
      "á": {
        "adv": 19,
        "data": "AD4AfAD4AfADwAAAAAAH8D/8P/4f/hg/AB8AHw//P/9//3wf+B/4H/w/f/9/7z/PH48=",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 16
      },
      "â": {
        "adv": 19,
        "data": "A/AH+A/8Hz48DwAAAAAH8D/8P/4f/hg/AB8AHw//P/9//3wf+B/4H/w/f/9/7z/PH48=",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 16
      },
      "ã": {
        "adv": 19,
        "data": "BwYfzh/+OPw4eAAAAAAH8D/8P/4f/hg/AB8AHw//P/9//3wf+B/4H/w/f/9/7z/PH48=",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 16
      },
      "ä": {
        "adv": 19,
        "data": "DjgfPB88DjgAAAAAB/A//D/+H/4YPwAfAB8P/z//f/98H/gf+B/8P3//f+8/zx+P",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 16
      },
      "å": {
        "adv": 19,
        "data": "AfAD+Ac4BxgHOAPwAeAAAAAAB/A//D/+H/4YPwAfAB8P/z//f/98H/gf+B/8P3//f+8/zx+P",
        "h": 27,
        "left": 1,
        "top": -28,
        "w": 16
      },
      "æ": {
        "adv": 29,
        "data": "B/D+AD/5/wA///+AH///wBg/h8AAHwPgAB8D4A///+A////gf///4HwfAAD4HwAA+B8AAPw/gMB////Af/P/wD/h/8AfgH8A",
        "h": 18,
        "left": 1,
        "top": -18,
        "w": 27
      },
      "ç": {
        "adv": 16,
        "data": "A/gP/D/8P/x+CHwAfAB4APgA+AD4AHwAfAB+DD/8P/wf/AfwAcAB4APwAPAAeAfwB/AH4A==",
        "h": 26,
        "left": 1,
        "top": -18,
        "w": 14
      },
      "è": {
        "adv": 19,
        "data": "H4AAB8AAA+AAAeAAAPAAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA8AeA8Af/+A//+A//+A+AAAfAAAfAAAfgMAP/8AH/8AD/8AA/gA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "é": {
        "adv": 19,
        "data": "AD4AAHwAAPgAAfAAA8AAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA8AeA8Af/+A//+A//+A+AAAfAAAfAAAfgMAP/8AH/8AD/8AA/gA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "ê": {
        "adv": 19,
        "data": "B+AAD/AAH/gAPnwAeB4AAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA8AeA8Af/+A//+A//+A+AAAfAAAfAAAfgMAP/8AH/8AD/8AA/gA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "ë": {
        "adv": 19,
        "data": "HHAAPngAPngAHHAAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA8AeA8Af/+A//+A//+A+AAAfAAAfAAAfgMAP/8AH/8AD/8AA/gA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "ì": {
        "adv": 10,
        "data": "/AA+AB8ADwAHgAAAAAAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA=",
        "h": 25,
        "left": -1,
        "top": -25,
        "w": 9
      },
      "í": {
        "adv": 10,
        "data": "D4AfAD4AfADwAAAAAAD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AA=",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 9
      },
      "î": {
        "adv": 10,
        "data": "D8Af4D/wfPjwPAAAAAAPgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4A=",
        "h": 25,
        "left": -2,
        "top": -25,
        "w": 14
      },
      "ï": {
        "adv": 10,
        "data": "ccD54PngccAAAAAAHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8A",
        "h": 24,
        "left": -1,
        "top": -24,
        "w": 11
      },
      "ð": {
        "adv": 20,
        "data": "AgQAB54AB/4AA/wAA/gAB/wAD74ABh4AAB8AB+8AH/+AP/+Af/+Afh+AfA+AeA+A+A+A+A+AeA+AfA+Afh8AP/8AP/4AD/wAA/AA",
        "h": 25,
        "left": 1,
        "top": -26,
        "w": 17
      },
      "ñ": {
        "adv": 21,
        "data": "BwYAH84AH/4AOPwAOHgAAAAAAAAA8PgA+/4A//8A//8A/h8A/B+A/A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "ò": {
        "adv": 20,
        "data": "H4AAB8AAA+AAAeAAAPAAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "ó": {
        "adv": 20,
        "data": "AD4AAHwAAPgAAfAAA8AAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "ô": {
        "adv": 20,
        "data": "A/AAB/gAD/wAHz4APA8AAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "õ": {
        "adv": 20,
        "data": "BwYAH84AH/4AOPwAOHgAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 25,
        "left": 1,
        "top": -25,
        "w": 17
      },
      "ö": {
        "adv": 20,
        "data": "DjgAHzwAHzwADjgAAAAAAAAAA/AAD/wAH/4AP/8Afh8AfA+AfA+A+A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "ø": {
        "adv": 20,
        "data": "A/YAD/8AH/4AP/8Afj8AfD+AfH+A+P+A+O+A+c+A+8+Af4+Afw+Afx+AP/8AH/4AP/wAO/AACAAA",
        "h": 19,
        "left": 1,
        "top": -19,
        "w": 17
      },
      "ù": {
        "adv": 21,
        "data": "H4AAB8AAA+AAAeAAAPAAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A/B+AfD+Af/+Af/+AP++AD4eA",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "ú": {
        "adv": 21,
        "data": "AD4AAHwAAPgAAfAAA8AAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A/B+AfD+Af/+Af/+AP++AD4eA",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "û": {
        "adv": 21,
        "data": "A/AAB/gAD/wAHz4APA8AAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A/B+AfD+Af/+Af/+AP++AD4eA",
        "h": 25,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "ü": {
        "adv": 21,
        "data": "DjgAHzwAHzwADjgAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A/B+AfD+Af/+Af/+AP++AD4eA",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 17
      },
      "ý": {
        "adv": 18,
        "data": "AD4AAHwAAPgAAfAAA8AAAAAAAAAA+AfAfAfAfA+AfA+APg+APh8APh8AHx4AHz4ADz4AD7wAD7wAB/wAB/gAA/gAA/gAA/AAAfAAAfAAA+AAA+AAB8AAf8AAf4AAfwAAfAAA",
        "h": 33,
        "left": 0,
        "top": -25,
        "w": 18
      },
      "þ": {
        "adv": 20,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+PgA+/wA//4A//8A/h8A/B8A+A+A+A+A+A+A+A+A+A+A/A+A/B8A/h8A//8A//4A+/wA+fgA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA",
        "h": 33,
        "left": 2,
        "top": -25,
        "w": 17
      },
      "ÿ": {
        "adv": 18,
        "data": "DjgAHzwAHzwADjgAAAAAAAAA+AfAfAfAfA+AfA+APg+APh8APh8AHx4AHz4ADz4AD7wAD7wAB/wAB/gAA/gAA/gAA/AAAfAAAfAAA+AAA+AAB8AAf8AAf4AAfwAAfAAA",
        "h": 32,
        "left": 0,
        "top": -24,
        "w": 18
      },
      "…": {
        "adv": 27,
        "data": "cDgc+Hw++Hw++Hw+cDgc",
        "h": 5,
        "left": 2,
        "top": -5,
        "w": 23
      },
      "�": {
        "adv": 32,
        "data": "AAIAAAADAAAAB4AAAA/AAAAf4AAAP/AAAH/4AADgHAABwA4AA8IPAAfvj4AP/4/AH/8P4D/+D/D//B/8f/g/+D/4f/Af+P/gD/j/wAf//4AD//8AAfj+AADwfAAAcHgAADjwAAAf4AAAD8AAAAeAAAADAAA=",
        "h": 29,
        "left": 1,
        "top": -25,
        "w": 30
      }
    },
    "lineHeight": 45,
    "size": 32
  },
  "display": {
    "ascent": 60,
    "glyphs": {
      " ": {
        "adv": 15,
        "data": "",
        "h": 0,
        "left": 0,
        "top": 0,
        "w": 0
      },
      "!": {
        "adv": 16,
        "data": "/8D/wP/A/8B/wH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gD+AP4A/AD8AAAAAAAAAAAAEAD8Af4D/wP/A/8D/wH+APwAEAA==",
        "h": 41,
        "left": 3,
        "top": -40,
        "w": 10
      },
      "'": {
        "adv": 15,
        "data": "/v7+/v7+/v7+/vx8fHw=",
        "h": 14,
        "left": 4,
        "top": -40,
        "w": 7
      },
      "-": {
        "adv": 18,
        "data": "//z//P/8//z//P/8//w=",
        "h": 7,
        "left": 2,
        "top": -19,
        "w": 14
      },
      "0": {
        "adv": 32,
        "data": "AAQAAAD/4AAD//gAB//+AA///wAf//8AH///gD/w/4A/4H/Af8A/wH/AP+B/gB/gf4Af4H+AH+D/gB/g/4Af8P+AH/D/AB/w/wAf8P8AD/D/AA/w/wAP8P8AD/D/AA/w/4Af8P+AH/D/gB/w/4Af8H+AH+B/gB/gf4Af4H/AP+A/wD/AP+B/wD/w/8Af//+AD///AA///wAH//4AAf/8AAD/8AAABgAA",
        "h": 42,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "1": {
        "adv": 32,
        "data": "AAfwAB/wAD/wAH/wAP/wA//wB//wD//wH//wf+/w/8/wf4/wPw/wHg/wDA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/w",
        "h": 40,
        "left": 3,
        "top": -40,
        "w": 20
      },
      "2": {
        "adv": 32,
        "data": "AAIAAAD/8AAH//wAH//+AD///wB///+A////wH/g/8A/gH/gHgA/4AwAP+AIAB/gAAAf4AAAH+AAAD/gAAA/4AAAf8AAAH/AAAD/gAAB/4AAAf8AAAP+AAAH/gAAD/wAAB/4AAA/8AAAf+AAAP/AAAH/gAAD/wAAB/4AAA/8AAAf+AAAP/AAAH////D////w////8P////D////w////8P////A=",
        "h": 41,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "3": {
        "adv": 32,
        "data": "AAQAAAP/8AAf//wAP///AP///4B///+AP///wD/B/8AeAH/gCAA/4AAAP+AAAD/gAAA/wAAAP8AAAD/AAAB/gAAD/wAD//4AA//4AAP/4AAD//gAA//+AAP//4AD///AAAD/4AAAP+AAAD/gAAAf8AAAH/AAAB/wAAAf8AAAP/CAAD/g4AB/4P8D/+D////A////gP///wD///4A///8AB//4AAAGAAA",
        "h": 42,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "4": {
        "adv": 32,
        "data": "AAB/gAAA/4AAAP+AAAH/gAAD/4AAA/+AAAf/gAAP/4AAD/+AAB//gAA//4AAP3+AAH9/gAD+f4AA/H+AAfx/gAP4f4AD8H+AB/B/gA/gf4APwH+AH8B/gD+Af4B/AH+AfwB/gP////z////8/////P////z////8/////P////wAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gA==",
        "h": 40,
        "left": 1,
        "top": -40,
        "w": 30
      },
      "5": {
        "adv": 32,
        "data": "P///AD///wA///8AP///AD///wA///8AP///AH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/n4AAf//wAH///AB///4Af///AH///4B///+AHAP/wAAA/8AAAH/AAAB/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAB/wIAAf8DgAP+A/gf/gP///wD///8A///+AP//+AD///AAH//AAAAwAAA=",
        "h": 41,
        "left": 3,
        "top": -40,
        "w": 26
      },
      "6": {
        "adv": 32,
        "data": "AAAOAAAP/4AAP/+AAP//gAH//4AD//+AB///gA//gIAf+AAAH/AAAD/gAAA/wAAAP4AAAH+AAAB/gAAAfwf4AH8f/gD/P/8A/3//gP///8D////g////4P/gP+D/wB/w/4Af8P+AD/D/AA/w/wAP8P8AD/D/gA/wf4AP8H+AH/B/wB/wP+A/4D/4/+Af///AD///wA///4AH//8AAf/8AAB/8AAAAwAA",
        "h": 42,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "7": {
        "adv": 32,
        "data": "////8P////D////w////8P////D////w////8AAAH+AAAD/gAAA/wAAAf8AAAH+AAAB/gAAA/4AAAP8AAAH/AAAB/gAAA/4AAAP8AAAH/AAAB/wAAAf4AAAP+AAAD/AAAB/wAAAf4AAAP+AAAD/AAAB/wAAAf8AAAP+AAAD/gAAA/wAAAf8AAAH+AAAD/gAAA/4AAAf8AAAH/AAAD/gAAA==",
        "h": 40,
        "left": 2,
        "top": -40,
        "w": 28
      },
      "8": {
        "adv": 32,
        "data": "AAIAAAD/8AAD//wAD///AB///4A////AP///wD/w/8B/wD/gf8A/4H+AH+B/gB/gf4Af4D/AP8A/4D/AH/D/gB/5/wAP//4AB//8AAP/+AAB//AAA//8AA///gAf//+AP/H/wH/Af8B/gD/g/wAf4P8AD/D/AA/w/wAP8P8AD/D/AA/w/4Af8P/gf+B////gf///wD///4Af//8AB//+AAH/8AAABgAA",
        "h": 42,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "9": {
        "adv": 32,
        "data": "AAQAAAD/4AAD//gAD//8AB///wA///8AP///gH/x/8B/wH/A/4A/4P+AH+D/AB/g/wAf8P8AH/D/AA/w/wAP8P8AH/D/gB/w/4A/8P/Af/B////wf///8D////Af/+/wD//P8Af/j+AB/g/gAAAf4AAAH+AAAB/AAAA/wAAAf8AAAP+AAAH/gBAf/wAf//4AH//8AB//+AAf//AAH//AAB/+AAAHgAAA",
        "h": 42,
        "left": 2,
        "top": -41,
        "w": 28
      },
      "A": {
        "adv": 39,
        "data": "AAP/gAAAA/+AAAAH/4AAAAf/wAAAB//AAAAP/8AAAA//4AAAH+/gAAAf7+AAAB/P8AAAP8fwAAA/x/gAAD/H+AAAf4f4AAB/g/wAAH+D/AAA/wP8AAD/Af4AAP8B/gAB/gH+AAH+AP8AAf4A/wAD/AD/AAP///+AB////4AH////wAf////AD////8AP////4A/////gH/AAH+Af8AAf8B/gAB/wP+AAD/A/4AAP+D/AAA/4f8AAB/h/wAAH/H/AAAf8/4AAB/4=",
        "h": 40,
        "left": 0,
        "top": -40,
        "w": 39
      },
      "B": {
        "adv": 38,
        "data": "///gAP///gD///+A////wP///+D////w////8P+AP/D/gB/4/4AP+P+AD/j/gA/4/4AP8P+AH/D/gB/w/4B/4P///+D////A////AP///wD////A////4P////D/gD/4/4AP+P+AD/j/gAf8/4AH/P+AB/z/gAf8/4AP+P+AD/j/gD/4////+P////D////g////wP///4D///4A///wAA==",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 30
      },
      "C": {
        "adv": 36,
        "data": "AAAQAAAP/8AAP//4AP///gH///wD///8B///+A//B/gf/AD4H/gAED/wAAA/4AAAP+AAAH/AAAB/wAAAf8AAAH+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAB/wAAAf8AAAH/AAAB/wAAAP+AAAD/wAAA/8AAAH/wAGA//AfgP///4B///+AP///gB///4AH//+AAf/8AAAHAA",
        "h": 42,
        "left": 3,
        "top": -41,
        "w": 31
      },
      "D": {
        "adv": 41,
        "data": "///AAAD///wAAP///wAA////wAD////gAP////AA////+AD/gD/8AP+AD/wA/4AH/gD/gAP+AP+AAf8A/4AB/wD/gAH/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAf8A/4AB/wD/gAP/AP+AA/4A/4AH/gD/gB/8AP+Af/wA////+AD////wAP///+AA////gAD///8AAP//+AAA///AAAA=",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 33
      },
      "E": {
        "adv": 31,
        "data": "///+///+///+///+///+///+///+/4AA/4AA/4AA/4AA/4AA/4AA/4AA/4AA/4AA///8///8///8///8///8///8///8/4AA/4AA/4AA/4AA/4AA/4AA/4AA/4AA/4AA/4AA///+///+///+///+///+///+///+",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 23
      },
      "F": {
        "adv": 31,
        "data": "///+///+///+///+///+///+///+/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA///8///8///8///8///8///8///8/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA/wAA",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 23
      },
      "G": {
        "adv": 41,
        "data": "AAAEAAAAB//4AAAf//8AAH///4AB////AAP///8AB////wAP/8D+AA/+AA4AH/wAAgA/+AAAAD/wAAAAP+AAAAB/4AAAAH/AAAAAf8AAAAB/gAAAAP+AAAAA/4AAAAD/gH//gP+Af/+A/4B//4D/gH//gP+Af/+A/4B//4B/gH//gH/AAH+Af8AAf4B/wAB/gH/gAH+AP+AAf4A/8AB/gD/4AH+AH/wAf4AP/4H/gA////+AB////4AD////gAD///+AAH///wAAD//4AAAAMAAA",
        "h": 42,
        "left": 3,
        "top": -41,
        "w": 33
      },
      "H": {
        "adv": 43,
        "data": "/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/////gP////+A/////4D/////gP////+A/////4D/////gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4D/gAD/gP+AAP+A/4AA/4A=",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 33
      },
      "I": {
        "adv": 22,
        "data": "///A///A///A///A///Af/+AH/4AB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAB/gAH/wAf/8A///A///A///A///A///A",
        "h": 40,
        "left": 2,
        "top": -40,
        "w": 18
      },
      "J": {
        "adv": 19,
        "data": "AH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH/AAH+AAH+AAH+AAH+AAP+AAP+Ag/8A//8A//4A//4A//wA//gA/+AAPgAA",
        "h": 51,
        "left": -5,
        "top": -40,
        "w": 18
      },
      "K": {
        "adv": 37,
        "data": "/4AD//+AB/7/gAf8/4AP+P+AH/j/gD/w/4A/4P+Af8D/gP+A/4H/gP+D/wD/g/4A/4f8AP+P/AD/n/gA/5/wAP+/4AD//8AA///gAP//4AD///AA///wAP//+AD///wA/8f8AP+H/gD/g/8A/4H/AP+B/4D/gP/A/4B/wP+Af+D/gD/g/4A/8P+AH/j/gA/4/4AP/P+AB/7/gAP+/4AD/w==",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 32
      },
      "L": {
        "adv": 32,
        "data": "/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA////gP///4D///+A////gP///4D///+A////gA==",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 25
      },
      "M": {
        "adv": 53,
        "data": "//AAAf/g//AAAf/g//AAA//g//gAA//g//gAA//g//gAB//g//wAB//g//wAB//g//wAD//g/v4AD//g/v4AD//g/v4AH9/g/v4AH9/g/n8AH9/g/n8AP5/g/n8AP5/g/j+AP5/g/z+Afx/g/z+Afx/g/x/Afx/g/x/Afh/g/x/A/h/g/w/g/h/g/w/g/B/g/w/h/B/g/w/h/B/g/wfx+B/g/wfz+B/g/wfz+B/g/wP78B/g/wP/8B/g/wP/8B/g/wH/4B/g/wH/4B/g/wH/4B/g/wD/wB/g/wD/wB/g/wD/wB/g/wD/gB/g/wB/gB/g",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 43
      },
      "N": {
        "adv": 46,
        "data": "/+AAD+D/8AAP4P/wAA/g//gAD+D/+AAP4P/8AA/g//4AD+D//gAP4P//AA/g//8AD+D+/4AP4P7/gA/g/n/AD+D+f+AP4P4/4A/g/h/wD+D+H/AP4P4P+A/g/g/4D+D/B/wP4P8H/g/g/wP+D+D/Af8P4P8B/w/g/wD/j+D/AP+P4P8Af8/g/wB/7+D/AD/v4P8AH//g/wAf/+D/AA//4P8AD//g/wAH/+D/AAP/4P8AA//g/wAB/+D/AAH/4P8AAP/g/wAA/+A=",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 35
      },
      "O": {
        "adv": 45,
        "data": "AAAQAAAAD//gAAA///gAAP///gAB////AAf///+AB////8AP/wP/4B/8AH/gH/gAP/A/8AAf8D/gAB/4f+AAD/h/wAAP+H/AAAf8f8AAB/x/gAAH/P+AAAf8/4AAB/z/gAAH/P+AAAf8/4AAB/z/gAAH/P+AAAf8/4AAB/x/wAAH/H/AAAf8f8AAB/x/wAAP+H/gAA/4P+AAH/g/8AAf8B/4AD/wH/wAf+AP/4P/4Af////AB////4AB////AAD///4AAD//+AAAD//AAAAAMAAA",
        "h": 42,
        "left": 3,
        "top": -41,
        "w": 38
      },
      "P": {
        "adv": 35,
        "data": "///AAP//+AD///4A////AP///4D////A////wP+A/+D/gD/g/4A/4P+AH/D/gB/w/4Af8P+AH/D/gB/g/4Af4P+AP+D/gH/g/4H/wP///8D///+A////AP///gD///wA///wAP//AAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAP+AAAD/gAAA/4AAAA==",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 28
      },
      "Q": {
        "adv": 45,
        "data": "AAAQAAAAD//gAAA///gAAP///gAB////AAf///+AB////8AP/wP/4B/8AH/gH/gAP/A/8AAf8D/gAB/4f+AAD/h/wAAP+H/AAAf8f8AAB/x/gAAH/P+AAAf8/4AAB/z/gAAH/P+AAAf8/4AAB/z/gAAH/P+AAAf8/4AAB/x/wAAH/H/AAAf8f8AAB/x/wAAP+H/gAA/4P+AAH/g/8AAf8B/4AD/wH/wAf+AP/4P/4Af////AB////4AB////AAD///4AAD//+AAAD//4AAAAP/wAAAAH/gAAAAP/AAAAA/+AAAAB/8AAAAD/4AAAAH/gAAAAP/AAAAA//A==",
        "h": 50,
        "left": 3,
        "top": -41,
        "w": 38
      },
      "R": {
        "adv": 37,
        "data": "///AAP//+AD///4A////AP///4D////A////4P+A/+D/gD/g/4A/4P+AH/D/gB/w/4Af8P+AH/D/gB/g/4A/4P+Af+D/gf/A////wP///4D///8A///8AP//+AD///gA///4AP+D/AD/g/4A/4H+AP+B/wD/gP+A/4B/wP+Af8D/gD/g/4A/8P+AH/D/gA/4/4AP/P+AB/z/gAP+/4AD/w==",
        "h": 40,
        "left": 5,
        "top": -40,
        "w": 32
      },
      "S": {
        "adv": 31,
        "data": "AAQAAAH/+AAH//8AD///gB///4A///+Af///AH/g/wD/gB4A/4ACAP8AAAD/AAAA/4AAAP+AAAD/wAAA//AAAH/8AAB//wAAP//AAB//4AAP//gAB//8AAH//gAAf/8AAB//AAAH/4AAA/+AAAD/gAAAf8AAAH/AAAB/wIAAf4DAAH+A+AD/gP8D/4D///8A///+AP///gD///wA///wAB//wAAAMAAA",
        "h": 42,
        "left": 3,
        "top": -41,
        "w": 26
      },
      "T": {
        "adv": 32,
        "data": "/////P////z////8/////P////z////8/////AAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAAAf4AAAH+AAAB/gAA==",
        "h": 40,
        "left": 1,
        "top": -40,
        "w": 30
      },
      "U": {
        "adv": 42,
        "data": "/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/4D/AAD/gP8AAP+A/wAA/wD/gAD/AP+AAf8A/4AB/wB/wAP/AH/gB/4AP/wf/gA////8AB////gAD///8AAH///gAAH//4AAAH/+AAAAAYAAAA==",
        "h": 41,
        "left": 5,
        "top": -40,
        "w": 33
      },
      "V": {
        "adv": 36,
        "data": "/4AAD/B/gAAf8H+AAB/wf8AAH+A/wAA/4D/AAD/gP+AAP8Af4AB/wB/gAH/AH/AAf4AP8AD/gA/wAP+AD/gA/wAH+AD/AAf4Af4AB/gB/gAD/AH+AAP8A/wAA/wD/AAB/gP8AAH+B/gAAf4H+AAA/wf4AAD/D/AAAP8P8AAAf4/wAAB/j+AAAH+f4AAAP5/gAAA/38AAAD/fwAAAH//AAAAf/4AAAB//gAAAD/+AAAAP/wAAAA//AAAAB/8AAAAH/gAAAAf+AAA=",
        "h": 40,
        "left": 0,
        "top": -40,
        "w": 36
      },
      "W": {
        "adv": 54,
        "data": "/wAB/gAD/P+AAf4AB/x/gAP/AAf8f4AD/wAH+H+AA/8AB/h/wAP/gAf4P8AH/4AP+D/AB/+AD/A/wAf/gA/wP+AH/8AP8B/gD//AH+Af4A//wB/gH+AP/8Af4B/gD8/gH+AP8B/P4D/AD/Afz+A/wA/wH8/gP8AP8B/P8D/AB/g/h/B/gAf4P4fwf4AH+D+H8H+AB/h/g/h/gAP8fwP4fwAD/H8D+P8AA/x/A/j/AAP8fwH8/wAB/P4B/P4AAf7+Afz+AAH+/gH9/gAA/v4A/f4AAP78AP38AAD//AD//AAA//wA//wAAH/8AH/8AAB/+AB/+AAAf/gAf/gAAH/4AH/4AAA/8AA/+AAAP/AAP/AAAD/wAD/wAA==",
        "h": 40,
        "left": 0,
        "top": -40,
        "w": 54
      },
      "X": {
        "adv": 37,
        "data": "f8AAH/A/4AA/4D/wAD/gH/AAf8AP+AB/wA/4AP+AB/wB/wAD/gH/AAP+A/4AAf8D/AAA/wf8AAD/h/gAAH/P+AAAf9/wAAA//+AAAB//4AAAH//AAAAP/4AAAAf/gAAAB/8AAAAH/wAAAA//gAAAH//AAAAf/8AAAD//4AAAf9/wAAB/n/AAAP+P+AAB/wf8AAH/B/wAA/4D/gAH/AP/AAf8Af8AD/gA/4AP8AD/wB/wAH/AP+AAf+A/4AA/8H/AAB/w/4AAH/g=",
        "h": 40,
        "left": 0,
        "top": -40,
        "w": 37
      },
      "Y": {
        "adv": 35,
        "data": "/4AAP+B/wAB/wH/AAH/AP+AA/4A/4AD/gB/wAf8AH/AB/gAP+AP+AAf4B/wAB/wH/AAD/A/4AAP+D/gAAf4f8AAB/x/wAAD/P+AAAP+/4AAAf//AAAB//4AAAD//gAAAP/8AAAAf/wAAAA/+AAAAD/4AAAAH/AAAAAf8AAAAB/wAAAAH/AAAAAf8AAAAB/wAAAAH/AAAAAf8AAAAB/wAAAAH/AAAAAf8AAAAB/wAAAAH/AAAAAf8AAAAB/wAAAAH/AAAAAf8AAA=",
        "h": 40,
        "left": 0,
        "top": -40,
        "w": 35
      },
      "Z": {
        "adv": 32,
        "data": "f////H////x////8f////H////x////4f///+AAAH/AAAD/gAAA/4AAAf8AAAP+AAAD/gAAB/wAAA/4AAAf+AAAH/AAAD/gAAB/4AAAf8AAAP+AAAH/AAAB/wAAA/4AAAf8AAAH/AAAD/gAAB/wAAAf8AAAP+AAAH/AAAB/wAAA/4AAAf////H////z////8/////P////z////8/////A==",
        "h": 40,
        "left": 1,
        "top": -40,
        "w": 30
      },
      "�": {
        "adv": 56,
        "data": "AAAAYAAAAAAAAPAAAAAAAAH4AAAAAAAD/AAAAAAAB/4AAAAAAA//AAAAAAAf/4AAAAAAP//AAAAAAH//4AAAAAD///AAAAAB///4AAAAA/AB/AAAAAfAAH4AAAAPgAA/AAAAH4AAH4AAAD/AAB/AAAB/wfAf4AAA/+/4H/AAAf//+A/4AAP///gf/AAH///4H/4AD///8B//AB///+Af/4A////AP//Af///gH//4P///wD///B///4B///gP//+B///wB///A///4AP//wP//8AB//8D//+AAP//A///AAB//////gAAP/////wAAB/////4AAAP////8AAAB/+H/+AAAAP/A//AAAAB/gH/gAAAAP4B/wAAAAB+Af4AAAAAPwH8AAAAAB8D+AAAAAAP//AAAAAAB//gAAAAAAP/wAAAAAAB/4AAAAAAAP8AAAAAAAB+AAAAAAAAPAAAAAAAABgAAAA",
        "h": 51,
        "left": 2,
        "top": -43,
        "w": 52
      }
    },
    "lineHeight": 77,
    "size": 56
  },
  "value": {
    "ascent": 37,
    "glyphs": {
      " ": {
        "adv": 9,
        "data": "",
        "h": 0,
        "left": 0,
        "top": 0,
        "w": 0
      },
      "!": {
        "adv": 10,
        "data": "/Pz8/Pz4+Pj4eHh4eHh4eAAAePz8/Px4",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 6
      },
      "\"": {
        "adv": 16,
        "data": "+fD58Pnw+fB48HDgcOBw4HDg",
        "h": 9,
        "left": 2,
        "top": -24,
        "w": 12
      },
      "#": {
        "adv": 22,
        "data": "AePAAcOAAceAA8eAA8eAA8eAA4cAf//wf//wf//wB48ABw4ABx4ADx4A///g///g///gDjwAHjwAHjwAHjwAHDgAHHgAPHgA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 20
      },
      "%": {
        "adv": 31,
        "data": "HwAeAD/APAB/4DwAf+B4APng8ADx8PAA8fHgAPHx4ADx48+A8ePf4Hnnv+B/57/wP8988B8eePAAHnj4ADx4+AA8ePgAeHjwAHh48ADwfPAA8DzwAeA/4APAH+ADwA+A",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 29
      },
      "&": {
        "adv": 26,
        "data": "A/gAAA/+AAAf/wAAH/8AAD8fAAA+DwAAHh8AAB8fAAAffgAAD/wAAAf4AAAf8D8AP/g+AH/8fgB+fnwAfD/8APwf+AD8D/gA/AfwAH8P8AB///gAP//8AB//fgAH+D+A",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 25
      },
      "'": {
        "adv": 9,
        "data": "+Pj4+HhwcHBw",
        "h": 9,
        "left": 2,
        "top": -24,
        "w": 5
      },
      "(": {
        "adv": 12,
        "data": "B8APAA8AHgAeAD4APAB8AHwAeAB4AHgA+AD4APgA+AD4APgAeAB4AHgAfAB8ADwAPgA+AB4ADwAPAAeA",
        "h": 30,
        "left": 1,
        "top": -24,
        "w": 10
      },
      ")": {
        "adv": 12,
        "data": "+AB4ADwAPgAeAB4AHwAPAA8AD4APgA+AB4AHgAeAB4AHgAeAB4APgA+ADwAPAB8AHgAeAD4APAB4APgA",
        "h": 30,
        "left": 1,
        "top": -24,
        "w": 9
      },
      "*": {
        "adv": 19,
        "data": "A8ADwAPAA8CBwXnP////////B+AH8A94Hng+Ph48BBA=",
        "h": 16,
        "left": 1,
        "top": -26,
        "w": 16
      },
      "+": {
        "adv": 19,
        "data": "AeAAAeAAAeAAAeAAAeAAAeAAAeAA//+A//+A//+A//+AAeAAAeAAAeAAAeAAAeAAAeAA",
        "h": 17,
        "left": 1,
        "top": -21,
        "w": 17
      },
      ",": {
        "adv": 10,
        "data": "Pnx8fHh48PA=",
        "h": 8,
        "left": 1,
        "top": -4,
        "w": 7
      },
      "-": {
        "adv": 11,
        "data": "/4D/gP+A/4A=",
        "h": 4,
        "left": 1,
        "top": -12,
        "w": 9
      },
      ".": {
        "adv": 10,
        "data": "ePz8/Px4",
        "h": 6,
        "left": 2,
        "top": -6,
        "w": 6
      },
      "/": {
        "adv": 14,
        "data": "AHwAeAD4APgA8AHwAeAD4APgA8AHwAfAB4APgA8AHwAfAB4APgA+ADwAfAB4APgA",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 14
      },
      "0": {
        "adv": 19,
        "data": "B/AAD/wAH/4AP/4Afj8AfB8AfB+AfA+A/A+A+A+A+A+A+A+A+A+A+A+A+A+A/A+AfA+AfB+AfB8APj8AP/8AH/4AD/wAA/AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "1": {
        "adv": 19,
        "data": "AfAD8AfwD/A/8H/w/fB58DHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHw",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 12
      },
      "2": {
        "adv": 19,
        "data": "B/AAH/wAf/4A//8AfD8AOB+AEB+AAA+AAB8AAB8AAD8AAH4AAPwAAPgAAfAAA+AAB8AAD4AAHwAAPgAAf/+A//+A//+A//+A",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "3": {
        "adv": 19,
        "data": "D/AAP/wA//4Af/8AOD8AIB8AAB8AAB8AAD4AD/wAD/AAD/wAD/4AAD8AAB+AAA+AAA+AAA+AgB+A8D+A//8A//4A//wAH+AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "4": {
        "adv": 19,
        "data": "AD4AAH4AAP4AAP4AAf4AA/4AA/4AB74ADz4ADz4AHj4APD4APD4AeD4A8D4A///A///A///A///AAD4AAD4AAD4AAD4AAD4A",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 18
      },
      "5": {
        "adv": 19,
        "data": "f/x//H/8f/x8AHgAeAD4AP/g//j//P/+IP4APwA/AB8AHwA/gD7gfv/8//z/8D/A",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 16
      },
      "6": {
        "adv": 19,
        "data": "AP8AA/8AD/8AH/8AP4AAPgAAfAAAfAAAefgAe/4A//8A//+A/h+A/A+A+A+A+A+A+A+AfA+AfA+Afh+AP/8AH/4AD/wAA/AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "7": {
        "adv": 19,
        "data": "//+A//+A//+A//+AAA+AAB8AAB8AAD4AAD4AAH4AAHwAAPwAAPgAAPgAAfAAAfAAA+AAA+AAB+AAB8AAD8AAD4AAH4AAHwAA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "8": {
        "adv": 19,
        "data": "B/AAH/wAP/4Af/8Afj8AfB8AfA8AfB8APh8AP/4AH/wAB/AAH/wAP/4Afj8AfA+A+A+A+A+A+A+A/B+Af/8Af/8AH/4AB/gA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      "9": {
        "adv": 19,
        "data": "B/AAH/gAP/4Af/4Afj8A/B8A+A+A+A+A+A+A+A+A/D+Af/+Af/+AP++AD8+AAA+AAA8AAB8AAD8AAP4AP/wAP/gAP/AAP4AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 17
      },
      ":": {
        "adv": 10,
        "data": "ePz8/Px4AAAAAAAAAHj8/Pz8eA==",
        "h": 19,
        "left": 2,
        "top": -19,
        "w": 6
      },
      ";": {
        "adv": 10,
        "data": "PH5+fn48AAAAAAAAAAAAAD58fHx4ePDw",
        "h": 24,
        "left": 1,
        "top": -19,
        "w": 7
      },
      "=": {
        "adv": 19,
        "data": "//+A//+A//+A//+AAAAAAAAA//+A//+A//+A//+A",
        "h": 10,
        "left": 1,
        "top": -18,
        "w": 17
      },
      "?": {
        "adv": 16,
        "data": "D+B/+P/8f/54PiA+AB4APgB+APwD+AfgB8AHgAeAAAAAAAAAB4APwA/AD8APwAeA",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 15
      },
      "@": {
        "adv": 31,
        "data": "AD/AAAH/+AAD//wAD+B+AB8AHwAeAAeAPB/DwHh/88B4//HA8fDx4PHg8eDzwPHg48Dx4OPA8eDjwPHg48DxwPPB88Dx4/PA8f//gPD/fwB4fh4AfAAAAD4AAAAfgDgAD//4AAP/+AAA/8AA",
        "h": 27,
        "left": 2,
        "top": -24,
        "w": 27
      },
      "A": {
        "adv": 23,
        "data": "AP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 23
      },
      "B": {
        "adv": 23,
        "data": "//gA//4A//8A//+A+B+A+A+A+A+A+A+A+B+A//8A//4A//4A//+A+B+A+A/A+AfA+AfA+AfA+A/A+B/A//+A//8A//4A//gA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 18
      },
      "C": {
        "adv": 22,
        "data": "AP4AB//AD//AH//AP4OAfgCAfgAAfAAA/AAA+AAA+AAA+AAA+AAA+AAA+AAA/AAA/AAAfgAAfgAAP4HAP//AH//AB//AAf4A",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 18
      },
      "D": {
        "adv": 25,
        "data": "//AA//4A//8A//+A+B/A+Afg+Afg+APw+APw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw+Afg+A/g+D/A//+A//8A//wA/+AA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 20
      },
      "E": {
        "adv": 19,
        "data": "//z//P/8//z4APgA+AD4APgA//j/+P/4//j4APgA+AD4APgA+AD4AP/8//z//P/8",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 14
      },
      "F": {
        "adv": 19,
        "data": "//z//P/8//z4APgA+AD4APgA+AD/+P/4//j/+PgA+AD4APgA+AD4APgA+AD4APgA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 14
      },
      "G": {
        "adv": 25,
        "data": "AP+AA//wD//gH//gP8DgPwAAfgAAfAAA/AAA/AAA+D/w+D/w+D/w+D/w+AHw/AHw/AHwfgHwfgHwP4HwP//wH//wB//wAf+A",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 20
      },
      "H": {
        "adv": 26,
        "data": "+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw///w///w///w///w+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 20
      },
      "I": {
        "adv": 13,
        "data": "/+D/4P/gf+AfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAD/A/+D/4P/g",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 11
      },
      "J": {
        "adv": 11,
        "data": "A+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4Afg/8D/wP+A/gA=",
        "h": 31,
        "left": -3,
        "top": -24,
        "w": 11
      },
      "K": {
        "adv": 23,
        "data": "+Afw+AfA+A/A+B+A+D8A+H4A+HwA+PwA+fgA+/AA++AA/+AA//AA//gA/vgA+PwA+H4A+D4A+D8A+B+A+B+A+A/A+Afg+Afw",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 20
      },
      "L": {
        "adv": 19,
        "data": "+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4AP/+//7//v/+",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 15
      },
      "M": {
        "adv": 32,
        "data": "/gAfwP8AP8D/AD/A/wA/wP8Af8D3gH/A94B/wPeAf8D7wPfA+8D3wPvA98D74efA+eHnwPnh58D588fA+PPHwPjzx8D4/4fA+H+HwPh/h8D4fwfA+D8HwPg/B8D4PgfA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 26
      },
      "N": {
        "adv": 28,
        "data": "/gB8/gB8/wB8/4B8/4B8/8B898B89+B88/B88/B8+fh8+Ph8+Px8+Hx8+H58+D98+B98+B/8+A/8+A/8+Af8+AP8+AP8+AH8",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 22
      },
      "O": {
        "adv": 27,
        "data": "Af8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 23
      },
      "P": {
        "adv": 21,
        "data": "//AA//wA//4A//8A+D8A+B+A+B+A+A+A+B+A+B+A+D8A//8A//4A//wA//AA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 17
      },
      "Q": {
        "adv": 27,
        "data": "Af8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf/AAA/AAAfgAAPwAAH4AAD+",
        "h": 29,
        "left": 2,
        "top": -24,
        "w": 23
      },
      "R": {
        "adv": 22,
        "data": "//AA//wA//4A//8A+D8A+B+A+A+A+A+A+B+A+B8A+D8A//4A//wA//gA//gA+PwA+HwA+D4A+D8A+B8A+B+A+A/A+AfA+Afg",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 19
      },
      "S": {
        "adv": 19,
        "data": "D/A//n/+f/z8HPgE+AD4APwA/wB/wD/wH/gH/AH+AH4APgA+gD7wfv/8//z/+D/A",
        "h": 24,
        "left": 2,
        "top": -24,
        "w": 15
      },
      "T": {
        "adv": 20,
        "data": "///A///A///A///AA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 18
      },
      "U": {
        "adv": 26,
        "data": "+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw/APgfw/gf//AP/+AD/8AA/wA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 20
      },
      "V": {
        "adv": 22,
        "data": "+AB8fAD8fAD4fAD4PgH4PgHwPgHwHwPwHwPgHwPgD4PAD4fAD4fAB8eAB8+AB8+AA88AA/8AA/8AAf4AAf4AAf4AAPwAAPwA",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 22
      },
      "W": {
        "adv": 33,
        "data": "+APgD4D4A+AfgHwH8B8AfAfwHwB8B/AfAHwH8B4APg/4PgA+D3g+AD4PeD4APg94PAAfH3x8AB8ePHwAHx48fAAfPjx4AA8+PvgAD7we+AAPvB74AAe8HvAAB/we8AAH+A/wAAf4D/AAA/gP4AAD8A/gAAPwB+AA",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 33
      },
      "X": {
        "adv": 23,
        "data": "fAD8fgD4PwH4HwHwH4PgD4fgB8fAB++AA++AAf8AAf8AAP4AAP4AAf4AA/8AA/+AB8/AD8fAD4fgHwPwPwHwPgH4fAD8/AD+",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 23
      },
      "Y": {
        "adv": 21,
        "data": "/AH4fAHwfgPwPgPgPwfgHwfAH4/AD4+AB9+AB98AA/8AA/4AAfwAAfwAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgA",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 21
      },
      "Z": {
        "adv": 20,
        "data": "///A///A///A//+AAB+AAD8AAD4AAH4AAPwAAPgAAfgAA/AAA+AAB8AAD8AAH4AAHwAAPwAAfgAAfAAA///A///A///A///A",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 18
      },
      "[": {
        "adv": 11,
        "data": "//////j4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4/////w==",
        "h": 31,
        "left": 2,
        "top": -24,
        "w": 8
      },
      "]": {
        "adv": 11,
        "data": "/////w8PDw8PDw8PDw8PDw8PDw8PDw8PDw8P/////w==",
        "h": 31,
        "left": 1,
        "top": -24,
        "w": 8
      },
      "_": {
        "adv": 14,
        "data": "//z//A==",
        "h": 2,
        "left": -1,
        "top": 3,
        "w": 14
      },
      "a": {
        "adv": 21,
        "data": "B/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 19,
        "left": 1,
        "top": -19,
        "w": 17
      },
      "b": {
        "adv": 22,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+fgA+/wA//4A//8A/D8A+B+A+B+A+A+A+A+A+A+A+A+A+A+A+B+A/B+A/j8A//8A//4A9/wA8fAA",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 17
      },
      "c": {
        "adv": 17,
        "data": "B/Af/D/8f/z+GPwA+AD4APgA+AD4APgA+AD8BP4cf/w//B/8B/A=",
        "h": 19,
        "left": 2,
        "top": -19,
        "w": 14
      },
      "d": {
        "adv": 22,
        "data": "AA+AAA+AAA+AAA+AAA+AAA+AAA+AD4+AP++Af/+Af/+A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A/B+A/j+Af/+Af/+AP++AD4eA",
        "h": 26,
        "left": 2,
        "top": -26,
        "w": 17
      },
      "e": {
        "adv": 20,
        "data": "B/AAH/wAP/4Af/8AfD8A+B8A+A+A//+A//+A//+A+AAA+AAA+AAA/AEAfgcAf/8AP/8AH/8AB/gA",
        "h": 19,
        "left": 2,
        "top": -19,
        "w": 17
      },
      "f": {
        "adv": 13,
        "data": "A/gP/B/4H/gfCD8APwA/8P/w//D/8D8APwA/AD8APwA/AD8APwA/AD8APwA/AD8APwA/AA==",
        "h": 26,
        "left": 1,
        "top": -26,
        "w": 14
      },
      "g": {
        "adv": 22,
        "data": "D4+AP++Af/+Af/+A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A/B+A/j+Af/+Af/+AP++AD4+AAA+AAA+AAB+AcD8Af/8Af/4Af/wAH+AA",
        "h": 27,
        "left": 2,
        "top": -19,
        "w": 17
      },
      "h": {
        "adv": 22,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+fgA+/4A//8A//8A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 17
      },
      "i": {
        "adv": 10,
        "data": "eHz8fHgAAHx8fHx8fHx8fHx8fHx8fHx8fHw=",
        "h": 26,
        "left": 2,
        "top": -26,
        "w": 6
      },
      "j": {
        "adv": 10,
        "data": "B4AHwA/AB8AHgAAAAAAHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8APwA/A/4D/gP8A/AA=",
        "h": 34,
        "left": -3,
        "top": -26,
        "w": 10
      },
      "k": {
        "adv": 21,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+B/A+B8A+D4A+H4A+PwA+fgA+/AA/+AA98AA/+AA//AA//gA+PgA+PwA+H4A+D8A+D8A+B+A+A/A",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 18
      },
      "l": {
        "adv": 10,
        "data": "+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pg=",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 5
      },
      "m": {
        "adv": 33,
        "data": "8fgfgPP8f8D3/v/g////4P4/x/D8H4Pw+B+B8PgfAfD4HwHw+B8B8PgfAfD4HwHw+B8B8PgfAfD4HwHw+B8B8PgfAfD4HwHw+B8B8A==",
        "h": 19,
        "left": 3,
        "top": -19,
        "w": 28
      },
      "n": {
        "adv": 22,
        "data": "8fgA9/4A9/8A//8A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 19,
        "left": 3,
        "top": -19,
        "w": 17
      },
      "o": {
        "adv": 21,
        "data": "B/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 19,
        "left": 2,
        "top": -19,
        "w": 18
      },
      "p": {
        "adv": 22,
        "data": "8fgA8/wA9/4A//8A/D8A+B+A+B+A+A+A+A+A+A+A+A+A+A+A+B+A/B8A/j8A//8A//4A+/wA+fgA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA",
        "h": 27,
        "left": 3,
        "top": -19,
        "w": 17
      },
      "q": {
        "adv": 22,
        "data": "D4+AP++Af/+Af/+A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A/B+A/j+Af/+Af/+AP++AD4+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+A",
        "h": 27,
        "left": 2,
        "top": -19,
        "w": 17
      },
      "r": {
        "adv": 15,
        "data": "8PDz8Pfw9+D/4P4A/AD4APgA+AD4APgA+AD4APgA+AD4APgA+AA=",
        "h": 19,
        "left": 3,
        "top": -19,
        "w": 12
      },
      "s": {
        "adv": 17,
        "data": "H+B/+P/4//j4cPgA+AD/AH/AP/AP+AH4APyAfOD8//j/+P/wf8A=",
        "h": 19,
        "left": 2,
        "top": -19,
        "w": 14
      },
      "t": {
        "adv": 15,
        "data": "DgAeAB4AHgA/8P/w//D/8D4APgA+AD4APgA+AD4APgA+AD4APwg/+B/4D/gH8A==",
        "h": 23,
        "left": 1,
        "top": -23,
        "w": 13
      },
      "u": {
        "adv": 22,
        "data": "+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A+B+A+B+A/D+A//+Af/+Af++AH4eA",
        "h": 19,
        "left": 3,
        "top": -19,
        "w": 17
      },
      "v": {
        "adv": 19,
        "data": "+APgfAPgfAfAfAfAPgfAPg+APg+AHw+AHx8ADx8AD54AD74AB74AB7wAB/wAA/wAA/gAAfgAAfAA",
        "h": 19,
        "left": 0,
        "top": -19,
        "w": 19
      },
      "w": {
        "adv": 29,
        "data": "/A+A+HwfwfB8H8HwfB/B8D4dwfA+PePgPj3j4D494+AfOOPAH3j3wB9498APePfAD3h3gA9wd4AP8HeAB/B/AAfwfwAH4D8AB+A/AA==",
        "h": 19,
        "left": 0,
        "top": -19,
        "w": 29
      },
      "x": {
        "adv": 20,
        "data": "/gfgfgfAPw/AHx+AH58AD78AB/4AB/wAA/wAA/gAA/wAB/4AD/4AD78AH5+APw+APg/Afgfg/Afg",
        "h": 19,
        "left": 0,
        "top": -19,
        "w": 19
      },
      "y": {
        "adv": 19,
        "data": "/APgfAfgfAfAfgfAPg/APg+AHw+AHx+AHx8AD58AD74AB74AB/4AB/wAA/wAA/wAAfgAAfgAAfAAAfAAAfAAA+AAB+AAf8AAf8AAfwAAfgAA",
        "h": 27,
        "left": 0,
        "top": -19,
        "w": 19
      },
      "z": {
        "adv": 17,
        "data": "//z//P/8//wA/AH4AfAD4AfgB8APgB8APwA+AHwA//7//v/+//4=",
        "h": 19,
        "left": 1,
        "top": -19,
        "w": 15
      },
      "°": {
        "adv": 15,
        "data": "D4A/4H/gePDwcPBw8HB48H/gP8APgA==",
        "h": 11,
        "left": 1,
        "top": -24,
        "w": 12
      },
      "À": {
        "adv": 23,
        "data": "A/AAAfgAAPgAAHwAAB4AAA8AAAAAAAAAAAAAAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 33,
        "left": 0,
        "top": -33,
        "w": 23
      },
      "Á": {
        "adv": 23,
        "data": "AAfgAAfAAA+AAB8AAD4AAHgAAAAAAAAAAAAAAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 33,
        "left": 0,
        "top": -33,
        "w": 23
      },
      "Â": {
        "adv": 23,
        "data": "AH4AAP4AAf8AA++AB8fAD4HgAAAAAAAAAAAAAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 33,
        "left": 0,
        "top": -33,
        "w": 23
      },
      "Ã": {
        "adv": 23,
        "data": "AeHAA/HAB//ABz+ADg8AAAAAAAAAAAAAAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 32,
        "left": 0,
        "top": -32,
        "w": 23
      },
      "Ä": {
        "adv": 23,
        "data": "AeOAAefAAefAAeOAAAAAAAAAAAAAAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 31,
        "left": 0,
        "top": -32,
        "w": 23
      },
      "Å": {
        "adv": 23,
        "data": "AHwAAP4AAM4AAccAAccAAM4AAP4AAP4AAP8AAf8AAf8AAe+AA+eAA+fAA8fAB8fAB8PgD4PgD4PgD4HwH//wH//wH//4P//4PgD4PgB8fgB8fAB+fAB+/AA+",
        "h": 30,
        "left": 0,
        "top": -30,
        "w": 23
      },
      "Æ": {
        "adv": 32,
        "data": "AB///AA///wAP//8AH///AB8+AAA+PgAAPj4AAHw+AAB8PgAAfD//APg//wD4P/8B8D//AfA+AAP//gAD//4AB//+AAf//gAPwD4AD4A+AA+AP/8fAD//HwA//z4AP/8",
        "h": 24,
        "left": 0,
        "top": -24,
        "w": 30
      },
      "Ç": {
        "adv": 22,
        "data": "AP4AB//AD//AH//AP4OAfgCAfgAAfAAA/AAA+AAA+AAA+AAA+AAA+AAA+AAA/AAA/AAAfgAAfgAAP4HAP//AH//AB//AAf8AAHAAAHgAAPwAAB4AAB4AAf4AAfwAAfgA",
        "h": 32,
        "left": 2,
        "top": -24,
        "w": 18
      },
      "È": {
        "adv": 19,
        "data": "fgA/AB8AD4ADwAHgAAAAAAAA//z//P/8//z4APgA+AD4APgA//j/+P/4//j4APgA+AD4APgA+AD4AP/8//z//P/8",
        "h": 33,
        "left": 3,
        "top": -33,
        "w": 14
      },
      "É": {
        "adv": 19,
        "data": "APwA+AHwA+AHwA8AAAAAAAAA//z//P/8//z4APgA+AD4APgA//j/+P/4//j4APgA+AD4APgA+AD4AP/8//z//P/8",
        "h": 33,
        "left": 3,
        "top": -33,
        "w": 14
      },
      "Ê": {
        "adv": 19,
        "data": "B+AP4B/wPvh8fPgeAAAAAAAAf/5//n/+f/58AHwAfAB8AHwAf/x//H/8f/x8AHwAfAB8AHwAfAB8AH/+f/5//n/+",
        "h": 33,
        "left": 2,
        "top": -33,
        "w": 15
      },
      "Ë": {
        "adv": 19,
        "data": "PHA8+Dz4PHAAAAAAAAD//P/8//z//PgA+AD4APgA+AD/+P/4//j/+PgA+AD4APgA+AD4APgA//z//P/8//w=",
        "h": 31,
        "left": 3,
        "top": -32,
        "w": 14
      },
      "Ì": {
        "adv": 13,
        "data": "/AB+AD4AHwAHgAPAAAAAAAAA/+D/4P/gf+AfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAD/A/+D/4P/g",
        "h": 33,
        "left": 1,
        "top": -33,
        "w": 11
      },
      "Í": {
        "adv": 13,
        "data": "A/AD4AfAD4AfADwAAAAAAAAA/+D/4P/gf+AfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAD/A/+D/4P/g",
        "h": 33,
        "left": 1,
        "top": -33,
        "w": 12
      },
      "Î": {
        "adv": 13,
        "data": "B+AP4B/wPvh8fPgeAAAAAAAAP/g/+D/4H/gHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA/wP/g/+D/4",
        "h": 33,
        "left": -1,
        "top": -33,
        "w": 15
      },
      "Ï": {
        "adv": 13,
        "data": "eOB58HnweOAAAAAAAAD/4P/g/+B/4B8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AP8D/4P/g/+A=",
        "h": 31,
        "left": 1,
        "top": -32,
        "w": 12
      },
      "Ð": {
        "adv": 25,
        "data": "P/wAP/+AP//AP//gPgfwPgP4PgH4PgD8PgD8PgB8/+B8/+B8/+B8/+B8PgB8PgD8PgD8PgH4PgP4Pg/wP//gP//AP/8AP/gA",
        "h": 24,
        "left": 1,
        "top": -24,
        "w": 22
      },
      "Ñ": {
        "adv": 28,
        "data": "AeHAA/HAB//ABz+ADg8AAAAAAAAAAAAA/gB8/gB8/wB8/4B8/4B8/8B898B89+B88/B88/B8+fh8+Ph8+Px8+Hx8+H58+D98+B98+B/8+A/8+A/8+Af8+AP8+AP8+AH8",
        "h": 32,
        "left": 3,
        "top": -32,
        "w": 22
      },
      "Ò": {
        "adv": 27,
        "data": "B+AAA/AAAfAAAPgAADwAAB4AAAAAAAAAAAAAAf8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 33,
        "left": 2,
        "top": -33,
        "w": 23
      },
      "Ó": {
        "adv": 27,
        "data": "AA/AAA+AAB8AAD4AAHwAAPAAAAAAAAAAAAAAAf8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 33,
        "left": 2,
        "top": -33,
        "w": 23
      },
      "Ô": {
        "adv": 27,
        "data": "AH4AAP4AAf8AA++AB8fAD4HgAAAAAAAAAAAAAf8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 33,
        "left": 2,
        "top": -33,
        "w": 23
      },
      "Õ": {
        "adv": 27,
        "data": "AeHAA/HAB//ABz+ADg8AAAAAAAAAAAAAAf8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 32,
        "left": 2,
        "top": -32,
        "w": 23
      },
      "Ö": {
        "adv": 27,
        "data": "AeOAAefAAefAAeOAAAAAAAAAAAAAAf8AB//AD//wH//4P4P4fgD8fgD8fAB+/AB+/AB++AA++AA++AA++AA+/AB+/AB+fAB8fgD8fgD8P4P4H//wD//gB//AAf8A",
        "h": 31,
        "left": 2,
        "top": -32,
        "w": 23
      },
      "Ø": {
        "adv": 27,
        "data": "AAAgAf84B//4D//wH//wP4P4fgP8fgP8fAf+/A9+/B5++B4++Dw++Hg++Hg+/PB+/eB+feB8f8D8f4D8P4P4H//wH//gP//APf8AGAAA",
        "h": 26,
        "left": 2,
        "top": -25,
        "w": 23
      },
      "Ù": {
        "adv": 26,
        "data": "D8AAB+AAA+AAAfAAAHgAADwAAAAAAAAAAAAA+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw/APgfw/gf//AP/+AD/8AA/wA",
        "h": 33,
        "left": 3,
        "top": -33,
        "w": 20
      },
      "Ú": {
        "adv": 26,
        "data": "AB+AAB8AAD4AAHwAAPgAAeAAAAAAAAAAAAAA+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw/APgfw/gf//AP/+AD/8AA/wA",
        "h": 33,
        "left": 3,
        "top": -33,
        "w": 20
      },
      "Û": {
        "adv": 26,
        "data": "AfgAA/gAB/wAD74AHx8APgeAAAAAAAAAAAAA+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw/APgfw/gf//AP/+AD/8AA/wA",
        "h": 33,
        "left": 3,
        "top": -33,
        "w": 20
      },
      "Ü": {
        "adv": 26,
        "data": "B44AB58AB58AB44AAAAAAAAAAAAA+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+AHw+APw+APw/APgfw/gf//AP/+AD/8AA/wA",
        "h": 31,
        "left": 3,
        "top": -32,
        "w": 20
      },
      "Ý": {
        "adv": 21,
        "data": "AB+AAB8AAD4AAHwAAPgAAeAAAAAAAAAAAAAA/AH4fAHwfgPwPgPgPwfgHwfAH4/AD4+AB9+AB98AA/8AA/4AAfwAAfwAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgAAPgA",
        "h": 33,
        "left": 0,
        "top": -33,
        "w": 21
      },
      "Þ": {
        "adv": 21,
        "data": "+AAA+AAA+AAA+AAA//AA//wA//4A//8A+D8A+B+A+A+A+A+A+B+A+B+A+D8A//8A//4A//wA//AA+AAA+AAA+AAA+AAA+AAA",
        "h": 24,
        "left": 3,
        "top": -24,
        "w": 17
      },
      "ß": {
        "adv": 24,
        "data": "B/gAH/4Af/+Af/+A/h/A+A/A+AfA+A+A+B+A+D8A+HwA+PgA+PgA+PwA+P8A+H+A+B/g+Afg+APw+AHw+AHw+YPw+f/w+f/g+f/A+P8A",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 20
      },
      "à": {
        "adv": 21,
        "data": "H4AAD8AAB8AAA+AAAPAAAHgAAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 27,
        "left": 1,
        "top": -27,
        "w": 17
      },
      "á": {
        "adv": 21,
        "data": "AD8AAD4AAHwAAPgAAfAAA8AAAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 27,
        "left": 1,
        "top": -27,
        "w": 17
      },
      "â": {
        "adv": 21,
        "data": "A/AAB/AAD/gAH3wAPj4AfA8AAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 27,
        "left": 1,
        "top": -27,
        "w": 17
      },
      "ã": {
        "adv": 21,
        "data": "B4cAD8cAH/8AHP4AODwAAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 26,
        "left": 1,
        "top": -26,
        "w": 17
      },
      "ä": {
        "adv": 21,
        "data": "DxwADz4ADz4ADxwAAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 25,
        "left": 1,
        "top": -26,
        "w": 17
      },
      "å": {
        "adv": 21,
        "data": "AfAAA/gAAzgABxwABxwAAzgAA/gAAfAAAAAAAAAAB/gAH/4AP/8AH/8AHB+AAA+AAA+AB/+AH/+Af/+Afg+AfA+A/A+A/B+AfD+Af/+Af/eAP+eAD4eA",
        "h": 29,
        "left": 1,
        "top": -29,
        "w": 17
      },
      "æ": {
        "adv": 31,
        "data": "B/A/AB/8/8A////gH///8Bwf4/AAD4DwAA+A+A////g////4f///+H4PgAB8D4AA/B+AAPwfwBB8P+Bwf///8H/5//A/8P/wD8A/gA==",
        "h": 19,
        "left": 1,
        "top": -19,
        "w": 29
      },
      "ç": {
        "adv": 17,
        "data": "B/Af/D/8f/z+GPwA+AD4APgA+AD4APgA+AD8BP4cf/w//B/8B/ADgAPAB+AA8ADwD/AP4A/A",
        "h": 27,
        "left": 2,
        "top": -19,
        "w": 14
      },
      "è": {
        "adv": 20,
        "data": "PwAAH4AAD4AAB8AAAeAAAPAAAAAAAAAAB/AAH/wAP/4Af/8AfD8A+B8A+A+A//+A//+A//+A+AAA+AAA+AAA/AEAfgcAf/8AP/8AH/8AB/gA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 17
      },
      "é": {
        "adv": 20,
        "data": "AH4AAHwAAPgAAfAAA+AAB4AAAAAAAAAAB/AAH/wAP/4Af/8AfD8A+B8A+A+A//+A//+A//+A+AAA+AAA+AAA/AEAfgcAf/8AP/8AH/8AB/gA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 17
      },
      "ê": {
        "adv": 20,
        "data": "B+AAD+AAH/AAPvgAfHwA+B4AAAAAAAAAB/AAH/wAP/4Af/8AfD8A+B8A+A+A//+A//+A//+A+AAA+AAA+AAA/AEAfgcAf/8AP/8AH/8AB/gA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 17
      },
      "ë": {
        "adv": 20,
        "data": "HjgAHnwAHnwAHjgAAAAAAAAAB/AAH/wAP/4Af/8AfD8A+B8A+A+A//+A//+A//+A+AAA+AAA+AAA/AEAfgcAf/8AP/8AH/8AB/gA",
        "h": 25,
        "left": 2,
        "top": -26,
        "w": 17
      },
      "ì": {
        "adv": 10,
        "data": "/AB+AD4AHwAHgAPAAAAAAA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+AD4APgA+A",
        "h": 27,
        "left": -1,
        "top": -27,
        "w": 10
      },
      "í": {
        "adv": 10,
        "data": "D8APgB8APgB8APAAAAAAAHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 10
      },
      "î": {
        "adv": 10,
        "data": "D8AfwD/gffD4+PA8AAAAAAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfA",
        "h": 27,
        "left": -2,
        "top": -27,
        "w": 14
      },
      "ï": {
        "adv": 10,
        "data": "8cDz4PPg8cAAAAAAHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwAfAB8AHwA=",
        "h": 25,
        "left": -1,
        "top": -26,
        "w": 11
      },
      "ð": {
        "adv": 21,
        "data": "BAQABwwAD/4AD/wAA/gAB/gAD/wADz4ABD8AAB8AD+8AP/+Af/+Af/+A/B+A+A+A+A/A+A/A+A+A+A+A+A+A+A+A/j8Af/8AP/4AH/wAB/AA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 18
      },
      "ñ": {
        "adv": 22,
        "data": "Dw4AH44AP/4AOfwAcHgAAAAAAAAA8fgA9/4A9/8A//8A/j+A/B+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A",
        "h": 26,
        "left": 3,
        "top": -26,
        "w": 17
      },
      "ò": {
        "adv": 21,
        "data": "PwAAH4AAD4AAB8AAAeAAAPAAAAAAAAAAB/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 18
      },
      "ó": {
        "adv": 21,
        "data": "AH4AAHwAAPgAAfAAA+AAB4AAAAAAAAAAB/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 18
      },
      "ô": {
        "adv": 21,
        "data": "A/AAB/AAD/gAH3wAPj4AfA8AAAAAAAAAB/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 27,
        "left": 2,
        "top": -27,
        "w": 18
      },
      "õ": {
        "adv": 21,
        "data": "Dw4AH44AP/4AOfwAcHgAAAAAAAAAB/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 26,
        "left": 2,
        "top": -26,
        "w": 18
      },
      "ö": {
        "adv": 21,
        "data": "DxwADz4ADz4ADxwAAAAAAAAAB/AAH/wAP/4Af/8A/j8A/B+A+A+A+A+A+A+A+A/A+A+A+A+A+A+A/B+Afj8Af/8AP/4AH/wAB/AA",
        "h": 25,
        "left": 2,
        "top": -26,
        "w": 18
      },
      "ø": {
        "adv": 21,
        "data": "AAQAB/YAH/8AP/4Af/8A/j8A/D+A+H+A+P+A+O+A+e/A+8+A/4+A/4+A/x+Afj8Af/8AP/4Af/wAd/AAEAAA",
        "h": 21,
        "left": 2,
        "top": -20,
        "w": 18
      },
      "ù": {
        "adv": 22,
        "data": "PwAAH4AAD4AAB8AAAeAAAPAAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A+B+A+B+A/D+A//+Af/+Af++AH4eA",
        "h": 27,
        "left": 3,
        "top": -27,
        "w": 17
      },
      "ú": {
        "adv": 22,
        "data": "AH4AAHwAAPgAAfAAA+AAB4AAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A+B+A+B+A/D+A//+Af/+Af++AH4eA",
        "h": 27,
        "left": 3,
        "top": -27,
        "w": 17
      },
      "û": {
        "adv": 22,
        "data": "B+AAD+AAH/AAPvgAfHwA+B4AAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A+B+A+B+A/D+A//+Af/+Af++AH4eA",
        "h": 27,
        "left": 3,
        "top": -27,
        "w": 17
      },
      "ü": {
        "adv": 22,
        "data": "HjgAHnwAHnwAHjgAAAAAAAAA+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+A+B+A+B+A+B+A/D+A//+Af/+Af++AH4eA",
        "h": 25,
        "left": 3,
        "top": -26,
        "w": 17
      },
      "ý": {
        "adv": 19,
        "data": "AD8AAD4AAHwAAPgAAfAAA8AAAAAAAAAA/APgfAfgfAfAfgfAPg/APg+AHw+AHx+AHx8AD58AD74AB74AB/4AB/wAA/wAA/wAAfgAAfgAAfAAAfAAAfAAA+AAB+AAf8AAf8AAfwAAfgAA",
        "h": 35,
        "left": 0,
        "top": -27,
        "w": 19
      },
      "þ": {
        "adv": 22,
        "data": "+AAA+AAA+AAA+AAA+AAA+AAA+AAA+fgA+/wA//4A//8A/D8A+B+A+B+A+A+A+A+A+A+A+A+A+A+A+B+A/B+A/j8A//8A//4A//wA+fgA+AAA+AAA+AAA+AAA+AAA+AAA+AAA+AAA",
        "h": 34,
        "left": 3,
        "top": -26,
        "w": 17
      },
      "ÿ": {
        "adv": 19,
        "data": "B44AB58AB58AB44AAAAAAAAA/APgfAfgfAfAfgfAPg/APg+AHw+AHx+AHx8AD58AD74AB74AB/4AB/wAA/wAA/wAAfgAAfgAAfAAAfAAAfAAA+AAB+AAf8AAf8AAfwAAfgAA",
        "h": 33,
        "left": 0,
        "top": -26,
        "w": 19
      },
      "…": {
        "adv": 29,
        "data": "eB4PAPw/H4D8Px+A/D8fgPw/H4B4Hg8A",
        "h": 6,
        "left": 2,
        "top": -6,
        "w": 25
      },
      "�": {
        "adv": 34,
        "data": "AAEAAAABgAAAA8AAAAfgAAAP8AAAH/gAAD/8AABwDgAAwAcAAeAHgAPjg8AH/8PgD//D8B//h/g//wf8//4P/3/8P/4//H/8H/x/+A/8f/AH///gA///wAH8f4AA+D8AAHg+AAA4fAAAH/gAAA/wAAAH4AAAA8AAAAGAAA==",
        "h": 31,
        "left": 1,
        "top": -26,
        "w": 32
      }
    },
    "lineHeight": 47,
    "size": 34
  }
} as const satisfies Readonly<Record<string, PackedFont>>;

export const BITMAPS = {
  "book@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAABgB/gAAAAAAAAAAB/gB//AAAAAAAAAA//gB//+AAAAAAAAf//gB///8AAAAAAP///gB////4AAAAH////gB/////4P8H/////gB//////////////gB//////////////gB+f//////////+fgB+A//////////AfgB+AD////////wAfgB+AAP//////8AAfgB+AAAf////+AAAfgB+AAAB////gAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB+AAAAH//4AAAAfgB/8AAAH//4AAAP/gB//wAAH//4AAD//gB///AAH//4AA///gB///8AH//4AP///gB////4H//4H////gA/////n//5/////AAB////////////gAAAB//////////gAAAAAD////////wAAAAAAAH//////4AAAAAAAAAP////8AAAAAAAAAAAf//+AAAAAAAAAAAAAf+AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "charge-reminder@32": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//+AP///wD///+A4A4HgOAMB4DgPAf44H/H+OD/h/jh/wf44/4H+OA8B/jgMAeA4GAHgP///4D///8Af//+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    "h": 32,
    "w": 32
  },
  "closure-disagreement@32": {
    "data": "AAAAAAAAAAAAAYAAAAGAAAADwAAAA8AAAAfgAAAH8AAAD/AAAA/4AAAf+AAAP/wAAD/8AAB8PgAAfD4AAPw/AAD8PwAB/D+AAfw/wAP8P8AH/D/gB/w/4A////AP///wH/w/+B/8P/g//D/8P/w//n////7/////AAAAAAAAAAA=",
    "h": 32,
    "w": 32
  },
  "dress-up@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAGAAAAAAAAAB4AAAAHgAAAAAAAAH4AAAAH4AAAAAAAAf4AAAAH+AAAAAAAA/8AAAAP/AAAAAAAD/8AAAAP/wAAAAAAP/8AAAAP/8AAAAAA//+AAAAf//AAAAAD///AAAA///wAAAAH///AAAA///4AAAAf///gAAB///+AAAB////wAAD////gAAH////8AAP////4AAf////+AAf////+AA//////wD//////AD//////////////wD//////////////wB//////////////gB//////////////gA//////////////AAf////////////+AAf////////////+AAP////////////8AAP////////////8AAH////////////4AAD////////////wAAD////////////wAAB////////////gAAB////////////gAAA////////////AAAAf//////////+AAAAf+////////P+AAAAP4////////H8AAAAPw////////D8AAAAHg////////B4AAAADA////////AwAAAACA////////AQAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAA////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-breakfast@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAH//4AAAAAAAAAAAAH//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAH//8AAAAAAAAAAAAH//4AAAAAAAAAAAAD//wAAAAAAAA////////////AAAB////////////wAAD////////////4AAH////////////8AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP////////////8AAP////////////8AAH////////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////////////AA//////////////AB//////////////gB//////////////gB//////////////wB//////////////wB//////////////wB//////////////wB//////////////wB//////////////gB//////////////gA//////////////AAwAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////////4AAH////////////8AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP////////////8AAP////////////8AAH////////////4AAD////////////4AAB////////////wAAA////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-burger@96": {
    "data": "AAAAAAB//gAAAAAAAAAAAAf//+AAAAAAAAAAAH////4AAAAAAAAAAf////+AAAAAAAAAB//////gAAAAAAAAH//////4AAAAAAAAf//////+AAAAAAAA////////AAAAAAAB////////gAAAAAAH////////4AAAAAAP////////8AAAAAAf////////+AAAAAA//////////AAAAAB//////////gAAAAD//////////wAAAAH//////////4AAAAP//////////8AAAAP//////////8AAAAf//////////+AAAA////////////AAAA////////////AAAB//////4P////gAAB//////wH////gAAD//////wD////wAAD//////wD////wAAH//////4H////4AAH////////////4AAP///8H///////8AAP///4D///////8AAP///4D////A//8AAf///4D///+Af/+AAf///8H///+Af/+AAf/////////Af/+AAf/////////g//+AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AAAAAAAAAAAAAAAAAAP////////////8AA//////////////gB//////////////wD//////////////wD//////////////4D//////////////4D//////////////4D//////////////4D//////////////wD//////////////wB//////////////gA//////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//////////+AAAA////////////gAAD////////////wAAH////////////4AAH////////////4AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////8AAP////////////8AAH////////////8AAH////////////4AAD////////////wAAB////////////gAAA////////////AAAAH//////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-chicken@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAD//gAAAAAAAAAAAAf//8AAAAAAAAAAAB////AAAAAAAAAAAH////wAAAAAAAAAAf////8AAAAAAAAAA/////+AAAAAAAAAB//////AAAAAAAAAD//////gAAAAAAAAH//////wAAAAAAAAP//////4AAAAAAAAf//////8AAAAAAAA///////+AAAAAAAA///////+AAAAAAAB////////AAAAAAAB////////AAAAAAAD////////gAAAAAAD////////gAAAAAAH////////wAAAAAAH////////wAAAAAAH////////wAAAAAAP////////4AAAAAAP////////4AAAAAAP////////4AAAAAAP////////4AAAAAAP////////4AAAAAAf////////8AAAAAAf////////8AAAAAAf////////8AAAAAA/////////8AAAAAB/////////8AAAAAD/////////4AAAAAH/////////4AAAAAP/////////4AAAAAf/////////4AAAAAf/////////4AAAAA//////////wAAAAA//////////wAAAAB//////////wAAAAB//////////gAAAAB//////////gAAAAD//////////AAAAAD//////////AAAAAD/////////+AAAAAD/////////+AAAAAD/////////8AAAAAD/////////4AAAAAD/////////wAAAAAD/////////gAAAAAD/////////AAAAAAD////////+AAAAAAB/5//////8AAAAAAB/x//////wAAAAAAB/h//////AAAAAAAA/D/////8AAAAAAAA+H/////gAAAAAAAAcP////wAAAAAAAAAef///+AAAAAAAB/A/////8AAAAAAAH/x/////4AAAAAAAP///////wAAAAAAAf///////gAAAAAAA////////AAAAAAAA///////8AAAAAAAA//+////4AAAAAAAB///fwf/AAAAAAAAB///PgAAAAAAAAAAB///HAAAAAAAAAAAB///zAAAAAAAAAAAA///+AAAAAAAAAAAA////AAAAAAAAAAAA////gAAAAAAAAAAAf///wAAAAAAAAAAAP///wAAAAAAAAAAAH///4AAAAAAAAAAAB///4AAAAAAAAAAAAP//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAD//wAAAAAAAAAAAAD//wAAAAAAAAAAAAB//gAAAAAAAAAAAAA//AAAAAAAAAAAAAAf+AAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-corn-dog@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAD//4AAAAAAAAAAAAP//4AAAAAAAAAAAA///AAAAAAAAAAAAB//wAAAAAAAAAAAAD/8AD4AAAAAAAAAAH/AA/8AAAAAAAAAAPwAP/8AAAAAAAAAAcAD//+AAAAAAAAAAAA////AAAAAAAAAAAP////gAAAAAAAAAD/////gAAAAAAAAA//////wAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAD/////8YAAAAAAAAH/////AYAAAAAAAAH////wAYAAAAAAAAH///8AD4AAAAAAAAH///AA/4AAAAAAAAH//gAP/4AAAAAAAAH/4AD//4AAAAAAAAH+AB///4AAAAAAAAHgAf///4AAAAAAAAGAH////4AAAAAAAAGB/////4AAAAAAAAGf/////4AAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAH/////+YAAAAAAAAH/////gYAAAAAAAAH////4AYAAAAAAAAH///+AB4AAAAAAAAH///gAf4AAAAAAAAH//4AH/4AAAAAAAAH/+AB//4AAAAAAAAH/gAf//4AAAAAAAAH4AH///4AAAAAAAAGAB////4AAAAAAAAGAf////4AAAAAAAAGH/////4AAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAH/////4YAAAAAAAAH////+AYAAAAAAAAH////gAYAAAAAAAAH///4AH4AAAAAAAAH//8AB/4AAAAAAAAH//AAf/4AAAAAAAAH/wAH//4AAAAAAAAH8AD///4AAAAAAAAHAA////4AAAAAAAACAP////4AAAAAAAACD/////wAAAAAAAACf/////wAAAAAAAAB//////wAAAAAAAAB//////gAAAAAAAAA//////gAAAAAAAAA//////AAAAAAAAAAf////+AAAAAAAAAAP////8AAAAAAAAAAH////8AAAAAAAAAAD////4AAAAAAAAAAB////gAAAAAAAAAAA////AAAAAAAAAAAAP//+AAAAAAAAAAAAD//4AAAAAAAAAAAAA//AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-hot-dog@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//////////wAAAAP//////////8AAAAf//////////+AAAA////////////AAAB/f/+3//t//7/gAAB+P/8D//A//x/wAAD8H/4B/+Af/g/wAAD8B/wA/8AP/A/wAAD+A/gAf4AH+B/4AAH/AfAwPwMD8D/4AAH/gOB4HgeB4H/4AAH/wED8DA/AwP/4AAH/4AH+AB/gAf/4AAH/8AP/AD/wA//4AAH//Af/gH/4B//4AAH//k//wP/8D//8AAP////////////+AAf////////////+AA//////////////AA//////////////AA//////////////AA//////////////gA//////////////gA//////////////AA//////////////AA//////////////AAf////////////+AA//////////////AA//////////////AB//////////////gB//////////////wD//////////////wD//////////////wD//////////////wD//////////////4D//////////////4D//////////////4D//////////////wD//////////////wD//////////////wB//////////////gB//////////////gA//////////////AAf/////////////AAP////////////+AAH////////////4AAD////////////wAAAf///////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-pasta@96": {
    "data": "AAAAAH////4AAAAAAAAAAf////+AAAAAAAAAA//wD//AAAAAAAAAB/8AAP/gAAAAAAAAD/wAAD/wAAAAAAAAH/AAAA/4AAAAAAAAP8AAAAP8AAAAAAAAf4ADwAH+AAAAAAAA/wD//wD/AAAAAAAA/gP//8B/AAAAAAAB/A////A/gAAAAAAD+D////wfwAAAAAAD+P////8fwAAAAAAH8f/8P/+P4AAAAAAH4/+AAf/H4AAAAAAH5/4AAH/n4AAAAAAPz/gAAB/z8AAAAAAP3+AAAAf78AAAAAAP/8AAAAP/8AAAAAAP/4Af+AH/8AAAAAAf/wH//4D/+AAAAAAf/gf//+B/+AAAAAAf/h////h/+AAAAAAf/D////w/+AAAAAAf+P//////+AAAAAAD+f/gB///wAAAAAAD8/8AAP//wAAAAAAD9/wAAP//wAAAAAAD//gAAf//wAAAAAAH/+AAA///4AAAAAAH/8AAA///4AAAAAAH/4AAB///4AAAAAAH/4AAB///4AAAAAAH/wAAB///4AAAAAAH/gAAB///4AAAAAAAfgAAB///wAAAAAAA/AAAB///wAAAAAAA/AAAB///wAAAAAAA/AAAB///gAAAAAAB+AAAA///gAAAAAAB+AAAAf//gAAAAAAB+AAAAf//gAAAAAAB+AAAAP//gAAAAAAB+AAAAD//gAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////AA//////////////AAf////////////+AAf////////////+AAP////////////8AAP////////////8AAH////////////4AAH////////////4AAD////////////wAAD////////////wAAB////////////gAAB////////////gAAA////////////AAAA////////////AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAP//////////8AAAAP//////////8AAAAH//////////4AAAAH//////////4AAAAD//////////wAAAAD//////////wAAAAB//////////gAAAAB//////////gAAAAA//////////AAAAAA//////////AAAAAAf////////+AAAAAAf////////+AAAAAAP////////8AAAAAAP////////8AAAAAAH////////4AAAAAAH////////4AAAAAAD////////wAAAAAB//////////wAAAAH//////////4AAAAP//////////8AAAAP//////////+AAAAf//////////+AAAAP//////////+AAAAP//////////8AAAAH//////////4AAAAB//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-pizza@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////////4AAf////////////+AA//////////////AB//////////////gD//////////////wD//////////////wD//////////////4D//////////////4D//////////////4D//////////////4D//////////////4D//////////////wD//////////////wB//////////////gA//////////////AAf////////////+AAD////////////wAAB////////////gAAB////////////gAAA////////////AAAA////////////AAAAf//////////+AAAAP/+D////g//8AAAAP/4A///+AP/8AAAAH/wAf//8AH/4AAAAH/gAP//4AD/4AAAAD/gAP//4AD/wAAAAD/gAH//wAD/wAAAAB/AAH//wAB/gAAAAA/AAH//wAB/AAAAAA/AAH//wAB/AAAAAAfgAH//wAD+AAAAAAfgAP//4AD+AAAAAAPwAP//4AH8AAAAAAHwAf//8AH4AAAAAAH8A///+Af4AAAAAAD/H////x/wAAAAAAD////////wAAAAAAB////////gAAAAAAA////////gAAAAAAA////////AAAAAAAAf//////+AAAAAAAAf//////+AAAAAAAAP//+f//8AAAAAAAAP//wD//8AAAAAAAAH//gB//4AAAAAAAAD//AA//wAAAAAAAAD/+AAf/wAAAAAAAAB/+AAf/gAAAAAAAAB/+AAf/gAAAAAAAAA/+AAf/AAAAAAAAAAf+AAf/AAAAAAAAAAf+AAf+AAAAAAAAAAP+AAf8AAAAAAAAAAP/AA/8AAAAAAAAAAH/gB/4AAAAAAAAAAH/wD/4AAAAAAAAAAD/+f/wAAAAAAAAAAB////gAAAAAAAAAAB////gAAAAAAAAAAA////AAAAAAAAAAAA////AAAAAAAAAAAAf//+AAAAAAAAAAAAP//+AAAAAAAAAAAAP//8AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAD//wAAAAAAAAAAAAB//wAAAAAAAAAAAAB//gAAAAAAAAAAAAA//AAAAAAAAAAAAAA//AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAH8AAAAAAAAAAAAAAH4AAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAABgAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-salad@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAD//wAAAAAAAAAAAAH//4AAAAAAAAAAAAf//+AAAAAAAAAAAA////AAAAAAAAAAAB////gAAAAAAAAAAD////wAAAAAAAAAAH////4AAAAAAAAAAH////4AAAAAAAAAAP/8P/8AAAAAAAAD8P/gB/8PwAAAAAAf//+AAf//+AAAAAB///8AAP///gAAAAD///4AAH///wAAAAH///wAAD///4AAAAP///wAAD///8AAAAf///gAAB///+AAAA////gAAB////AAAA////gAAB////AAAB////AAAA////gAAB////AAAA////gAAB////AAAA////gAAB////AAAA////gAAD////gAAB////wAAD////gAAB////wAAD////gAAB////wAAD////wAAD////wAAB////wAAD////gAAB////4AAH////gAAB////8AAP////gAAA/////AA/////AAAA/////gB/////AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAD//8AAAAP//wAAAAA//wAAAAD//AAAAAAP/AAAAAA/8AAAAAAAAAAAAAAAAAAAP//////////////8P//////////////8P//////////////8P//////////////8P//////////////8P//////////////8P//////////////8P//////////////8AAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAD//////////wAAAAD//////////wAAAAD//////////wAAAAB//////////gAAAAA//////////AAAAAA//////////AAAAAAf////////+AAAAAAf////////+AAAAAAP////////8AAAAAAH////////4AAAAAAD////////wAAAAAAB////////gAAAAAAA////////AAAAAAAAf//////+AAAAAAAAP//////8AAAAAAAAH//////4AAAAAAAAD//////wAAAAAAAAA//////AAAAAAAAAAP////8AAAAAAAAAAD////wAAAAAAAAAAD////wAAAAAAAAAAD////wAAAAAAAAAAD////wAAAAAAAAAAD////wAAAAAAAAAAD////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-sandwich@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////////8AAAA////////////gAAD////////////wAAH////////////4AAH////////////8AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP////////////8AAP////////////8AAP////////////8AAH////////////4AAD////////////wAAB////////////gAAAf///////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgBgBgBgBgBgBwBwP4P4P4H8H8H8H8H8f8f+f+f+f+P+P+P+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f+/+/+f/f/f/f/f/P8f8f8P+P+P+P+P+H4H4H4H4H4H4H8H8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AA//////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//////////+AAAB////////////gAAD////////////wAAH////////////4AAH////////////8AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP////////////8AAP////////////8AAH////////////8AAH////////////4AAD////////////wAAB////////////gAAAf//////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-taco@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8APgB8APwAAAAAAP/B/8P/g/8AAAAAA//z/+f/z//AAAAAB//////////gAAAAD//////////wAAAAH//////////4AAAAH//////////4AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAP////////////8AAf////////////+AAf////////////+AAP////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////////////4AAH////////////4AAH////////////4AAH////////////4AAH////////////4AAD////////////wAAD////////////wAAD////////////wAAB////////////gAAB////////////gAAA////////////AAAA////////////AAAAf//////////+AAAAP//////////8AAAAP//////////8AAAAH//////////4AAAAD//////////wAAAAD//////////wAAAAB//////////gAAAAA//////////AAAAAAf////////+AAAAAAP////////8AAAAAAH////////4AAAAAAD////////wAAAAAAA////////AAAAAAAAf//////+AAAAAAAAH//////4AAAAAAAAD//////wAAAAAAAAA//////AAAAAAAAAAH////4AAAAAAAAAAB////gAAAAAAAAAAAH//4AAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "food-unknown@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA454AAAAAAAAAAAAA554AAAAAAAAAPAAA554AAAAAAAAAPwAA554AAAAAAAAAP8AA554AAA//AAAAP/AA554AAH//4AAAP/AA554AA////AAAP/AA554AD////wAAP/AA554AP////8AAP/AA554Af////+AAP/AA554A//4H//AAP/AA554B/+AAf/gAP/AA554D/wAAD/wAP/AA554H/AAAA/4AP/AA554P+AAAAf8AP/AA554f8AAAAP+AP/AA554/wAAAAD/AP/AB//5/gAAAAB/gP/AB//5/gAAAAB/gP/AB//7/AAAAAA/wP/AB//7+AADwAAfwP/AB///8AAf+AAP4P/AB///8AB//gAP4P/AB///4AD//wAH4P/AB///4AH//4AH8P/AB///4AP//8AH8P/AAD4PwAf//+AD8P/AAD4fwAf//+AD+P/AAD4fwA////AD+P/AAD4fwA////AD+P/AAD4fgA////AB+P/AAD4fgB////gB+P/AAD4fgB////gB+P/AAD4fgB////gB+D8AAD4fgB////gB+D4AAD4fgA////AB+D4AAD4fwA////AD+D4AAD4fwA////AD+D4AAD4fwAf//+AD+D4AAD4PwAf//+AD8D4AAD4P4AP//8AH8D4AAD4P4AH//4AH8D4AAD4H4AD//wAH4D4AAD4H8AB//gAP4D4AAD4H8AAf+AAP4D4AAD4D+AADwAAfwD4AAD4D/AAAAAA/wD4AAD4B/gAAAAB/gD4AAD4B/gAAAAB/gD4AAD4A/wAAAAD/AD4AAD4Af8AAAAP+AD4AAD4AP+AAAAf8AD4AAD4AH/AAAA/4AD4AAD4AD/wAAD/wAD4AAD4AB/+AAf/gAD4AAD4AA//4H//AAD4AAD4AAf////+AAD4AAD4AAP////8AAD4AAD4AAD////wAAD4AAD4AAA////AAAD4AAD4AAAH//4AAAD4AAD4AAAA//AAAAD4AAD4AAAAAAAAAAD4AAD4AAAAAAAAAAD4AAD4AAAAAAAAAAD4AAD4AAAAAAAAAAD4AAD4AAAAAAAAAAD4AABwAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "minimum-day@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAf+AAAAAAAAAAAAAA//AAAAAAAAAAAAAA//gAAAAAAAAAAAAB//gAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAH//////4AAAAAAAAf//////+AAAAAAAB////////gAAAAAAH////////4AAAAAAP////////8AAAAAAf////////+AAAAAA//////////AAAAAA//////////gAAAAB//////////gAAAAD//////////wAAAAD//////////wAAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////AAAAAAAAP//////+AAAAAAAAP//////4AAeAAAAAP//////wAH/4AAAAP//////gA///AAAAP//////gD///gAAAP//////AH///4AAAP//+AAAAP/h/8AAAP//4AAAAf4AH+AAAP//4AAAA/gAB/AAAP//wAAAB/A+A/gAAP//wAAAD+A+AfgAAP//wAAAD8A+APwAAP//wAfwH4A+AHwAAP//wAfwHwA+AH4AAP//wAfwHwA+AD4AAP//wAfgPgA+AD8AAP//wAAAPgA+AB8AAP//wAAAPgA+AB8AAP//wAAAPgA+AB8AAP//wAAAfAA/AB8AAH//wAAAfAA/gB8AAH//wAAAfAAP4B8AAH//wAAAfAAP+B8AAH//wAAAPgAH/h8AAD//wAAAPgAB/x8AAD//wAAAPgAAfh8AAB//4AAAPgAAHj4AAB//4AAAHwAABD4AAA//8AAAHwAAAH4AAAf//AAAH4AAAHwAAAP////4D8AAAPwAAAH////4B+AAAfgAAAD////8B/AAA/AAAAA////8A/wAD/AAAAAP///+Af8AP+AAAAAA///+AP///8AAAAAAAAAAAH///wAAAAAAAAAAAB///gAAAAAAAAAAAAf/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "no-school@128": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAB/4AAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAAAAAAAf/4AAAAAAAAAAAAAAAAAAP//AAAAAAAAAAAAAAAAAAH//4AAAAAAAAAAAAAAAAAD///AAAAAAAAAAAAAAAAAB///8AAAAAAAAAAAAAAAAB////gAAAAAAAAAAAAAAAA////8AAAAAAAAAAAAAAAAf////gAAAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAAH/////gAAAAAAAAAAAAAAD/////8AAAAAAAAAAAAAAB//////wAAAAAAAAAAAAAB//////+AAAAAAAAAAAAAA///////wAAAAAAAAAAAAAf//////+AAAAAAAAAAAAAP///////wAAAAAAAAAAAAH///////+AAAAAAAAAAAAD////////wAAAAAAAAAAAB/////////AAAAAAAAAAAB/////////4AAAAAAAAAAA//////////AAAAAAAAAAAf/////////4AAAAAAAAAAP//////////AAAAAAAAAAH//////////4AAAAAAAAAD///////////AAAAAAAAAB///////////8AAAAAAAAB////////////gAAAAAAAA////////////8AAAAAAAAf////////////gAAAAAAAP////////////8AAAAAAAH/////////////gAAAAAAD/////////////8AAAAAAD//////////////wAAAAAB//////////////+AAAAAA///////////////wAAAAAf//////////////+AAAAAP///////////////wAAAAH///////////////+AAAAD////////////////wAAAD/////////////////AAAB/////////////////4AAA//////////////////AAAf/////////////////4AAP//////////////////AAH//////////////////4AD///////////////////AD///////////////////8AAAf//////////////+AAAAAD///////////////AAAAAA///////////////wAAAAAP//////////////8AAAAAD///////////////AAAAAA///////////////wAAAAAP//////////////8AAAAAD///////////////AAAAAA///////////////wAAAAAP//////////////8AAAAAD/4AAf/////4AAf/AAAAAA/+AAH/////+AAH/wAAAAAP/gAB//////gAB/8AAAAAD/4AAf/////4AAf/AAAAAA/+AAH/////+AAH/wAAAAAP/gAB//////gAB/8AAAAAD/4AAf/////4AAf/AAAAAA/+AAH/////+AAH/wAAAAAP/gAB/wAAD/gAB/8AAAAAD/4AAf8AAA/4AAf/AAAAAA/+AAH/AAAP+AAH/wAAAAAP/gAB/wAAD/gAB/8AAAAAD/4AAf8AAA/4AAf/AAAAAA/+AAH/AAAP+AAH/wAAAAAP/gAB/wAAD/gAB/8AAAAAD/8AAf8AAA/4AA//AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAP/////wAAD/////8AAAAAD/////8AAA//////AAAAAA//////AAAP/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    "h": 128,
    "w": 128
  },
  "no-school@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAADwAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAP+AAAAAAAAAAAAAA//AAAAAAAAAAAAAB//gAAAAAAAAAAAAD//wAAAAAAAAAAAAH//4AAAAAAAAAAAAP//8AAAAAAAAAAAAf///AAAAAAAAAAAB////gAAAAAAAAAAD////wAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAB//////wAAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAf//////+AAAAAAAA////////AAAAAAAB////////gAAAAAAD////////wAAAAAAH////////8AAAAAAf////////+AAAAAA//////////AAAAAB//////////gAAAAD//////////wAAAAH//////////4AAAAP//////////8AAAAf//////////+AAAB////////////gAAD////////////wAAH////////////4AAP////////////8AAf////////////+AA//////////////AB//////////////gH//////////////4AAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf//////////+AAAAf8AD////wAP+AAAAf8AD////wAP+AAAAf8AD////wAP+AAAAf8AD////wAP+AAAAf8AD////wAP+AAAAf8AD+AAfwAP+AAAAf8AD8AAPwAP+AAAAf8AD8AAPwAP+AAAAf8AD8AAPwAP+AAAAf8AD8AAPwAP+AAAAf8AD8AAPwAP+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAf///8AAP///+AAAAP///8AAP///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "party@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAD//wAAAAAAAAAAAAf//+AAAAAAAAAAAB////gAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAA//////AAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAf//////+AAAAAAAA////////AAAAAAAA////////AAAAAAAB////////gAAAAAAB////////gAAAAAAD////////wAAAAAAD////////wAAAAAAH////////4AAAAAAH////////4AAAAAAP////////8AAAAAAP////////8AAAAAAP////////8AAAAAAP////////8AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAf////////+AAAAAAP////////8AAAAAAP////////8AAAAAAP////////8AAAAAAP////////8AAAAAAH////////4AAAAAAH////////4AAAAAAD////////wAAAAAAD////////wAAAAAAB////////gAAAAAAB////////gAAAAAAA////////AAAAAAAA////////AAAAAAAAf//////+AAAAAAAAP//////8AAAAAAAAH//////4AAAAAAAAD//////wAAAAAAAAB//////gAAAAAAAAA//////AAAAAAAAAAP////8AAAAAAAAAAH////4AAAAAAAAAAB////gAAAAAAAAAAAf//+AAAAAAAAAAAAD//wAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAD4AAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAABzwAAAAAAAAAAAAAB/wAAAAAAAAAAAAAB/wAAAAAAAAAAAAAAfwAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAHwAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAB8AAAAAAAAAAAAAAB4AAAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "reauth-needed@32": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAfwAAAP+AAAH/wAAD58AAA8P//+PB///jwf//48P//+PnwHnh/8B54P+AeeB/AHngGAB54AAAeAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
    "h": 32,
    "w": 32
  },
  "school@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAf+AAAAAAAAAAAAAA//AAAAAAAAAAAAAA//gAAAAAAAAAAAAB//gAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB8PgAAAAAAAAAAH//////4AAAAAAAAf//////+AAAAAAAB////////gAAAAAAH////////4AAAAAAP////////8AAAAAAf////////+AAAAAA//////////AAAAAA//////////gAAAAB//////////gAAAAD//////////wAAAAD//////////wAAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//////////8AAAAP//+AAAAP//8AAAAP//4AAAAH//8AAAAP//4AAAAD//8AAAAP//wAAAAD//8AAAAP//wAAAAD//8AAAAP//wAAAAD//8AAAAP//wAf+AD//8AAAAP//wAf+AD//8AAAAP//wAf+AD//8AAAAP//wAf+AD//8AAAAP//wAAAAD//8AAAAP//wAAAAD//8AAAAP//wAAAAD//8AAAAP//wAAAAD//8AAAAH//wAAAAD//8AAAAH//wAAAAD//4AAAAH//wAAAAD//4AAAAH//wAAAAD//4AAAAD//wAAAAD//4AAAAD//wAAAAD//wAAAAB//4AAAAD//wAAAAB//4AAAAH//gAAAAA//8AAAAP//AAAAAAf//AAAA//+AAAAAAP////////8AAAAAAH////////4AAAAAAD////////wAAAAAAA////////AAAAAAAAP//////8AAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "sports@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAB/AAAAAAAAAAAAAAD/AAAAAAAAAAAAAPn/nwAAAAAAAAAAAf3/v4AAAAAAAAAAA////8AAAAAAAAAAA////+AAAAAAAAAAA////+AAAAAAAAAAA/9/f+AAAAAAAAAAA/4+f+AAAAAAAAAAAf7//8AAAAAAAAAAAf///4AAAAAAAAAAAH///gAAAAAAAAAAAB///gAAAAAAAAAAAD///wAAAAAAAAAAAH///4AAAAAAAAAAAP///8AAAAAAAAAAAf///+AAAAAAAAAAAf///+AAAAAAAAAAA/////AAAAAAAAAAA/////AAAAAAAAAAA/////gAAAAAAAAAB/////gAAAAAAAAAB/////gAAAAAAAAAB/////gAAAAAAAAAB/////gAAAAAAAAAB/////gAAAAA8AAAB/////gAAAAD+AAAB/////gAAAAD/AAAB/////gAAAPn/nwAB/////gAAAf3/v4AB/////gAAA////8AB/////gAAA////8AB/////gAAB////+AAP///8AAAB/5+f+AAH///8AAAA/4+f8AAD///4AAAA////8AAB///wAAAAf///4AAA///AAAAAH///gAAAf/+AAAAAD///gAAAP/8AAAAAH///wAAAf//AAAAAP///4AAA///gAAAAP///8AAB///gAAAAf///+AAD///wAAAAf///+AAD///wAAAA/////AAH///4AAAA/////AAH///4AAAB/////AAH///4AAAB/////gAH///4AAAB/////gAH///4AAAB/////gAH///4AAAB/////gAH///4AAAB/////gAH///4AAAB/////gAD///wAAAB/////gAD///wAAAB/////gAB///gAAAB/////gAB///gAAAB/////gAA///AAAAB/////gAAf/+AAAAB/////gAAH/4AAAAAP///8AAAB/gAAAAAP///4AAAAAAAAAAAH///wAAAAAAAAAAAD///gAAAAAAAAAAAA///AAAAAAAAAAAAAf/+AAAAAAAAAAAAAP/8AAAAAAAAAAAAA//+AAAAAAAAAAAAB///AAAAAAAAAAAAB///gAAAAAAAAAAAD///wAAAAAAAAAAAD///wAAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAH///4AAAAAAAAAAAD///wAAAAAAAAAAAD///wAAAAAAAAAAAB///gAAAAAAAAAAAB///gAAAAAAAAAAAA///AAAAAAAAAAAAAf/+AAAAAAAAAAAAAH/4AAAAAAAAAAAAAB/gAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "stale@32": {
    "data": "AAAAAAAAAAAAA8AAAB/4AAB//gAB//+AA/APwAfBg+AHg8HgDwPA8A4DwHAeA8B4HAPAOBwDwDg8A8A8PAPAPDwB+Dw8AP48HAB/OBwADjgeAAB4DgAAcA8AAPAHgAHgB8AD4APwD8AB//+AAH/+AAAf+AAAA8AAAAAAAAAAAAA=",
    "h": 32,
    "w": 32
  },
  "star@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAABgAAAAAAAAAAAAAABgAAAAAAAAAAAAAABwAAAAAAAAAAAAAADwAAAAAAAAAAAAAADwAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH8AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAP+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAA//AAAAAAAAAAAAAA//AAAAAAAAAAAAAA//AAAAAAAAAAAAAB//gAAAAAAAAAAAAB//gAAAAAAAAAAAAB//wAAAAAAAAAAAAD//wAAAAAAAAAAAAD//wAAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAP//8AAAAAAAAAAAAP//8AAAAAAAAAAAAP//+AAAAAAAAAAAAf//+AAAAAAAAAAAAf//+AAAAAAAAAAAf////+AAAAAAD////////////wAB//////////////gA//////////////AAf////////////+AAH////////////4AAD////////////wAAB////////////gAAA////////////AAAAP//////////8AAAAH//////////4AAAAD//////////wAAAAB//////////gAAAAAf////////+AAAAAAP////////8AAAAAAH////////4AAAAAAB////////gAAAAAAA////////AAAAAAAAf//////+AAAAAAAAP//////8AAAAAAAAD//////wAAAAAAAAB//////gAAAAAAAAB//////gAAAAAAAAB//////gAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAf//8P//+AAAAAAAAf//4H//+AAAAAAAAf//gB//+AAAAAAAAf//AA//+AAAAAAAA//8AAP//AAAAAAAA//4AAH//AAAAAAAA//gAAB//AAAAAAAB//AAAA//gAAAAAAB/8AAAAP/gAAAAAAB/4AAAAH/gAAAAAAB/gAAAAB/gAAAAAAD/AAAAAA/wAAAAAAD8AAAAAAPwAAAAAAD4AAAAAAHwAAAAAADgAAAAAABwAAAAAAHAAAAAAAA4AAAAAAEAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "tomorrow@32": {
    "data": "AAAAAAAH4AAAP/gAAP+AAAH+AAAD+AAAB/AAAA/gAAAf4AAAH8AAAD/AAAA/gAAAP4AAAH+AAAB/AAAAfwAAAH8AAAB/AAAAf4AAAD+AAAA/gAAAP8AAAB/AAAAf4AAAD+AAAAfwAAAD+AAAAf4AAAD/gAAAP/gAAAfgAAAAAAA=",
    "h": 32,
    "w": 32
  },
  "unknown@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////////gAAAAAAf////////+AAAAAB//////////gAAAAD//////////wAAAAH//////////8AAAAP//////////+AAAAf///////////AAAA/+AAAAAAAAf/AAAB/wAAAAAAAAD/gAAB/gAAAAAAAAB/gAAD/AAAAAAAAAA/wAAD+AAAAAAAAAAfwAAD+AAAAAAAAAAfwAAD+AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAf8AAAAP4AAH8AAAH//gAAAP4AAH8AAA///4AAAP4AAH8AAD///8AAAP4AAH8AAD///+AAAP4AAH8AAB///+AAAP4AAH8AAB////AAAP4AAH8AAA/4f/AAAP4AAH8AAA+AH/gAAP4AAH8AAAYAD/gAAP4AAH8AAAAAD/gAAP4AAH8AAAAAD/gAAP4AAH8AAAAAD/gAAP4AAH8AAAAAD/AAAP4AAH8AAAAAH/AAAP4AAH8AAAAAP/AAAP4AAH8AAAAAf+AAAP4AAH8AAAAA/8AAAP4AAH8AAAAD/4AAAP4AAH8AAAAH/wAAAP4AAH8AAAAP/gAAAP4AAH8AAAAf/AAAAP4AAH8AAAAf8AAAAP4AAH8AAAA/4AAAAP4AAH8AAAA/wAAAAP4AAH8AAAA/wAAAAP4AAH8AAAA/wAAAAP4AAH8AAAA/wAAAAP4AAH8AAAA/wAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAAAAAAAP4AAH8AAAAPAAAAAP4AAH8AAAA/wAAAAP4AAH8AAAB/4AAAAP4AAH8AAAB/4AAAAP4AAH8AAAB/4AAAAP4AAH8AAAB/4AAAAP4AAH8AAAB/4AAAAP4AAH8AAAB/4AAAAP4AAH8AAAA/wAAAAP4AAH8AAAAfgAAAAP4AAH8AAAAAAAAAAP4AAD+AAAAAAAAAAP4AAD+AAAAAAAAAAfwAAD+AAAAAAAAAAfwAAD/AAAAAAAAAA/wAAB/gAAAAAAAAB/gAAB/wAAAAAAAAD/gAAA/8AAAAAAAAP/AAAAf///////////AAAAf//////////+AAAAP//////////8AAAAH//////////4AAAAB//////////gAAAAAf////////+AAAAAAD////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-cloud@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAH//4AAAAAAAAAAAAf//+AAAAAAAAAAAB////gAAAAAAAAAAD////wAAAAAAAAAAP////8AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAf//////+AAAAAAAAf//////+AAAAAAAD///////+AAAAAAAf////////AAAAAAB/////////AAAAAAH/////////4AAAAAP//////////AAAAA///////////wAAAB///////////4AAAD///////////8AAAD///////////+AAAH////////////AAAP////////////gAAP////////////wAAf////////////wAAf////////////4AAf////////////4AA/////////////8AA/////////////8AA/////////////8AA/////////////+AA/////////////+AA/////////////+AA/////////////+AA/////////////+AA/////////////+AA/////////////+AA/////////////8AAf////////////8AAf////////////8AAf////////////8AAP////////////4AAP////////////4AAH////////////wAAD////////////gAAD////////////gAAB////////////AAAA///////////+AAAAP//////////8AAAAH//////////wAAAAB//////////AAAAAAf/4AAAAD/8AAAAAAD/AAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-cold@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAf+AAAAAAAAAAAAAA//AAAAAAAAAAAAAB//gAAAAAAAAAAAAD//wAAAAAAAAAAAAD//wAAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAH//4AAAAAAAAAAAAD//wAAAAAAAAAAAAD//wAAAAAAAAAAAAB//gAAAAAAAAAAAAA//AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAf+AAAAAAAAAAAAAA//AAAAAAAAAAAAAP//8AAAAAAAAAAAB////gAAAAAAAAAAH////4AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAf//////+AAAAAAAA////////AAAAAAAB////////gAAAAAAD////////wAAAAAAH////////4AAAAAAH////////4AAAAAAP////////8AAAAAAP////////8AAAAAAf////////+AAAAAA//////////AAAAAA//////////AAAAAA//////////AAAAAB//////////gAAAAB//////////gAAAAB//////////gAAAAD//////////wAAAAD//////////wAAAAD//////////wAAAAD//////////wAAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAH//////////4AAAAf//////////+AAAA////////////AAAB////////////gAAD//4//8P//H//wAAD//4f/8P/+H//4AAH//4f/8P/+H//4AAH//4f/8P/+H//4AAH//4f/8P/+H//8AAH//4f/8P/+H//8AAH//4f/8P/+H//8AAH//4f/8P/+H//8AAH//4f/8P/+H//8AAH//4f/8P/+H//4AAH//4f/8P/+H//4AAH//4f/8P/+H//4AAD//4f/8P/+H//wAAB////////////wAAB////////////gAAAf///////////AAAAP//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-hot@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAYPAAAAAAAAAAAAAA8fgAAAAAAAAAAAAB+/wAAAAAAAAAAAAD//4AAAAAAAAAAAAH//8AAAAAAAAAAAAP/f+AAAAAAAAAAAAf+P+D//+AAAAf//wf8H8f///wAAD///+P4D5////8AAP////nwBz////+AAf////zgAD/////AAf////4AAH/////AA/////4AAP////////////8AAP////////////8AAP////////////8AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP////////////+AAP/////wD/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////wB/////+AAP/////gB/////8AAP/////gB/////8AAP/////gB/////8AAH/////AA/////4AAD/////AAf////4AAD////+AAf////wAAA////8AAH////gAAAf///wAAD///+AAAAD//+AAAAf//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-partly-cloudy@96": {
    "data": "AAAAAAAAAAfAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAAfAAAAAAAAAAADAAAfAAAYAAAAAAAHgAAfAAA8AAAAAAAPwAAAAAB+AAAAAAAf4AAAAAD+AAAAAAAP8AAAAAH8AAAAAAAH+AAAAAP4AAAAAAAD/AAAAAfwAAAAAAAB/AAeAAfgAAAAAAAA8AH/8APAAAAAAAAAYAf//AGAAAAAAAAAAB///gAAAAAAAAAAAD///4AAAAAAAAAAAH///8AAAAAAAAAAAP///+AAAAAAAAAAAf////AAAAAAAAAAA/////gAAAAAAAAAA/////gAAAAAAAAAB/////wAAAAAAAAAD/////wAAAAAAAAAD/////4AAAAAAAAAD/////4AAAAAAAAAH/////4AAAAAAAAAH/////8AAAAAAB/4H/////8D/AAAAB/4H/////8D/AAAAB/4H/////8D/AAAAB/4H/////8D/AAAAB/4H/////8D/AAAAB/4H/////8D/AAAAAAAH/////4AAAAAAAAAD/////4AAAAAAAAAD/////4AAAAAAAAAD/////4AAAAAAAAAB/////wAAAAAAAAAB/////wAAAAAAAB/4/////gAAAAAAAP//P////AAAAAAAA///z////AAAAAAAB///9///+AAAAAAAH///+f//8AAAAAAAP////P//4AAAAAAAf////n//gCAAAAAA/////z/+AHAAAAAA/////7/4APgAAAAB/////4AAAfwAAAAD/////8AAAf4AAAAD/////+AAAP8AAAAH/////+AAAH+AAAAf/////+AAAD+AAAD///////AAAB8AAAP////////AAA4AAA/////////AAAYAAB/////////AAAAAAD/////////wAAAAAH/////////4AAAAAH/////////8AAAAAP/////////+AAAAAf/////////+AAAAAf//////////AAAAAf//////////gAAAA///////////gAAAA///////////gAAAA///////////wAAAA///////////wAAAA///////////wAAAA///////////wAAAA///////////wAAAA///////////wAAAA///////////wAAAA///////////gAAAAf//////////gAAAAf//////////gAAAAP//////////AAAAAP//////////AAAAAH/////////+AAAAAD/////////8AAAAAB/////////4AAAAAA/////////wAAAAAAf////////gAAAAAAP////////AAAAAAAB/8AAAB/4AAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-rain@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAD//wAAAAAAAAAAAAf//+AAAAAAAAAAAA////AAAAAAAAAAAD////wAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAf//////8AAAAAAAH///////8AAAAAAA////////+AAAAAAB/////////wAAAAAH/////////8AAAAAP//////////AAAAAf//////////wAAAA///////////4AAAB///////////8AAAB///////////+AAAD////////////AAAH////////////AAAH////////////gAAH////////////gAAP////////////wAAP////////////wAAP////////////4AAP////////////4AAf////////////4AAf////////////4AAf////////////4AAf////////////4AAP////////////4AAP////////////4AAP////////////4AAP////////////wAAH////////////wAAH////////////wAAH////////////gAAD////////////gAAB////////////AAAB////////////AAAA///////////+AAAAf//////////8AAAAP//////////4AAAAH//////////gAAAAB//////////AAAAAAf////////8AAAAAAH/4AAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAABgAAGAAAAAAAAYAABgAAGAAAAAAAA4AABwAAHAAAAAAAA8AADwAAPAAAAAAAB8AAD4AAPgAAAAAAB+AAH4AAfgAAAAAAB+AAH4AAfgAAAAAAD/AAP8AA/wAAAAAAD/AAP8AA/wAAAAAAH/gAf+AB/4AAAAAAH/gAf+AB/4AAAAAAP/wA//AD/8AAAAAAf/wA//AD/+AAAAAAf/4B//gH/+AAAAAA//4B//gH//AAAAAA//8D//wP//AAAAAA//8D//wP//AAAAAA//8D//wP//AAAAAA//4B//gH//AAAAAAf/4B//gH/+AAAAAAf/wA//AD/+AAAAAAP/gA//AB/8AAAAAAH/AAf+AA/4AAAAAAB+AAH4AAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-snow@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAD//wAAAAAAAAAAAAP//8AAAAAAAAAAAA////AAAAAAAAAAAB////gAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAB//////gAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAf//////8AAAAAAAH///////8AAAAAAA////////+AAAAAAB/////////wAAAAAH/////////8AAAAAP//////////AAAAAf//////////wAAAA///////////4AAAB///////////8AAAB///////////+AAAD////////////AAAH////////////AAAH////////////gAAH////////////gAAP////////////wAAP////////////wAAP////////////4AAP////////////4AAf////////////4AAf////////////4AAf////////////4AAf////////////4AAP////////////4AAP////////////4AAP////////////4AAP////////////4AAH////////////wAAH////////////wAAH////////////gAAD////////////gAAB////////////AAAB////////////AAAA///////////+AAAAf//////////8AAAAP//////////4AAAAH//////////wAAAAB//////////AAAAAAf////////8AAAAAAH/4AAAAD/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAwOAAAAAAcDgAAAAD4PAAAAAA8HwAAAAB4fAAAAAA+HwAAAAB8eAAAAAAfPgAAAAA8+AAAAAAfPAAAAAA/8AAAAAAP/AAAAAAf8AAAAAAH+AAAAAAf4AAAAAAH+AAAAA///8AAAAP///AAAA///8AAAAP///AAAA///8AAAAP///AAAA///8AAAAP///AAAAAf4AAYCAAH+AAAAAAf4AB4HgAH+AAAAAA/8AB8PgAP/AAAAAA8+AA8PgAfPAAAAAB8eAA+fAAfPgAAAAB4fAAfeAA+HwAAAAD4PAAf+AA8HwAAAAAwOAAP8AAcDgAAAAAAEAAP8AAAAAAAAAAAAAf//+AAAAAAAAAAAAf//+AAAAAAAAAAAAf//+AAAAAAAAAAAAf//+AAAAAAAAAAAAAP8AAAAAAAAAAAAAAf+AAAAAAAAAAAAAAfeAAAAAAAAAAAAAA+fAAAAAAAAAAAAAA8PgAAAAAAAAAAAAB8PgAAAAAAAAAAAAB4HgAAAAAAAAAAAAAYCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-sun@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAwAAAH4AAADAAAAAB4AAAAAAAAHgAAAAD8AAAAAAAAPwAAAAD+AAAAAAAAfwAAAAB/AAAAAAAA/gAAAAA/gAAAAAAB/AAAAAAfwAAAAAAD+AAAAAAP4AAAAAAH8AAAAAAH8AAAAAAP4AAAAAAD4AA//AAHwAAAAAABwAH//4ADgAAAAAAAgAf//+ABAAAAAAAAAB////gAAAAAAAAAAD////wAAAAAAAAAAH////4AAAAAAAAAAP////8AAAAAAAAAAf////+AAAAAAAAAA//////AAAAAAAAAB//////gAAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAf//////+AAAAAAAAf//////+AAAAAAAAf//////+AAAAB/+Af//////+Af/gD/+Af//////+Af/wD/+Af//////+Af/wD/+Af//////+Af/wD/+Af//////+Af/wB/+Af//////+Af/gAAAAf//////+AAAAAAAAf//////+AAAAAAAAf//////+AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAP//////8AAAAAAAAH//////4AAAAAAAAH//////4AAAAAAAAD//////wAAAAAAAAD//////wAAAAAAAAB//////gAAAAAAAAA//////AAAAAAAAAAf////+AAAAAAAAAAP////8AAAAAAAAAAH////4AAAAAAAAAAD////wAAAAAAAAAAB////gAAAAAAAAAgAf//+ABAAAAAAABwAH//4ADgAAAAAAD4AA//AAHwAAAAAAH8AAAAAAP4AAAAAAP4AAAAAAH8AAAAAAfwAAAAAAD+AAAAAA/gAAAAAAB/AAAAAB/AAAAAAAA/gAAAAD+AAAAAAAAfwAAAAD8AAAAAAAAPwAAAAB4AAAAAAAAHgAAAAAwAAAH4AAADAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAH4AAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  },
  "weather-wind@96": {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf///////8AAAAAAAf///////8AAAAAAAf///////8AAAAAAAf////////wAAAAAAf////////8AAAAAAf/////////AAAAAAP/////////gAAAAAAAAAAAAAH/wAAAAAAAAAAAAAH/4AAAAAAAAAAAAAD/4AAAAAAAAAAAAAAf8AAAAAAAAAAAAAAP8AAAAAAAAAAAAAAH+AAAAAAAAAAAAAAD+AAAAAAAAAAAAAAD+AAAAAAAAAAAAAAD+AAAAAAAAAAAPwAD+AAAAAAAAAAAP4AD+AAAAAAAAAAAP4AD+AAAAAAAAAAAP8AD+AAAAAAAAAAAH8AH+AAAAAAAAAAAH+AP8AAAAAAAAAAAH/gf8AAAAAAAAAAAD///4AAAAAAAAAAAB///4AAAAAAAAAAAA///wAAAAAP////////////wAAf////////////4AAf////////////4AAf////////////4AAf////////////4AAf////////////4AAf////////////4AAAAAAAA///wAAAAAAAAAAAA///wAAAAAAAAAAAB///4AAAAAAAAAAAD///8AAAAAAAAAAAD/Af8AAAAAAAAAAAH+AH+AAAAAAAAAAAH8AH+AAAAAAAAAAAH8AD+AAAAAAAAAAAP4AD+AAAAAAAAAAAP4AB/AAAAAAAAAAAP4AB+AAAAAAAAAAAP4AAAAAAAAAAAAAAP4AAAAAAAAAAAAAAH8AAAAAAAAAAAAAAH8AAAAAAAAAAAAAAH+AAAAAAAAAAAAAAD/gAAAAAAAAAAAAAD/8AAAAAAAAAAAAAB/8AAAAAAAAAAAAAA/8AAAAAAAAP//////8AAAAAAAAf//////8AAAAAAAAf//////8AAAAAAAAf//////8AAAAAAAAf//////8AAAAAAAAf//////8AAAAAAAAf//////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "h": 96,
    "w": 96
  }
} as const satisfies Readonly<Record<string, PackedBitmap>>;

export type FontRole = keyof typeof FONTS;
export type BitmapName = keyof typeof BITMAPS;

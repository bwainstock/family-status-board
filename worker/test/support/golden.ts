import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";
import { Framebuffer, WIDTH, HEIGHT, BYTES_PER_ROW } from "../../src/framebuffer.js";
import { decodePng1Bit, encodePng1Bit } from "../../src/preview/png.js";

/**
 * Golden images for layout work.
 *
 * Object assertions cannot see that a Caption has started overflowing its cell,
 * so layout is reviewed the way a human reviews it: by looking at the picture.
 * Each scenario renders a Frame, encodes it as a 1-bit PNG, and compares it to
 * a committed file.
 *
 * To review and accept a change:
 *
 *   1. Run the tests. A failure writes `<scenario>.actual.png` beside the
 *      golden and reports how many pixels moved and where.
 *   2. Open the golden and the `.actual.png` side by side and decide whether
 *      the change is the one you meant to make.
 *   3. Accept with `npm run test:goldens`, then commit the updated PNGs. The
 *      diff in review is the picture itself.
 *
 * A missing golden is written and passes, so adding a scenario is one step.
 * Deleting a golden is how you force it to be re-reviewed from scratch.
 */

const GOLDEN_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "goldens");
const UPDATING = process.env["UPDATE_GOLDENS"] === "1";

export function expectGolden(scenario: string, frame: Framebuffer): void {
  const goldenPath = join(GOLDEN_DIR, `${scenario}.png`);
  const actualPath = join(GOLDEN_DIR, `${scenario}.actual.png`);
  const encoded = encodePng1Bit(frame.bytes, WIDTH, HEIGHT);

  if (UPDATING || !existsSync(goldenPath)) {
    writeFileSync(goldenPath, encoded);
    rmSync(actualPath, { force: true });
    return;
  }

  const golden = decodePng1Bit(new Uint8Array(readFileSync(goldenPath)));
  expect(
    { width: golden.width, height: golden.height },
    `golden "${scenario}" is not panel-sized; delete it and re-accept`,
  ).toEqual({ width: WIDTH, height: HEIGHT });

  const diff = comparePixels(golden.ink, frame.bytes);
  if (diff === null) {
    rmSync(actualPath, { force: true });
    return;
  }

  writeFileSync(actualPath, encoded);
  throw new Error(
    `Frame "${scenario}" does not match its golden: ${diff.count} pixel(s) differ, ` +
      `bounded by x ${diff.minX}..${diff.maxX}, y ${diff.minY}..${diff.maxY}.\n` +
      `Wrote ${actualPath} — compare it with ${goldenPath}.\n` +
      `If the change is intended, accept it with: npm run test:goldens`,
  );
}

interface PixelDiff {
  count: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function comparePixels(expected: Uint8Array, actual: Uint8Array): PixelDiff | null {
  let count = 0;
  let minX = WIDTH;
  let maxX = -1;
  let minY = HEIGHT;
  let maxY = -1;

  for (let index = 0; index < expected.length; index++) {
    const delta = expected[index]! ^ actual[index]!;
    if (delta === 0) continue;
    const y = Math.floor(index / BYTES_PER_ROW);
    for (let bit = 0; bit < 8; bit++) {
      if ((delta & (0x80 >> bit)) === 0) continue;
      const x = (index % BYTES_PER_ROW) * 8 + bit;
      count++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  return count === 0 ? null : { count, minX, maxX, minY, maxY };
}

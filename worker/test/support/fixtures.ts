/**
 * Loading the recorded upstream payloads.
 *
 * The fixtures keep the URL they came from next to the body, so a test that
 * starts failing can be traced back to the thing that changed. Re-record with
 * `python3 tools/record-fixtures.py`.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface Recording<T> {
  readonly _recordedFrom: string;
  readonly _note: string;
  readonly payload: T;
}

// Built from a string rather than `new URL(..., import.meta.url)`: src is
// typechecked against the Workers URL and tests against Node's, and the two
// are not assignable to each other.
const FIXTURE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");

function read<T>(name: string): Recording<T> {
  return JSON.parse(readFileSync(join(FIXTURE_DIR, `${name}.json`), "utf8")) as Recording<T>;
}

export function fixture<T>(name: string): T {
  return read<T>(name).payload;
}

/**
 * A fixture recorded as text rather than JSON, for feeds that are not JSON.
 * The recorder writes a `#` header explaining where the body came from; that
 * header is stripped here so callers see exactly what the upstream sent.
 */
export function fixtureText(name: string): string {
  const body = readFileSync(join(FIXTURE_DIR, name), "utf8");
  return body
    .split("\n")
    .filter((line) => !line.startsWith("#"))
    .join("\n");
}

/** The URL a fixture was recorded from, so a failure can be traced upstream. */
export function recordedFrom(name: string): string {
  return read<unknown>(name)._recordedFrom;
}

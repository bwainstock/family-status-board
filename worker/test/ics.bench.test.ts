import { describe, expect, it } from "vitest";
import { parseIcs } from "../src/sources/ics.js";
import { fixtureText } from "./support/fixtures.js";

/**
 * The CPU-budget question this whole file exists to answer, in numbers: does
 * a genuinely large secret-address Google feed — years of one-off entries,
 * several old recurring series — fit inside the free plan's 10ms of CPU per
 * invocation (ADR 0002), given that a cron tick is expected to read from two
 * such feeds, not one (the issue this file exists for names "two of them"
 * without committing to which two calendars — that wiring is out of scope
 * here; this file only needs a stand-in for "large feed" repeated twice)?
 *
 * `performance.now()` measures wall time on a laptop, not the billed CPU time
 * of a Workers isolate — as `delivery.test.ts` already notes for the same
 * reason, this is a coarse alarm against an accidentally-quadratic parser,
 * not a substitute for measuring on the real platform. Two numbers are worth
 * telling apart here, and both are logged below rather than collapsed into
 * one: the *first* call in this file pays for V8 compiling `ics.ts` and
 * `rrule.ts`, which a Workers isolate that has already handled an earlier
 * cron tick would not pay again; the calls after it are closer to steady
 * -state per-tick cost. A genuinely cold isolate (the Worker's first
 * invocation after a deploy, or after Cloudflare recycles it) sees something
 * closer to the first number.
 */
describe("parseIcs: the CPU budget", () => {
  const GOOGLE_FEED = fixtureText("google-personal.ics");
  const DISPLAY_WINDOW = { start: "2026-09-24", end: "2026-09-26" };

  it("a cold first parse of one large feed, within a display-sized window", () => {
    // This must be the first test in the file to touch parseIcs on this
    // input: it is the only call that can honestly claim to include V8's
    // one-time cost of compiling `ics.ts` and `rrule.ts`.
    const started = performance.now();
    const events = parseIcs(GOOGLE_FEED, DISPLAY_WINDOW);
    const elapsedMs = performance.now() - started;

    console.log(
      `[ics.bench] COLD: one ${GOOGLE_FEED.length}-byte feed, ${countVevents(GOOGLE_FEED)} VEVENTs, ` +
        `3-day window -> ${events.length} events in ${elapsedMs.toFixed(3)}ms`,
    );
    expect(events.length).toBeGreaterThan(5);
    // A generous multiple of the 10ms budget: this number is expected to be
    // the highest one this file reports, and still needs headroom for a
    // slower CI machine than the one it was measured on.
    expect(elapsedMs).toBeLessThan(80);
  });

  it("warm, steady-state cost of parsing one large feed repeatedly", () => {
    const samples = timeRepeated(() => parseIcs(GOOGLE_FEED, DISPLAY_WINDOW), 20);
    const { min, median, max } = summarize(samples);

    console.log(
      `[ics.bench] WARM (n=20): one feed, 3-day window -> ` +
        `min ${min.toFixed(3)}ms, median ${median.toFixed(3)}ms, max ${max.toFixed(3)}ms`,
    );
    // A generous multiple of the 10ms budget, in the same spirit as
    // delivery.test.ts's CPU-budget check: a coarse alarm against an
    // accidentally-quadratic parser, not a tight gate that flakes on a busier
    // CI runner. The console.log above carries the figure that matters for
    // the report; this assertion only needs to catch a regression many times
    // worse than what was actually measured.
    expect(median).toBeLessThan(25);
  });

  it("warm cost of parsing two large feeds in one invocation, as a cron tick reading two calendars would", () => {
    const samples = timeRepeated(() => {
      const first = parseIcs(GOOGLE_FEED, DISPLAY_WINDOW);
      const second = parseIcs(GOOGLE_FEED, DISPLAY_WINDOW);
      return first.length + second.length;
    }, 20);
    const { min, median, max } = summarize(samples);

    console.log(
      `[ics.bench] WARM (n=20): TWO feeds, 3-day window -> ` +
        `min ${min.toFixed(3)}ms, median ${median.toFixed(3)}ms, max ${max.toFixed(3)}ms`,
    );
    expect(median).toBeLessThan(40);
  });

  it("costs about the same whether the window is 3 days or a full month — not proportional to feed history", () => {
    // The property the design is actually for: widening the window by ~10x
    // should not multiply the cost by anything close to 10x, because the
    // dominant cost is the one linear scan of the feed's text, not the
    // expansion — and it should be nowhere near proportional to how many
    // *years* of history the oldest series in the feed carries (2015, in
    // this fixture), which this test does not even vary, because the whole
    // point of the design in rrule.ts is that it does not matter.
    const threeDay = summarize(timeRepeated(() => parseIcs(GOOGLE_FEED, DISPLAY_WINDOW), 10));
    const oneMonth = summarize(
      timeRepeated(() => parseIcs(GOOGLE_FEED, { start: "2026-09-01", end: "2026-09-30" }), 10),
    );

    console.log(
      `[ics.bench] 3-day window median ${threeDay.median.toFixed(3)}ms vs ` +
        `30-day window median ${oneMonth.median.toFixed(3)}ms`,
    );

    // A loose bound, not a tight one: this is a shape check (single-digit
    // multiplier, not the ~10x a naive "expand everything then filter" or an
    // age-proportional walk would produce), run on a shared dev machine where
    // wall-clock noise between individual runs is otherwise expected.
    expect(oneMonth.median).toBeLessThan(Math.max(threeDay.median * 10, 20));
  });
});

function timeRepeated(run: () => unknown, iterations: number): number[] {
  const samples: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const started = performance.now();
    run();
    samples.push(performance.now() - started);
  }
  return samples;
}

function summarize(samples: number[]): { min: number; median: number; max: number } {
  const sorted = [...samples].sort((a, b) => a - b);
  return { min: sorted[0]!, median: sorted[Math.floor(sorted.length / 2)]!, max: sorted[sorted.length - 1]! };
}

function countVevents(body: string): number {
  return body.split("BEGIN:VEVENT").length - 1;
}

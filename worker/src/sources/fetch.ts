/**
 * Talking to the outside world.
 *
 * Everything in this directory returns `null` rather than throwing. A source
 * being down is an ordinary Tuesday, not an exception: the Frame still gets
 * composed, the cell still gets drawn, and the Viewer sees a question mark
 * where a fact would have been. One flaky upstream must never cost her the
 * other three facts.
 *
 * Parsing lives here; deciding does not. These functions hand back the payload
 * shape, and src/day turns it into something true.
 */

const TIMEOUT_MS = 5_000;

/**
 * A GET that cannot throw and cannot hang.
 *
 * The timeout matters more than it looks: the Board wakes, fetches once, and
 * goes back to sleep. A Worker blocked on a dead socket burns the Refresh, and
 * the next one is an hour away.
 */
export async function fetchJson<T>(url: string, label: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      console.warn(`${label}: HTTP ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

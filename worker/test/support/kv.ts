import type { FrameStore } from "../../src/board/store.js";

/**
 * KV, in memory.
 *
 * Deliberately not a mock: it stores and returns what it was given, including
 * metadata, so tests exercise the real round trip through `putFrame`/`getFrame`
 * rather than asserting on calls.
 */
export class MemoryKv implements FrameStore {
  private readonly entries = new Map<string, { value: Uint8Array; metadata: unknown }>();

  async get(key: string, _options: { type: "arrayBuffer" }): Promise<ArrayBuffer | null> {
    const entry = this.entries.get(key);
    return entry ? toArrayBuffer(entry.value) : null;
  }

  async getWithMetadata(
    key: string,
    _options: { type: "arrayBuffer" },
  ): Promise<{ value: ArrayBuffer | null; metadata: unknown }> {
    const entry = this.entries.get(key);
    if (!entry) return { value: null, metadata: null };
    // Round-tripped, because KV stores metadata as JSON and a Date put in comes
    // back as a string.
    return {
      value: toArrayBuffer(entry.value),
      metadata: JSON.parse(JSON.stringify(entry.metadata)) as unknown,
    };
  }

  async put(
    key: string,
    value: ArrayBuffer | Uint8Array,
    options?: { metadata?: unknown },
  ): Promise<void> {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
    this.entries.set(key, { value: bytes.slice(), metadata: options?.metadata ?? null });
  }

  /** Corrupt the stored bytes, to check the Board is never handed a short read. */
  truncate(key = "frame:current"): void {
    const entry = this.entries.get(key);
    if (entry) this.entries.set(key, { ...entry, value: entry.value.slice(0, 100) });
  }

  get size(): number {
    return this.entries.size;
  }
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.slice().buffer as ArrayBuffer;
}

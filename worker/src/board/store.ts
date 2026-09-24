/**
 * The stored Frame.
 *
 * Composition happens on a schedule and the Board's wake-up is a download, so
 * something has to hold the result in between. That is this: the packed bytes
 * as the value, and the facts they were drawn from as metadata.
 *
 * The facts are kept because a stale Frame has to be marked, and marking it
 * means redrawing it — from what was already decided, never by asking the
 * sources again. A Board collecting a stale Frame is a Board whose morning has
 * already gone wrong; making it wait on three APIs would not improve it.
 */

import { FRAME_BYTES } from "../framebuffer.js";
import type { DayModel } from "../day/model.js";

const FRAME_KEY = "frame:current";

export interface FrameStore {
  get(
    key: string,
    options: { type: "arrayBuffer" },
  ): Promise<ArrayBuffer | null>;
  getWithMetadata(
    key: string,
    options: { type: "arrayBuffer" },
  ): Promise<{ value: ArrayBuffer | null; metadata: unknown }>;
  put(
    key: string,
    value: ArrayBuffer | Uint8Array,
    options?: { metadata?: unknown },
  ): Promise<void>;
}

export interface StoredFrame {
  readonly bytes: Uint8Array;
  readonly model: DayModel;
  /** When composition ran. The only thing that makes staleness answerable. */
  readonly composedAt: Date;
}

interface FrameMetadata {
  readonly composedAt: string;
  readonly model: DayModel;
}

export async function putFrame(store: FrameStore, frame: StoredFrame): Promise<void> {
  const metadata: FrameMetadata = {
    composedAt: frame.composedAt.toISOString(),
    model: frame.model,
  };
  // KV caps metadata at 1 KiB and fails the write past it. A Frame that stored
  // but cannot be marked stale is worse than one that did not store at all, so
  // this is checked here rather than discovered on a bad morning.
  const encoded = JSON.stringify(metadata);
  if (encoded.length > 1024) {
    throw new Error(`frame metadata too large to store: ${encoded.length} bytes`);
  }

  await store.put(FRAME_KEY, frame.bytes, { metadata });
}

export async function getFrame(store: FrameStore): Promise<StoredFrame | null> {
  const { value, metadata } = await store.getWithMetadata(FRAME_KEY, { type: "arrayBuffer" });
  if (value === null) return null;

  const parsed = metadata as FrameMetadata | null;
  if (parsed === null || typeof parsed.composedAt !== "string" || !parsed.model) return null;

  // A short read would be blitted to the panel as garbage. The Board checks the
  // length too, but it can only refuse — here it can fall back.
  if (value.byteLength !== FRAME_BYTES) return null;

  const composedAt = new Date(parsed.composedAt);
  if (Number.isNaN(composedAt.getTime())) return null;

  return { bytes: new Uint8Array(value), model: parsed.model, composedAt };
}

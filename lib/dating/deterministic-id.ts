import type { DatingBucket } from "./types";

/**
 * Deterministic record ID for idempotent photo writes.
 * Format: {batchId}_{bucket}_{index}
 * index is the 0-based slot index. Slots run to SLOTS_PER_BUCKET, which is
 * larger than the 20 photos a delivery contains, because a delivery draws its
 * 20 from a wider pool.
 */
export function makeDeterministicPhotoId(
  batchId: string,
  bucket: DatingBucket | string,
  index: number
): string {
  return `${batchId}_${bucket}_${index}`;
}

/** slot is 1-based in the DB; index is 0-based for payloads. */
export function slotToIndex(slot: number): number {
  return slot - 1;
}

export function indexToSlot(index: number): number {
  return index + 1;
}

import type { DatingBucket } from "./types";

/**
 * Deterministic record ID for idempotent photo writes.
 * Format: {batchId}_{bucket}_{index}
 * index is 0-based (0..19) per the two-task pipeline spec.
 */
export function makeDeterministicPhotoId(
  batchId: string,
  bucket: DatingBucket | string,
  index: number
): string {
  return `${batchId}_${bucket}_${index}`;
}

/** slot is 1..20 in DB; index is 0..19 for payloads */
export function slotToIndex(slot: number): number {
  return slot - 1;
}

export function indexToSlot(index: number): number {
  return index + 1;
}

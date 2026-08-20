/**
 * The stable identity of one photo within one order.
 *
 * Used as the upsert key everywhere a photo is written, which is what makes the
 * pipeline idempotent: a retried child writes the same row rather than a second
 * one, and the orchestrator can re-audit an order without duplicating work.
 *
 * The previous scheme was `{orderId}_{bucket}_{index}` with a 0-based index,
 * while migration 018 backfilled the same column 1-based — so any backfilled row
 * carried an id the code could never recompute. Frame indices are 1-based
 * everywhere now, in the database and here, so there is nothing to convert and
 * no second convention to get wrong.
 */
export function makeDeterministicPhotoId(
  orderId: string,
  shootId: string,
  frameIndex: number
): string {
  return `${orderId}_${shootId}_${frameIndex}`;
}

/**
 * Where this photo's bytes live in R2.
 *
 * `variantKey` is what a reshoot passes to break the path. Without it a
 * regenerated photo overwrites the original object and every cache in front of
 * it keeps serving the image the user just paid to replace.
 */
export function makePhotoStorageKey(
  userId: string,
  orderId: string,
  shootId: string,
  frameIndex: number,
  variantKey?: string
): string {
  const suffix = variantKey ? `_${variantKey}` : "";
  return `dating/${userId}/${orderId}/${shootId}_${frameIndex}${suffix}.png`;
}

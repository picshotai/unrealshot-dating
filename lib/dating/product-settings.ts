function configuredInteger(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number
) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

/** Shared snapshot defaults for product copy, checkout and order creation. */
export const FRAMES_PER_SHOOT = 4 as const;
export const SHOOTS_PER_DELIVERY = configuredInteger(
  "DATING_SHOOTS_PER_DELIVERY",
  15,
  1,
  30
);
export const TOTAL_PHOTOS = SHOOTS_PER_DELIVERY * FRAMES_PER_SHOOT;
export const SAMPLE_SHOOTS = configuredInteger(
  "DATING_SAMPLE_SHOOTS",
  Math.min(2, SHOOTS_PER_DELIVERY),
  0,
  SHOOTS_PER_DELIVERY
);


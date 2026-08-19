/**
 * Shared motion curves.
 *
 * Kept in one place so animation across the app decelerates the same way —
 * mismatched easing is one of those things nobody names but everybody feels.
 */

/** Symmetric. For loops and anything that returns to where it started. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** Fast out, slow in. The default for things entering or settling. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Firm, short press feedback — no overshoot on a button. */
export const SPRING_PRESS = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.7,
} as const;

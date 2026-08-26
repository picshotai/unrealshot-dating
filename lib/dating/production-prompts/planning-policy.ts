export function plannerCallBudget(missingShootsAtStart: number): number {
  if (!Number.isInteger(missingShootsAtStart) || missingShootsAtStart < 1) return 0;
  // One normal portfolio call and, only if exact reservation or mechanics left
  // slots open, one missing-slot repair call.
  return 2;
}

export function nextNoProgressCount(current: number, reservedCount: number): number {
  return reservedCount > 0 ? 0 : current + 1;
}

export function planningHasStalled(remainingCalls: number, consecutiveNoProgress: number) {
  return remainingCalls <= 0 || consecutiveNoProgress >= 2;
}

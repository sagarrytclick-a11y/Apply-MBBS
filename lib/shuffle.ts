/** Deterministic Fisher–Yates (same seed → same order). */
export function shuffle<T>(items: T[], seed = dailySeed()): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/** UTC day number — rotates order daily, SSR-safe. */
export function dailySeed(offset = 0): number {
  return Math.floor(Date.now() / 86_400_000) + offset;
}

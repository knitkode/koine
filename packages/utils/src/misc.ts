/**
 * Get random key from given object
 *
 * @see https://stackoverflow.com/a/15106541/1938970
 */
export function randomKey<T extends Record<string | number, unknown>>(
  obj: T
): keyof T {
  const keys = Object.keys(obj);
  return keys[(keys.length * Math.random()) << 0];
}

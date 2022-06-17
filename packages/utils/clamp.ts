/**
 * Returns a number whose value is limited to the given range.
 *
 * @category math
 * @see https://stackoverflow.com/a/11409944/1938970
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

export default clamp;

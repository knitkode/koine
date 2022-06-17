/**
 * Get random int (min and max included)
 *
 * @category math
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default randomInt;

/**
 * Sum array of numbers
 *
 * @category array | math
 */
export const arraySum = (numbers: number[]) =>
  numbers.reduce((sum, current) => sum + current, 0);

export default arraySum;

/**
 * Sum array of numbers
 *
 * @category array
 * @category math
 */
export const arraySum = (numbers: number[]) =>
  numbers.reduce((sum, current) => sum + current, 0);

export default arraySum;

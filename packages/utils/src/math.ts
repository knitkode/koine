/**
 * Get random int (min and max included)
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @see https://stackoverflow.com/a/11409944/1938970
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to given number of the given number of decimals
 *
 * @see https://stackoverflow.com/a/15762794/1938970
 */
export function roundTo(input: number, decimals = 2): string {
  if (isFinite(input) && !isNaN(input)) {
    // method 1
    // return Number(input).toFixed(decimals);

    // method 2: @see https://stackoverflow.com/a/43532829/1938970
    const multiplicator = Math.pow(10, decimals);
    return Math.round(input * multiplicator) / multiplicator + "";

    // method 3: @see https://stackoverflow.com/a/15762794/1938970
    // let negative = false;
    // if (input < 0) {
    //   negative = true;
    //   input = input * -1;
    // }
    // const multiplicator = Math.pow(10, decimals);
    // const outputStr = parseFloat((input * multiplicator).toFixed(11));
    // let outputNum = (Math.round(outputStr) / multiplicator).toFixed(decimals);
    // if (negative) {
    //   return (Number(outputNum) * -1).toFixed(decimals);
    // }
    // return outputNum;
  }

  console.warn(
    "[@koine/utils] math:roundTo -> given not a finite number as first arg"
  );
  return "";
}

/**
 * Convert range of a number
 *
 * e.g. converting number 5 in a scale/range from 0 10 to a scale/range from 50
 * to 100 would return 75
 * ```
 * convertRange(5, [0, 10], [50, 100]);
 * ```
 *
 * @see https://stackoverflow.com/a/14224813
 */
export function convertRange(
  value: number,
  r1: number[],
  r2: number[]
): number {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}

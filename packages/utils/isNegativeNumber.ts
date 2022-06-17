import isNumber from "./isNumber";

/**
 * Returns whether the payload is a negative number (but not 0)
 *
 * @category is
 */
export function isNegativeNumber(payload: any): payload is number {
  return isNumber(payload) && payload < 0;
}

export default isNegativeNumber;

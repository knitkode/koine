import isNumber from "./isNumber";

/**
 * Returns whether the payload is a positive number (but not 0)
 *
 * @category is
 */
export function isPositiveNumber(payload: any): payload is number {
  return isNumber(payload) && payload > 0;
}

export default isPositiveNumber;

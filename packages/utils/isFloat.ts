import isNumber from "./isNumber";

/**
 * Returns whether the payload is a float number
 *
 * @category is
 */
export function isFloat(payload: any): payload is number {
  return isNumber(payload) && payload % 1 !== 0;
}

export default isFloat;

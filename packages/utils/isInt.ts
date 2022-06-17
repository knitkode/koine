import isNumber from "./isNumber";

/**
 * Returns whether the payload is an integer number
 *
 * @category is
 */
export function isInt(payload: any): payload is number {
  return isNumber(payload) && payload % 1 === 0;
}

export default isInt;

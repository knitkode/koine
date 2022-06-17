import getType from "./getType";

/**
 * Returns whether the payload is a number (but not NaN)
 *
 * This will return `false` for `NaN`!!
 *
 * @category is
 */
export function isNumber(payload: any): payload is number {
  return getType(payload) === "Number" && !isNaN(payload);
}

export default isNumber;

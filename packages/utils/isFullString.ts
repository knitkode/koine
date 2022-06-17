import isString from "./isString";

/**
 * Returns whether the payload is a string, BUT returns false for ''
 *
 * @category is
 */
export function isFullString(payload: any): payload is string {
  return isString(payload) && payload !== "";
}

export default isFullString;

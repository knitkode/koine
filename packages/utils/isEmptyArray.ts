import isArray from "./isArray";

/**
 * Returns whether the payload is a an empty array
 *
 * @category is
 */
export function isEmptyArray(payload: any): payload is [] {
  return isArray(payload) && payload.length === 0;
}

export default isEmptyArray;

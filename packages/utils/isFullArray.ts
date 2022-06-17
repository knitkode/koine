import isArray from "./isArray";

/**
 * Returns whether the payload is a an array with at least 1 item
 *
 * @category is
 */
export function isFullArray(payload: any): payload is any[] {
  return isArray(payload) && payload.length > 0;
}

export default isFullArray;

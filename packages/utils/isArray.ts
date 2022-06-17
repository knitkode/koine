import getType from "./getType";

/**
 * Returns whether the payload is an array
 *
 * @category is
 */
export function isArray(payload: any): payload is any[] {
  return getType(payload) === "Array";
}

export default isArray;

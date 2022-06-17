import getType from "./getType";

/**
 * Returns whether the payload is a string
 *
 * @category is
 */
export function isString(payload: any): payload is string {
  return getType(payload) === "String";
}

export default isString;

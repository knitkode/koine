import getType from "./getType";

/**
 * Returns whether the payload is a boolean
 *
 * @category is
 */
export function isBoolean(payload: any): payload is boolean {
  return getType(payload) === "Boolean";
}

export default isBoolean;

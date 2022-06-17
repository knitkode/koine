import getType from "./getType";

/**
 * Returns whether the payload is undefined
 *
 * @category is
 */
export function isUndefined(payload: any): payload is undefined {
  return getType(payload) === "Undefined";
}

export default isUndefined;

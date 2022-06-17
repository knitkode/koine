import getType from "./getType";

/**
 * Returns whether the payload is null
 *
 * @category is
 */
export function isNull(payload: any): payload is null {
  return getType(payload) === "Null";
}

export default isNull;

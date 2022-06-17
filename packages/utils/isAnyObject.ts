import getType, { type PlainObject } from "./getType";

/**
 * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
 *
 * @category is
 */
export function isAnyObject(payload: any): payload is PlainObject {
  return getType(payload) === "Object";
}

export default isAnyObject;

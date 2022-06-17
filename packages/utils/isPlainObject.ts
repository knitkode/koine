import getType, { type PlainObject } from "./getType";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
export function isPlainObject(payload: any): payload is PlainObject {
  if (getType(payload) !== "Object") return false;
  return (
    payload.constructor === Object &&
    Object.getPrototypeOf(payload) === Object.prototype
  );
}

export default isPlainObject;

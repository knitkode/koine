import { type PlainObject } from "./getType";
import isPlainObject from "./isPlainObject";

/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @category is
 */
export function isObject(payload: any): payload is PlainObject {
  return isPlainObject(payload);
}

export default isObject;

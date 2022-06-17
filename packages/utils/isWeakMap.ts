import getType from "./getType";

/**
 * Returns whether the payload is a WeakMap
 *
 * @category is
 */
export function isWeakMap(payload: any): payload is WeakMap<any, any> {
  return getType(payload) === "WeakMap";
}

export default isWeakMap;

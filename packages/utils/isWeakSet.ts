import getType from "./getType";

/**
 * Returns whether the payload is a WeakSet
 *
 * @category is
 */
export function isWeakSet(payload: any): payload is WeakSet<any> {
  return getType(payload) === "WeakSet";
}

export default isWeakSet;

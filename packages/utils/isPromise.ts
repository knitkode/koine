import getType from "./getType";

/**
 * Returns whether the payload is a Promise
 *
 * @category is
 */
export function isPromise(payload: any): payload is Promise<any> {
  return getType(payload) === "Promise";
}

export default isPromise;

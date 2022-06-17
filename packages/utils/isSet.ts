import getType from "./getType";

/**
 * Returns whether the payload is a Set
 *
 * @category is
 */
export function isSet(payload: any): payload is Set<any> {
  return getType(payload) === "Set";
}

export default isSet;

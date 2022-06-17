import getType from "./getType";

/**
 * Returns whether the payload is a Map
 *
 * @category is
 */
export function isMap(payload: any): payload is Map<any, any> {
  return getType(payload) === "Map";
}

export default isMap;

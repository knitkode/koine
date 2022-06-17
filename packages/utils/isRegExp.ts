import getType from "./getType";

/**
 * Returns whether the payload is a regular expression (RegExp)
 *
 * @category is
 */
export function isRegExp(payload: any): payload is RegExp {
  return getType(payload) === "RegExp";
}

export default isRegExp;

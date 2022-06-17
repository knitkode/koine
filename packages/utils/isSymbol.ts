import getType from "./getType";

/**
 * Returns whether the payload is a Symbol
 *
 * @category is
 */
export function isSymbol(payload: any): payload is symbol {
  return getType(payload) === "Symbol";
}

export default isSymbol;

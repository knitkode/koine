import isString from "./isString";
import isNull from "./isNull";
import isNumber from "./isNumber";
import isUndefined from "./isUndefined";
import isBoolean from "./isBoolean";
import isSymbol from "./isSymbol";

/**
 * Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
 *
 * @category is
 */
export function isPrimitive(
  payload: any
): payload is boolean | null | undefined | number | string | symbol {
  return (
    isBoolean(payload) ||
    isNull(payload) ||
    isUndefined(payload) ||
    isNumber(payload) ||
    isString(payload) ||
    isSymbol(payload)
  );
}

export default isPrimitive;

import isNull from "./isNull";
import isOneOf from "./isOneOf";
import isUndefined from "./isUndefined";

/**
 * Returns true whether the payload is null or undefined
 *
 * @category is
 */
export const isNullOrUndefined = isOneOf(isNull, isUndefined);

export default isNullOrUndefined;

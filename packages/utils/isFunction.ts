import { type AnyFunction } from "./getType";

/**
 * Returns whether the payload is a function (regular or async)
 *
 * @category is
 */
export function isFunction(payload: any): payload is AnyFunction {
  return typeof payload === "function";
}

export default isFunction;

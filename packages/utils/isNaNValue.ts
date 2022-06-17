import getType from "./getType";

/**
 * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
 *
 * @category is
 */
export function isNaNValue(payload: any): payload is typeof NaN {
  return getType(payload) === "Number" && isNaN(payload);
}

export default isNaNValue;

import getParamAsString from "./getParamAsString";
import isUndefined from "./isUndefined";

/**
 * Get query parameter as `int`eger treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param {string} [raw] - The _raw_ query parameter
 * @param {number} [fallback] - Fallback number, we return `null` if not provided
 */
export function getParamAsInt(raw?: string | string[], fallback?: number) {
  const string = getParamAsString(raw);
  if (string) parseInt(string, 10);
  return isUndefined(fallback) ? null : fallback;
}

export default getParamAsInt;

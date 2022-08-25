import getParamAsString from "./getParamAsString";

/**
 * Get query parameter as `int`eger treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param {string} [raw] - The _raw_ query parameter
 * @param {number} [fallback=1] - Fallback value, `1` by default
 */
export function getParamAsInt(raw?: string | string[], fallback = 1) {
  return parseInt(getParamAsString(raw) || String(fallback), 10);
}

export default getParamAsInt;

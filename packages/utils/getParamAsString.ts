import isArray from "./isArray";

/**
 * Get query parameter as `string` treating the `ParsedUrlQuery` result of
 * [`querystring`](https://nodejs.org/api/querystring.html) (used in next.js
 * router and elsewhere)
 *
 * @category location
 *
 * @param {string} [raw] - The _raw_ query parameter
 */
export function getParamAsString(raw?: string | string[]) {
  return (isArray(raw) ? raw[0] : raw) || "";
}

export default getParamAsString;

import { type AnyQueryParams } from "./location";
import isNull from "./isNull";
import isUndefined from "./isUndefined";

/**
 * Get clean query string for URL
 *
 * It returns the query string **with** the initial `?`
 *
 * TODO: at some point replace with `URLSearchParams`, @see [caniuse](https://caniuse.com/?search=URLSearchParams)
 *
 * @category location
 */
export function buildUrlQueryString(params: AnyQueryParams = {}) {
  let output = "";

  for (const key in params) {
    const value = params[key];
    if (!isNull(value) && !isUndefined(value)) {
      output += `${key}=${encodeURIComponent(value + "")}&`;
    }
  }

  // removes the last &
  return output ? `?${output.replace(/&+$/, "")}` : "";
}

export default buildUrlQueryString;

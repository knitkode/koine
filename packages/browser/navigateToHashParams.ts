import buildUrlQueryString from "@koine/utils/buildUrlQueryString";
import getUrlHashPathname from "@koine/utils/getUrlHashPathname";
import type { AnyQueryParams } from "@koine/utils/location";

/**
 * It updates the `location.hash` with the given query params, it uses `location.hash`
 * if a second argument `hash` is not provded
 *
 * @category location
 */
export function navigateToHashParams(
  params: string | AnyQueryParams = {},
  hash = ""
) {
  const useLocation = !hash;
  hash = hash || location.hash;
  const hashQueryLess = getUrlHashPathname(hash);
  const queryString =
    typeof params === "string" ? params : buildUrlQueryString(params);
  const newHash = "#/" + hashQueryLess + queryString;
  if (useLocation) {
    location.hash = newHash;
  }

  return newHash;
}

export default navigateToHashParams;

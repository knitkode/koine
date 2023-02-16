import type { AnyQueryParams } from "@koine/utils/location";
import isBrowser from "@koine/utils/isBrowser";
import buildUrlQueryString from "@koine/utils/buildUrlQueryString";
import navigateToUrl from "./navigateToUrl";

/**
 * Change current URL query parameters, it uses `history`.
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 * @returns The query string with initial `?`
 */
export function navigateToParams(
  params: string | AnyQueryParams = {},
  replace?: boolean
) {
  const queryString =
    typeof params === "string" ? params : buildUrlQueryString(params);

  if (isBrowser) {
    navigateToUrl(location.pathname + queryString, replace);
  }

  return queryString;
}

export default navigateToParams;

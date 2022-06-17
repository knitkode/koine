import { type AnyQueryParams } from "./location";
import buildUrlQueryString from "./buildUrlQueryString";
import isBrowser from "./isBrowser";

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
    history[replace ? "replaceState" : "pushState"](
      null,
      "",
      location.pathname + queryString
    );
  }

  return queryString;
}

export default navigateToParams;

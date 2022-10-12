import {
  type AnyQueryParams,
  isBrowser,
  buildUrlQueryString,
} from "@koine/utils";

/**
 * Redirect to url with params {optionally}, removes eventual trailing question
 * marks from the given URL, it uses `location`
 *
 * @category location
 */
export function redirectTo(url: string, params?: AnyQueryParams) {
  if (isBrowser) {
    const queryString = buildUrlQueryString(params);
    location.href = url.replace(/\?+$/g, "") + queryString;
  }
}

export default redirectTo;

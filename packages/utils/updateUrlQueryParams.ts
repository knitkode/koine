import { type AnyQueryParams } from "./location";
import buildUrlQueryString from "./buildUrlQueryString";
import getUrlQueryParams from "./getUrlQueryParams";
import mergeUrlQueryParams from "./mergeUrlQueryParams";

/**
 * Update a URL string query parameters merging the given new query parameters
 *
 * @category location
 * @pure
 */
export function updateUrlQueryParams(
  url: string,
  newParams: NonNullable<AnyQueryParams> = {}
) {
  const parts = url.split("?");
  const allParams = parts[1]
    ? mergeUrlQueryParams(getUrlQueryParams(url), newParams)
    : newParams;
  return parts[0] + buildUrlQueryString(allParams);
}

export default updateUrlQueryParams;

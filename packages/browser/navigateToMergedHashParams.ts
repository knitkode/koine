import {
  type AnyQueryParams,
  getUrlHashParams,
  mergeUrlQueryParams,
} from "@koine/utils";
import { navigateToHashParams } from "./navigateToHashParams";

/**
 * It updates the "query params" within the `location.hash`, it uses `location`
 *
 * @category location
 */
export function navigateToMergedHashParams(
  params: NonNullable<AnyQueryParams> = {},
  hash = "",
) {
  return navigateToHashParams(
    mergeUrlQueryParams(getUrlHashParams(hash), params),
    hash,
  );
}

export default navigateToMergedHashParams;

import getUrlQueryParams from "@koine/utils/getUrlQueryParams";
import type { AnyQueryParams } from "@koine/utils/location";
import mergeUrlQueryParams from "@koine/utils/mergeUrlQueryParams";
import { navigateToParams } from "./navigateToParams";

/**
 * Merge current URL query parameters with the given ones, it uses `history`.
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function navigateToMergedParams(
  params: NonNullable<AnyQueryParams> = {},
  replace?: boolean
) {
  return navigateToParams(
    mergeUrlQueryParams(getUrlQueryParams(), params),
    replace
  );
}

export default navigateToMergedParams;

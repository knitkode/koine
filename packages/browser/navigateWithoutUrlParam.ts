import type { AnyQueryParams } from "@koine/utils/location";
import getUrlQueryParams from "@koine/utils/getUrlQueryParams";
import navigateToParams from "./navigateToParams";

/**
 * Remove URL query parameter, it uses `history`
 *
 * @category location
 * @param replace Replace URL instead of pushing it in the history stack. By default it pushes it.
 */
export function navigateWithoutUrlParam(paramName?: string, replace?: boolean) {
  const params: NonNullable<AnyQueryParams> = {};
  const currentParams = getUrlQueryParams();
  for (const key in currentParams) {
    if (key !== paramName) {
      params[key] = currentParams[key];
    }
  }

  return navigateToParams(params, replace);
}

export default navigateWithoutUrlParam;

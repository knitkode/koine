import type { I18nUtils } from "../types";

/**
 * Given a `value` it returns a well formed URL pathname, optionally interpolating
 * the given dynamic params. These dynamic params must be expressed **consistently**
 * with one of these syntaxes:
 *
 * - `[paramName]`
 * - `{paramName}`
 * - `{{paramName}}`
 *
 * NB: White spaces between the parameter name and the brackets are supported
 *
 * @param value Either a `dot` or a `slash` _folder separator_ is required, its
 * type will be dynamically inferred by typescript. The route id could be defined
 * in all these syntaxes, subsequents separators will be normalised:
 * - `my.route.[id]`
 * - `..my.route.[id]`
 * - `my/route/[id]`
 * - `/my/route/[id]`
 * - `//my/route/[id]`
 */
export declare function interpolateTo<TRouteId extends string>(
  value: TRouteId,
): string;
export declare function interpolateTo<TRouteId extends string>(
  value: TRouteId, // RouteStrictIdDynamic<TRouteId>,
  params: I18nUtils.DynamicParams<TRouteId>,
): string;
export default interpolateTo;

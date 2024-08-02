import { getType } from "@koine/utils";
import { formatRoutePathname } from "./formatRoutePathname";
import type { I18nUtils } from "./types";

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
export function interpolateTo<TRouteId extends string>(
  value: TRouteId, // RouteStrictIdStatic<TRouteId>,
): string;
export function interpolateTo<
  TRouteId extends string,
  // TRouteParams extends DynamicParams<TRouteId>,
>(
  value: TRouteId, // RouteStrictIdDynamic<TRouteId>,
  params: I18nUtils.DynamicParams<TRouteId>,
): string;
export function interpolateTo<
  TRouteId extends string,
  // TRouteParams extends DynamicParams<TRouteId>,
>(
  value: TRouteId, // RouteStrictId<TRouteId>,
  params?: I18nUtils.DynamicParams<TRouteId>,
) {
  let pathname = value.replace(/\./g, "/");
  if (process.env["NODE_ENV"] === "development") {
    if (params) {
      pathname.replace(/[[{]{1,2}(.*?)[\]}]{1,2}/g, (_, dynamicKey) => {
        const key = dynamicKey as Extract<keyof typeof params, string>;

        if (!(key in params)) {
          throw new Error(
            "[@koine/i18n]::interpolateTo, using '" +
              value +
              "' without param '" +
              key +
              "'",
          );
        }

        if (!["string", "number"].includes(typeof params[key])) {
          throw new Error(
            "[@koine/i18n]::interpolateTo, using '" +
              value +
              "' with unserializable param  '" +
              key +
              "' (type '" +
              getType(params[key]) +
              "')",
          );
        }
        return "";
      });
    }
  }

  pathname = pathname
    ? params
      ? pathname.replace(
          /[[{]{1,2}(.*?)[\]}]{1,2}/g,
          (_, dynamicKey) =>
            params[dynamicKey.trim() as keyof typeof params] + "",
        )
      : pathname
    : // special home page case
      "/";

  return formatRoutePathname(pathname);
}

export default interpolateTo;

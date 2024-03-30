import type { I18nCompiler } from "../../compiler/types";

export default ({ config, options }: I18nCompiler.AdapterArg<"js">) => {
  const { idDelimiter } = options.routes.tokens;
  return `
import { defaultLocale } from "./defaultLocale";
import { isLocale } from "./isLocale";
import { routesSpa } from "./routesSpa";
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

/**
 * *To spa* route utility
 *
 * @returns A localised relative URL based on your i18nCompiler configuration
 */
export function toSpa<
  Root extends keyof I18n.RouteSpa,
  Path extends Extract<keyof I18n.RouteSpa[Root], string>,
>(
  rootId: Root,
  pathId: Path,
  ...args: I18n.RouteJoinedId<Root, Path> extends I18n.RouteIdDynamic
    ?
        | [I18n.RouteParams[I18n.RouteJoinedId<Root, Path>]]
        | [I18n.RouteParams[I18n.RouteJoinedId<Root, Path>], I18n.Locale]
    : [] | [I18n.Locale]
) {
  const locale = (isLocale(args[0]) ? args[0] : args[1]) || defaultLocale;
  const fullId = \`\${rootId}${idDelimiter}\${pathId}\` as I18n.RouteJoinedId<Root, Path>;
  return toFormat(
    // FIXME: actually the locale will be prepended if hideDefaultLocaleInUrl will be false
    "", // do not pass the locale so that won't be prepended
    (routesSpa[fullId] as Record<string, string>)[locale],
    args.length === 2
      ? args[0]
      : args[0] && !isLocale(args[0])
        ? args[0]
        : void 0,
  ) as I18n.RouteSpa[Root][Path];
}

export default toSpa;
`;
};

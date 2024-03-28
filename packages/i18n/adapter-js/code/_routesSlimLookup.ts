import type { I18nCompiler } from "../../compiler/types";

/**
 * @internal
 */
export const _routesSlimLookup = (
  config: I18nCompiler.Config,
  localeVarName = "locale",
) => `(routesSlim[id] as Record<string, string>)[${localeVarName}] ??
    (routesSlim[id] as Record<string, string>)["${config.defaultLocale}"] ??
    routesSlim[id]`;

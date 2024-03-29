import { changeCaseSnake, isString } from "@koine/utils";
import type { I18nCompiler } from "../../compiler/types";

const getFunctionBodyWithLocales = (
  config: I18nCompiler.Config,
  perLocaleValues: Record<string, string>,
) => {
  const { defaultLocale } = config;
  let output = "";

  for (const locale in perLocaleValues) {
    const value = perLocaleValues[locale];
    if (locale !== defaultLocale && value !== perLocaleValues[defaultLocale]) {
      output += `locale === "${locale}" ? "${value}" : `;
    }
  }

  output += '"' + perLocaleValues[defaultLocale] + '"';

  return output;
};

export default ({ config, routes, options }: I18nCompiler.AdapterArg) => {
  const hasOneLocale = config.locales.length === 1;
  let output = `
/* eslint-disable prefer-const */
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

`;

  for (const routeId in routes.byId) {
    const { pathnames, params } = routes.byId[routeId];

    const name = `${options.routes.fnsPrefix}${changeCaseSnake(routeId)}`;
    const paramsType = `I18n.RouteParams["${routeId}"]`;

    const argParam = params ? `params: ${paramsType}` : "";
    const argLocale = hasOneLocale ? "" : "locale?: I18n.Locale";
    const args = [argParam, argLocale].filter(Boolean).join(", ");
    const formatArgLocale = hasOneLocale ? `""` : "locale";
    const formatArgParams = params ? ", params" : "";

    output += `export let ${name} = (${args}) => `;

    if (isString(pathnames)) {
      output += `toFormat(${formatArgLocale}, "${pathnames}"${formatArgParams});`;
    } else {
      output += `toFormat(${formatArgLocale}, ${getFunctionBodyWithLocales(
        config,
        pathnames,
      )}${formatArgParams});`;
    }

    output += `\n`;
  }

  return output;
};

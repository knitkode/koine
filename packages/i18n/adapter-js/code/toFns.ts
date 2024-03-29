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

export default ({ config, routes, options }: I18nCompiler.AdapterArg<"js">) => {
  const hasOneLocale = config.locales.length === 1;
  let output = `
/* eslint-disable prefer-const */
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

`;
  const declarations: string[] = [];
  const functionNames: string[] = [];

  for (const routeId in routes.byId) {
    let declaration = "";
    const { pathnames, params } = routes.byId[routeId];

    const name = `${options.routes.fnsPrefix}${changeCaseSnake(routeId)}`;
    const paramsType = `I18n.RouteParams["${routeId}"]`;

    const argParam = params ? `params: ${paramsType}` : "";
    const argLocale = hasOneLocale ? "" : "locale?: I18n.Locale";
    const args = [argParam, argLocale].filter(Boolean).join(", ");
    const formatArgLocale = hasOneLocale ? `""` : "locale";
    const formatArgParams = params ? ", params" : "";

    declaration += `export let ${name} = (${args}) => `;

    if (isString(pathnames)) {
      declaration += `toFormat(${formatArgLocale}, "${pathnames}"${formatArgParams});`;
    } else {
      declaration += `toFormat(${formatArgLocale}, ${getFunctionBodyWithLocales(
        config,
        pathnames,
      )}${formatArgParams});`;
    }

    declarations.push(declaration);
    functionNames.push(name);
  }

  output += declarations.join("\n");

  // TODO: verify the impact of the following on bundle size, its relation to
  // modularizeImports and maybe make this controllable through an adapter
  // option
  output += `\n\n`;
  output += `export const toFns = {\n  ${functionNames.join(",\n  ")}\n};`;
  output += `\n\n`;
  output += `export default toFns;`;

  return output;
};

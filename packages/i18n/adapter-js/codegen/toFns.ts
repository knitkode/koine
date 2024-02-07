import { changeCaseCamel, forin, isString } from "@koine/utils";
import type { I18nCodegen } from "../../codegen";

const getFunctionBodyWithLocales = (
  config: I18nCodegen.Config,
  perLocaleValues: Record<string, string>,
) => {
  const { defaultLocale } = config;
  let output = "";
  forin(perLocaleValues, (locale, value) => {
    if (locale !== defaultLocale && value !== perLocaleValues[defaultLocale]) {
      output += `locale === "${locale}" ? "${value}" : `;
    }
  });

  output += '"' + perLocaleValues[defaultLocale] + '"';

  return output;
};

export default ({ config, data }: I18nCodegen.AdapterArg) => {
  const hasOneLocale = config.locales.length === 1;
  let output = `
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

`;

  forin(data.source.routes, (routeId, { typeName, pathnames, params }) => {
    const name = `to_${changeCaseCamel(routeId)}`;
    const paramsType = `I18n.RouteParams.${typeName}`;

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
  });

  return output;
};

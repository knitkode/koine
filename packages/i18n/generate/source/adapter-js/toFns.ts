import { changeCaseCamel, forin, isString } from "@koine/utils";
import type { I18nGenerate } from "../../types";

const getFunctionBodyWithLocales = (
  data: I18nGenerate.Data,
  perLocaleValues: Record<string, string>,
) => {
  let output = "";
  forin(perLocaleValues, (locale, value) => {
    if (
      locale !== data.defaultLocale &&
      value !== perLocaleValues[data.defaultLocale]
    ) {
      output += `locale === "${locale}" ? "${value}" : `;
    }
  });

  output += '"' + perLocaleValues[data.defaultLocale] + '"';

  return output;
};

export default (data: I18nGenerate.Data) => {
  const hasOneLocale = data.locales.length === 1;
  let output = `
import { toFormat } from "./toFormat";
import type { I18n } from "./types";

`;

  forin(data.routes, (routeId, { typeName, pathnames, dynamic }) => {
    const name = `to_${changeCaseCamel(routeId)}`;
    const paramsType = `I18n.RouteParams.${typeName}`;

    const argParam = dynamic ? `params: ${paramsType}` : "";
    const argLocale = hasOneLocale ? "" : "locale?: I18n.Locale";
    const args = [argParam, argLocale].filter(Boolean).join(", ");
    const formatArgLocale = hasOneLocale ? `""` : "locale";
    const formatArgParams = dynamic ? ", params" : "";

    output += `export const ${name} = (${args}) => `;

    if (isString(pathnames)) {
      output += `toFormat(${formatArgLocale}, "${pathnames}"${formatArgParams});`;
    } else {
      output += `toFormat(${formatArgLocale}, ${getFunctionBodyWithLocales(
        data,
        pathnames,
      )}${formatArgParams});`;
    }

    output += `\n`;
  });

  return output;
};

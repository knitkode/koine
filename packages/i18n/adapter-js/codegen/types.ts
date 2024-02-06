import { readFileSync } from "node:fs";
import { join } from "node:path";
// import { fileURLToPath } from "node:url";
import { forin, isArray, isBoolean, isObject, isString } from "@koine/utils";
import type { I18nCodegen } from "../../codegen";
import { dataParamsToTsInterfaceBody } from "../../codegen/helpers";
import {
  hasOnlyPluralKeys,
  hasPlurals,
  pickNonPluralValue,
  transformKeysForPlurals,
} from "../../codegen/pluralisation";

// const dirname = process.env["JEST_WORKER_ID"]
//   ? __dirname
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-nocheck Jest problem
//   : fileURLToPath(new URL(".", import.meta.url));

const buildTypeForObjectValue = (
  key: string | number,
  value: I18nCodegen.DataTranslationValue,
) => {
  if (!isArray(value) && isObject(value)) {
    if (hasOnlyPluralKeys(value)) {
      return `'${key}': string;`;
    }
    if (hasPlurals(value)) {
      return `'${key}': string | ${buildTypeForValue(pickNonPluralValue(value))}`;
    }
  }
  return `'${key}': ${buildTypeForValue(value)}`;
};

const buildTypeForValue = (value: I18nCodegen.DataTranslationValue) => {
  let out = "";
  let primitiveType = "";

  if (isBoolean(value)) {
    primitiveType = "boolean";
  } else if (isString(value)) {
    primitiveType = "string";
  }

  if (primitiveType) {
    out += primitiveType + ";";
  } else if (!value) {
    out += "";
  } else if (isArray(value)) {
    const firstValue = value[0];
    out += `${buildTypeForValue(firstValue)}[];`;
  } else if (isObject(value)) {
    out += "{";
    const keys = transformKeysForPlurals(Object.keys(value));

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i] as keyof typeof value;
      // fallback to a string as plurals without root definition would not get a
      // type otherwise, e.g. ` pluralNoDefault_...` in __mocks__
      const single = value[key] || "";
      out += buildTypeForObjectValue(key, single);
    }
    out += "};";
  }

  // adjust syntax
  out = out.replace(/;\[\];/g, "[];");
  out = out.replace(/;+/g, ";");

  return out;
};

const buildTranslationsTypes = (data: I18nCodegen.Data) => {
  const {
    config: { defaultLocale },
    files,
  } = data;
  const defaultLocaleFiles = files.filter((f) => f.locale === defaultLocale);
  let out = `
  export interface Translations {
`;

  for (let i = 0; i < defaultLocaleFiles.length; i++) {
    const { path, data } = defaultLocaleFiles[i];
    const namespace = path.replace(".json", "");

    out += `"${namespace}": ${buildTypeForValue(data)}\n`;
  }

  out += `
  }
`;

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  return out;
};

const buildRouteParamsInterfaces = (data: I18nCodegen.Data) => {
  let output = "\n";

  forin(data.routes, (_routeId, { typeName, params }) => {
    if (params) {
      output += `  export interface ${typeName} { ${dataParamsToTsInterfaceBody(params)} }\n`;
    }
  });

  return output;
};

const buildRoutesUnion = (
  data: I18nCodegen.Data,
  filterFn: (
    routeId: keyof I18nCodegen.Data["routes"],
    routeData: I18nCodegen.DataRoutes[string],
  ) => undefined | boolean,
) =>
  Object.keys(data.routes)
    .filter((routeId) =>
      filterFn(routeId, data.routes[routeId as keyof typeof data.routes]),
    )
    .sort()
    .map((routeId) => `"${routeId}"`)
    .join(" | ");

export default (data: I18nCodegen.Data) => {
  const routeParamsInterfaces = buildRouteParamsInterfaces(data);
  const file_types = readFileSync(join(__dirname, "../../types.ts"), "utf-8");
  const file_typesUtils = readFileSync(
    join(__dirname, "../../types-utils.ts"),
    "utf-8",
  );
  const RouteIdStatic = buildRoutesUnion(
    data,
    (_, routeData) => !routeData.params,
  );
  const RouteIdDynamic = buildRoutesUnion(
    data,
    (_, routeData) => !!routeData.params,
  );

  return `
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export namespace I18n {
  export type Locale = ${data.config.locales.map((l) => `"${l}"`).join(" | ")};
 
  export type LocalesMap<T = any> = Record<Locale, T>;

  ${buildTranslationsTypes(data)}
${file_types}
  
  // export type RouteId = keyof typeof routesSlim;
  export type RouteId = RouteIdStatic | RouteIdDynamic;
  
  // export type RouteIdStatic = I18n.Utils.RouteStrictIdStatic<RouteId>;
  export type RouteIdStatic = ${RouteIdStatic};
  
  // export type RouteIdDynamic = I18n.Utils.RouteStrictIdDynamic<RouteId>;
  export type RouteIdDynamic = ${RouteIdDynamic};
  
  /**
   * Utility standalone type to extract all children routes that starts with the
   * given string.
   *
   * This is useful to get the subroutes of an application area, e.g. all subroutes
   * of a dashboard, using it with:
   *
   * \`\`\`
   * type DashboardRoutes = RoutesChildrenOf<"dashboard">;
   * \`\`\`
   */
  export type RoutesChildrenOf<
    TStarts extends string,
    T extends string = RouteId,
  > = T extends \`\${TStarts}.\${infer First}\` ? \`\${TStarts}.\${First}\` : never;   
}

export namespace I18n.RouteParams {${routeParamsInterfaces}}

export namespace I18n.Utils {
${file_typesUtils}
}
`;
};

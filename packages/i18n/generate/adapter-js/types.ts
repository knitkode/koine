import { readFileSync } from "node:fs";
import { join } from "node:path";
// import { fileURLToPath } from "node:url";
import { forin } from "@koine/utils";
import type { I18nGenerate } from "../types";
import { generateTypesTranslations } from "./types-translations";

// const dirname = process.env["JEST_WORKER_ID"]
//   ? __dirname
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-nocheck Jest problem
//   : fileURLToPath(new URL(".", import.meta.url));

const buildRouteParamsInterfaces = (data: I18nGenerate.Data) => {
  let output = "\n";

  forin(data.routes, (_routeId, { typeName, paramsNames }) => {
    if (paramsNames) {
      // TODO: maybe use `params` to determine the right type with some kind of
      // special token used in the route id
      let type = `  export interface ${typeName} { `;
      type += paramsNames.reduce((params, paramName) => {
        params += `${paramName}: string | number; `;
        return params;
      }, "");
      type += `}`;

      output += `${type}\n`;
    }
  });

  return output;
};

const buildRoutesUnion = (
  data: I18nGenerate.Data,
  filterFn: (
    routeId: keyof I18nGenerate.Data["routes"],
    routeData: I18nGenerate.DataRoutes[string],
  ) => boolean,
) =>
  Object.keys(data.routes)
    .filter((routeId) =>
      filterFn(routeId, data.routes[routeId as keyof typeof data.routes]),
    )
    .sort()
    .map((routeId) => `"${routeId}"`)
    .join(" | ");

export default (data: I18nGenerate.Data) => {
  const routeParamsInterfaces = buildRouteParamsInterfaces(data);
  const file_types = readFileSync(
    join(__dirname, "../../../types.ts"),
    "utf-8",
  );
  const file_typesUtils = readFileSync(
    join(__dirname, "../../../types-utils.ts"),
    "utf-8",
  );
  const RouteIdStatic = buildRoutesUnion(
    data,
    (_, routeData) => !routeData.dynamic,
  );
  const RouteIdDynamic = buildRoutesUnion(
    data,
    (_, routeData) => routeData.dynamic,
  );

  return `
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export namespace I18n {
  export type Locale = ${data.locales.map((l) => `"${l}"`).join(" | ")};
 
  export type LocalesMap<T = any> = Record<Locale, T>;

  ${generateTypesTranslations(data)}
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

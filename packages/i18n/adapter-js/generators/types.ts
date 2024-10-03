import { isArray, isBoolean, isObject, isString } from "@koine/utils";
import type { CodeDataOptionsResolved } from "../../compiler/code";
import { createGenerator } from "../../compiler/createAdapter";
import {
  compileDataParamsToType,
  filterInputTranslationFiles,
} from "../../compiler/helpers";
import { ImportsCompiler } from "../../compiler/imports";
import {
  hasOnlyPluralKeys,
  hasPlurals,
  pickNonPluralValue,
  transformKeysForPlurals,
} from "../../compiler/pluralisation";
import type { I18nCompiler } from "../../compiler/types";

export function getTypeLocale(config: Pick<I18nCompiler.Config, "locales">) {
  return buildUnionType(config.locales);
}

function buildTypeForObjectValue(
  key: string | number,
  value: I18nCompiler.DataTranslationValue,
) {
  if (!isArray(value) && isObject(value)) {
    if (hasPlurals(value)) {
      return hasOnlyPluralKeys(value)
        ? `"${key}": string;`
        : `"${key}": ${buildTypeForValue(pickNonPluralValue(value))}`;
    }
  }

  return `"${key}": ${buildTypeForValue(value)}`;
}

function buildTypeForValue(value: I18nCompiler.DataTranslationValue) {
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
      // fallback to a string otherwise plurals without root definition would
      // not get a type otherwise, e.g. ` pluralNoDefault_...` in __mocks__
      const single = value[key] || "";
      out += buildTypeForObjectValue(key, single);
    }
    out += "};";
  }

  // adjust syntax
  out = out.replace(/;\[\];/g, "[];");
  out = out.replace(/;+/g, ";");

  return out;
}

function buildTranslationsDictionary(
  data: I18nCompiler.DataCode<I18nCompiler.AdapterName>,
) {
  const {
    config: { defaultLocale },
    input: { translationFiles },
    options: {
      translations: { ignorePaths },
    },
  } = data;
  const files = filterInputTranslationFiles(
    translationFiles,
    ignorePaths,
    (file) => file.locale === defaultLocale,
  );
  const out: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const { path, data } = files[i];
    const namespace = path.replace(".json", "");

    out.push(`"${namespace}": ${buildTypeForValue(data)}`);
  }

  return out.sort();
}

function buildRouteParams(routes: I18nCompiler.DataRoutes) {
  const out: string[] = [];

  for (const routeId in routes.byId) {
    const { params } = routes.byId[routeId];
    if (params) {
      out.push(`"${routeId}": ${compileDataParamsToType(params)};`);
    }
  }

  return out;
}

/**
 * Output a type union frm a given array of strings
 *
 * @param values Union possible values
 * @param sort Whether to sort the values with native `[].sort()`
 * @returns e.g. `"a" | "b" | "b"`
 */
function buildUnionType(values: string[], sort = true) {
  return (sort ? values.sort() : values)
    .filter(isString)
    .map((value) => `"${value}"`)
    .join(" | ");
}

function buildRoutesUnion(
  routes: I18nCompiler.DataRoutes,
  filterFn: (
    routeId: keyof I18nCompiler.DataRoutes["byId"],
    routeData: I18nCompiler.DataRoutes["byId"][string],
  ) => undefined | boolean,
) {
  return (
    buildUnionType(
      Object.keys(routes.byId).filter((routeId) =>
        filterFn(routeId, routes.byId[routeId]),
      ),
    ) || "never"
  );
}

function groupRoutesSpa(routes: I18nCompiler.DataRoutes) {
  return Object.keys(routes.byId).reduce(
    (map, routeId) => {
      const route = routes.byId[routeId];
      if (route.inWildcard) {
        for (let I = 0; I < routes.wildcardIds.length; I++) {
          const spaRootRouteId = routes.wildcardIds[I];

          if (routeId.startsWith(spaRootRouteId)) {
            map[spaRootRouteId] = map[spaRootRouteId] || [];
            map[spaRootRouteId].push(routeId);
          }
        }
      }
      return map;
    },
    {} as Record<I18nCompiler.RouteId, I18nCompiler.RouteId[]>,
  );
}

function buildRoutesSpa(
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
  options: CodeDataOptionsResolved,
) {
  const map = groupRoutesSpa(routes);
  const output: string[] = [];

  for (const rootRouteId in map) {
    const pathRoutesIds = map[rootRouteId].map(
      // remove the root id portion and the first character which is always
      // the route `idDelimiter`
      (fullRouteId) => fullRouteId.split(rootRouteId)[1].slice(1),
    );

    const rootPathname =
      routes.byId[rootRouteId].pathnames[config.defaultLocale];
    const pathnames: string[] = [];

    for (let i = 0; i < pathRoutesIds.length; i++) {
      const subRouteId = pathRoutesIds[i];
      const fullRouteId = `${rootRouteId}${options.routes.tokens.idDelimiter}${subRouteId}`;
      const fullPathname =
        routes.byId[fullRouteId].pathnames[config.defaultLocale];
      const pathPathname = fullPathname.split(rootPathname)[1];
      pathnames.push(`"${subRouteId}": "${pathPathname}";`);
    }

    output.push(`"${rootRouteId}": { ${pathnames.join(" ")} }`);
  }

  return output;
}

function buildRoutesPathnames(
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
) {
  const output: string[] = [];

  for (const routeId in routes.byId) {
    const route = routes.byId[routeId];
    output.push(`"${route.id}": "${route.pathnames[config.defaultLocale]}";`);
  }

  return output;
}

function toTypeObj(typeBodyLines: string[]) {
  return `{
    ${typeBodyLines.join("\n    ")}
  }`;
}

function getTypes(data: I18nCompiler.DataCode<I18nCompiler.AdapterName>) {
  const { config, routes, options } = data;

  return {
    Locale: getTypeLocale(config),
    RouteIdStatic: buildRoutesUnion(routes, (_, { params }) => !params),
    RouteIdDynamic: buildRoutesUnion(routes, (_, { params }) => !!params),
    // RouteIdSpa: buildRoutesUnion(routes, (_, { inWildcard }) => inWildcard),
    RouteSpa: toTypeObj(buildRoutesSpa(config, routes, options)),
    RoutePathnames: toTypeObj(buildRoutesPathnames(config, routes)),
    RouteParams: toTypeObj(buildRouteParams(routes)),
    TranslationsDictionary: toTypeObj(buildTranslationsDictionary(data)),
  };
}

export const getImportTypes = () =>
  new ImportsCompiler({
    path: "types",
    named: [{ name: "I18n", type: true }],
  });

// TODO: maybe move the Translate types into the various adapters unless we
// will use the same api for all of them
export default createGenerator("js", (arg) => {
  const {
    options: {
      routes: {
        localeParamName,
        tokens: { idDelimiter },
      },
      translations: {
        tokens: { keyDelimiter, namespaceDelimiter },
      },
    },
  } = arg;

  const types = getTypes(arg);

  return {
    globalTypes: {
      dir: createGenerator.dirs.internal,
      name: "globals",
      ext: "d.ts",
      index: false,
      // TODO: think about the implications of this within a monorepo
      // where different instances of this library compiled output need
      // to cohexist
      disabled: true,
      // TODO: check this global namespacing styling (now it is disabled anyway)
      //  An import alias would allow the following?
      // export {};

      // declare global {
      //     import I18n = import("../types").I18n;
      // }
      //  @follow [Import aliases are not permitted in a global augmentation](https://github.com/microsoft/TypeScript/issues/13175)
      content: () => /* j s */ `
declare namespace I18n {
  type Alternates = import("../types").I18n.Alternates;
  type Dictionaries = import("../types").I18n.Dictionaries;
  type Locale = import("../types").I18n.Locale;
  type LocalesMap = import("../types").I18n.LocalesMap;
  type Metadata = import("../types").I18n.Metadata;
  type Params = import("../types").I18n.Params;
  type Props = import("../types").I18n.Props;
  type RouteArgs = import("../types").I18n.RouteArgs;
  type RouteId = import("../types").I18n.RouteId;
  type RouteIdDynamic = import("../types").I18n.RouteIdDynamic;
  type RouteIdStatic = import("../types").I18n.RouteIdStatic;
  type RouteJoinedId = import("../types").I18n.RouteJoinedId;
  type RouteParams = import("../types").I18n.RouteParams;
  type RoutePathnames = import("../types").I18n.RoutePathnames;
  type RouteSpa = import("../types").I18n.RouteSpa;
  type RoutesChildrenOf = import("../types").I18n.RoutesChildrenOf;
  type Translate = import("../types").I18n.Translate;
  type TranslateDefault = import("../types").I18n.TranslateDefault;
  type TranslateLoose = import("../types").I18n.TranslateLoose;
  type TranslateLoosest = import("../types").I18n.TranslateLoosest;
  type TranslateNamespace = import("../types").I18n.TranslateNamespace;
  type TranslateNamespaced = import("../types").I18n.TranslateNamespaced;
  type TranslationAtPath = import("../types").I18n.TranslationAtPath;
  type TranslationAtPathFromNamespace = import("../types").I18n.TranslationAtPathFromNamespace;
  type TranslationAtPathGeneric = import("../types").I18n.TranslationAtPathGeneric;
  type TranslationQuery = import("../types").I18n.TranslationQuery;
  type TranslationsAllPaths = import("../types").I18n.TranslationsAllPaths;
  type TranslationsDictionary = import("../types").I18n.TranslationsDictionary;
  type TranslationsDictionaryLoose = import("../types").I18n.TranslationsDictionaryLoose;
  type TranslationsPaths = import("../types").I18n.TranslationsPaths;
  type TranslationsPathsAncestors = import("../types").I18n.TranslationsPathsAncestors;
  type TranslationsPathsFrom = import("../types").I18n.TranslationsPathsFrom;
}
`,
    },
    types: {
      name: "types",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import type { Split, JsonObject } from "@koine/utils";
import type { I18nUtils } from "${process.env["JEST_WORKER_ID"] ? "../../../types" : "@koine/i18n"}";
import type { RouteIdError } from "./internal/routesError";

export namespace I18n {
  /**
   * Any of the available locale code
   */
  export type Locale = ${types.Locale};
 
  /**
   * Utility to map values by all available locales
   * 
   * @usecase I need to map zendesk URLs to my project's locales
   */
  export type LocalesMap<T = any> = Record<Locale, T>;

  /**
   * Any of the available route id
   */
  export type RouteId = RouteIdStatic | RouteIdDynamic;

  /**
   * The static routes available ids
   */
  export type RouteIdStatic = ${types.RouteIdStatic};

  /**
   * The dynamic routes available ids
   */
  export type RouteIdDynamic = ${types.RouteIdDynamic};

  /**
   * Map every SPA path divided by their roots to their actual pathname value for the default locale
   */
  export type RouteSpa = ${types.RouteSpa};

  /**
   * Map every route id to its actual pathanem value for the default locale
   */
  export type RoutePathnames = ${types.RoutePathnames};

  /**
   * Route dynamic params dictionary for each dynamic route id
   */
  export type RouteParams = ${types.RouteParams};

  /**
   * Utility to join two route ids
   */
  export type RouteJoinedId<Root extends string, Tail extends string> = \`\${Root}${idDelimiter}\${Tail}\` extends RouteId ? \`\${Root}${idDelimiter}\${Tail}\` : never;

  /**
   * Extract all children routes that starts with the given string
   *
   * This is useful to get the subroutes of an application area, e.g. all subroutes
   * of a dashboard, using it with: \` type DashboardRoutes = RoutesChildrenOf<"dashboard">;\`
   */
  export type RoutesChildrenOf<
    TStarts extends string,
    T extends string = RouteId,
  > = T extends \`\${TStarts}.\${infer First}\` ? \`\${TStarts}.\${First}\` : never;

  /**
   * @internal
   */
  export type TranslationsDictionaryLoose = JsonObject;

  /**
   * The types extracted from the translations JSON files, this is a little
   * more sophisticated than the type result of \`typeof "./en/messages.json"\`
   */
  export type TranslationsDictionary = ${types.TranslationsDictionary};

  /**
   * Any of the available translations namespaces
   */
  export type TranslateNamespace = Extract<keyof TranslationsDictionary, string>;

  /**
   * Translation **value** found at a specific _path_ in the given _namespace_
   *
   * \`TPath\` can be any of all possible paths:
   * - \`myKey\` sub dictionaries within a namespace
   * - \`myKey.nested\` whatever nested level of nesting within a namespace
   */
  export type TranslationAtPathFromNamespace<
    TNamespace extends TranslateNamespace,
    TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
  > = TNamespace extends TranslateNamespace
    ? TPath extends string // TranslationsPaths<TranslationsDictionary[TNamespace]>
      ? I18nUtils.Get<TranslationsDictionary[TNamespace], TPath>
      : TranslationsDictionary[TNamespace]
    : never;

  /**
   * The generic type passed and to use with {@link TranslationAtPath} when you
   * want to build a type extending that
   */
  export type TranslationAtPathGeneric =
    | TranslateNamespace
    | TranslationsAllPaths;

  /**
   * Translation **value** found at a _path_
   *
   * \`TPath\` can be any of all possible paths begininng with a namespace:
   * - \`namespace\` only a namespace
   * - \`namespace:myKey\` sub dictionaries within a namespace
   * - \`namespace:myKey.nested\` whatever nested level of nesting
   */
  export type TranslationAtPath<TPath extends TranslationAtPathGeneric> =
    TPath extends TranslateNamespace
      ? TranslationsDictionary[TPath]
      : TPath extends \`\${infer Namespace}${namespaceDelimiter}\${infer Path}\`
        ? Namespace extends TranslateNamespace
          ? I18nUtils.Get<TranslationsDictionary[Namespace], Path>
          : never
        : never;

  /**
   * All translations paths from the given _path_
   *
   * \`TPath\` can be any of all possible paths begininng with a namespace:
   * - \`namespace\` only a namespace
   * - \`namespace:myKey\` sub dictionaries within a namespace
   * - \`namespace:myKey.nested\` whatever nested level of nesting
   */
  export type TranslationsPathsFrom<TPath extends TranslationAtPathGeneric> =
    TPath extends TranslateNamespace
      ? TranslationsPaths<TranslationsDictionary[TPath]>
      : TPath extends \`\${infer Namespace}${namespaceDelimiter}\${infer Path}\`
        ? Namespace extends TranslateNamespace
          ? I18nUtils.Get<TranslationsDictionary[Namespace], Path> extends object
            ? TranslationsPaths<I18nUtils.Get<TranslationsDictionary[Namespace], Path>>
            : TranslationsPaths<TranslationsDictionary[Namespace]>
          : never
        : never;

  /**
   * All translations _paths_ of the given one, e.g. if \`TPath\` would be
   * \`"area.main.[id].edit"\` the generated type would be the union
   * \`"area.main.[id]" | "area.main" | "area"\`.
   */
  export type TranslationsPathsAncestors<
    TPath extends string,
    TSeparator extends string = "${keyDelimiter}",
  > = I18nUtils.BuildRecursiveJoin<Split<TPath, TSeparator>, TSeparator>;

  /**
   * Recursive mapped type to extract all usable string paths from a translation
   * definition object (usually from a JSON file).
   */
  export type TranslationsPaths<T, TAsObj extends boolean = true> = I18nUtils.Paths<T, TAsObj>;

  /**
   * Recursive mapped type of all usable string paths from the whole translations
   * dictionary.
   */
  export type TranslationsAllPaths = I18nUtils.AllPaths<TranslationsDictionary>;

  /**
   * Query object to populate the returned value interpolating dynamic data.
   * 
   * @internal
   */
  export type TranslationQuery =
    | undefined
    | null
    | {
        [key: string]: string | number | boolean;
      };

  /**
   * Translate function which optionally accept a namespace as first argument
   */
  export type Translate<
    TNamespace extends TranslateNamespace | undefined = TranslateNamespace,
  > = TNamespace extends TranslateNamespace
    ? TranslateNamespaced<TNamespace>
    : TranslateDefault;

  /**
   * Translate function **without** namespace, it allows to select any of the all
   * available strings in _all_ namespaces.
   */
  export type TranslateDefault = <
    TPath extends TranslationsAllPaths,
    TFallback extends TranslationAtPath<TPath>,
    TReturn = TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: TranslationQuery,
    fallback?: TFallback
  ) => TReturn;

  /**
   * Translate function **with** namespace, it allows to select all available
   * strings _only_ in the given namespace.
   */
  export type TranslateNamespaced<TNamespace extends TranslateNamespace> = <
    TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
    TFallback extends TranslationAtPathFromNamespace<TNamespace, TPath>,
    TReturn = TranslationAtPathFromNamespace<TNamespace, TPath>,
  >(
    path: TPath,
    query?: TranslationQuery,
    fallback?: TFallback
  ) => TReturn;

  /**
   * Translate function _loose_ type, to use only in implementations that uses
   * the \`t\` function indirectly without needng knowledge of the string it needs
   * to output.
   */
  export type TranslateLoose<TFallback = string, TReturn = string> = (
    path?: any,
    query?: TranslationQuery,
    fallback?: TFallback
  ) => TReturn;

  /**
   * Translate function _loosest_ type it allows to return string or object or array
   * or whatever basically.
   */
  export type TranslateLoosest<TReturn = any> = (
    path?: any,
    query?: TranslationQuery,
    fallback?: any
  ) => TReturn;

  /**
   * @internal
   */
  export type Dictionaries = Record<string, TranslationsDictionaryLoose>;

  /**
   * @internal
   */
  export type RouteArgs<TRouteId extends RouteId | RouteIdError> =
    TRouteId extends RouteIdDynamic ? {
      id: TRouteId;
      params: TRouteId extends RouteIdDynamic ? RouteParams[TRouteId] : never;
    } : TRouteId extends RouteIdStatic | RouteIdError ? {
      id: TRouteId;
      params?: never;
    } : never;
    // | {
    //     id: TRouteId extends RouteIdDynamic ? TRouteId : never;
    //     params: TRouteId extends RouteIdDynamic ? RouteParams[TRouteId] : never;
    //   }
    // | {
    //     id: TRouteId extends RouteIdStatic | RouteIdError ? TRouteId : never;
    //     params?: undefined;
    //   };

  /**
   * Params globally available from the URL/folder structure \`${localeParamName}\`,
   * named accordingly to the \`localeParam\` option (e.g. _next.js_ folder structure
   * \`/[${localeParamName}]/my-route/page.tsx\`)
   */
  export type Params = {
    ${localeParamName}: Locale;
  };

  /**
   * Props available to each page/layout when a root \`localeParam\` is in place
   * (e.g. _next.js_ folder structure \`/[${localeParamName}]/my-route/page.tsx\`).
   */
  export type Props<P = {}> = P & {
    params: Params;
  };

  /**
   * Dictionary to generate SEO friendly alternate URLs \`<links>\` where:
   * 
   * - _key_: \`x-default\` or any valid locale code (see [Google docs](https://developers.google.com/search/docs/specialty/international/localized-versions#language-codes))
   * - _value_: fully qualified and localised absolute URL
   * 
   * It can also be an empty object, for instance with error routes.
   *
   * NOTE: this type should satisfy the nextjs type too that is:
   * TODO: maybe build a test for this
   * \`\`\`ts
   * import type { Metadata as NextMetadata } from "next";
   * 
   * type Alternates = NonNullable<NextMetadata["alternates"]>["languages"];
   * \`\`\`
   */
  export type Alternates = Record<string, string>;

  /**
   * I18n/routing related SEO metadata:
   *
   * NOTE: this type should satisfy the nextjs type too that is:
   * TODO: maybe build a test for this
   * \`\`\`ts
   * import type { Metadata as NextMetadata } from "next";
   * 
   * type Metadata = NonNullable<NextMetadata["alternates"]>;
   * \`\`\`
   */
  export type Metadata = {
    alternates: Alternates;
    canonical: null | string;
  }
}
`,
    },
  };
});

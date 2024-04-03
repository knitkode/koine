import { forin, isArray, isBoolean, isObject, isString } from "@koine/utils";
import type { CodeDataOptionsResolved } from "../../compiler/code";
import { dataParamsToTsInterfaceBody } from "../../compiler/helpers";
import {
  hasOnlyPluralKeys,
  hasPlurals,
  pickNonPluralValue,
  transformKeysForPlurals,
} from "../../compiler/pluralisation";
import type { I18nCompiler } from "../../compiler/types";

const buildTypeForObjectValue = (
  key: string | number,
  value: I18nCompiler.DataTranslationValue,
) => {
  if (!isArray(value) && isObject(value)) {
    if (hasPlurals(value)) {
      return hasOnlyPluralKeys(value)
        ? `"${key}": string;`
        : `"${key}": ${buildTypeForValue(pickNonPluralValue(value))}`;
    }
  }

  return `"${key}": ${buildTypeForValue(value)}`;
};

const buildTypeForValue = (value: I18nCompiler.DataTranslationValue) => {
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
};

const buildTranslationsDictionary = (
  config: I18nCompiler.Config,
  dataInput: I18nCompiler.DataInput,
) => {
  const { translationFiles } = dataInput;
  const { defaultLocale } = config;
  const defaultLocaleFiles = translationFiles.filter(
    (f) => f.locale === defaultLocale,
  );
  const out: string[] = [];

  for (let i = 0; i < defaultLocaleFiles.length; i++) {
    const { path, data } = defaultLocaleFiles[i];
    const namespace = path.replace(".json", "");

    out.push(`"${namespace}": ${buildTypeForValue(data)}`);
  }

  return out.sort();
};

const buildRouteParams = (routes: I18nCompiler.DataRoutes) => {
  const out: string[] = [];

  forin(routes.byId, (routeId, { params }) => {
    if (params) {
      out.push(`"${routeId}": { ${dataParamsToTsInterfaceBody(params)} };`);
    }
  });

  return out;
};

const buildUnionType = (values: string[]) =>
  values
    .sort()
    .map((routeId) => `"${routeId}"`)
    .join(" | ");

const buildRoutesUnion = (
  routes: I18nCompiler.DataRoutes,
  filterFn: (
    routeId: keyof I18nCompiler.DataRoutes["byId"],
    routeData: I18nCompiler.DataRoutes["byId"][string],
  ) => undefined | boolean,
) =>
  buildUnionType(
    Object.keys(routes.byId).filter((routeId) =>
      filterFn(routeId, routes.byId[routeId]),
    ),
  );

const groupRoutesSpa = (routes: I18nCompiler.DataRoutes) =>
  Object.keys(routes.byId).reduce(
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

const buildRoutesSpa = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
  options: CodeDataOptionsResolved,
) => {
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
};

const buildRoutesPathnames = (
  config: I18nCompiler.Config,
  routes: I18nCompiler.DataRoutes,
) => {
  const output: string[] = [];

  for (const routeId in routes.byId) {
    const route = routes.byId[routeId];
    output.push(`"${route.id}": "${route.pathnames[config.defaultLocale]}";`);
  }

  return output;
};

// TODO: maybe move the Translate types into the various adapters unless we
// will use the same api for all of them
export default ({
  config,
  input,
  routes,
  options,
}: I18nCompiler.AdapterArg<"js">) => {
  const routeIdStatic = buildRoutesUnion(routes, (_, { params }) => !params);
  const routeIdDynamic = buildRoutesUnion(routes, (_, { params }) => !!params);
  // const routeIdSpa = buildRoutesUnion(routes, (_, { inWildcard }) => inWildcard);
  const { idDelimiter } = options.routes.tokens;
  return `
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { Split } from "@koine/utils";
import type { I18nUtils } from "@koine/i18n";
import type { RouteIdError } from "./routesError";

export namespace I18n {
  /**
   * Any of the available locale code
   */
  export type Locale = ${config.locales.map((l) => `"${l}"`).join(" | ")};
 
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
  export type RouteIdStatic = ${routeIdStatic};

  /**
   * The dynamic routes available ids
   */
  export type RouteIdDynamic = ${routeIdDynamic};

  /**
   * Map every SPA path divided by their roots to their actual pathname value for the default locale
   */
  export type RouteSpa = {
    ${buildRoutesSpa(config, routes, options).join("\n    ")}
  }

  /**
   * Map every route id to its actual pathanem value for the default locale
   */
  export type RoutePathnames = {
    ${buildRoutesPathnames(config, routes).join("\n    ")}
  }

  /**
   * Route dynamic params dictionary for each dynamic route id
   */
  export type RouteParams = {
    ${buildRouteParams(routes).join("\n    ")}
  }

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
  export type TranslationsDictionaryLoose = {
    [key: string]: string | TranslationsDictionaryLoose;
  };

  /**
   * The types extracted from the translations JSON files, this is a little
   * more sophisticated than the type result of \`typeof "./en/messages.json"\`
   */
  export type TranslationsDictionary = {
    ${buildTranslationsDictionary(config, input).join("\n    ")}
  }

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
      : TPath extends \`\${infer Namespace}:\${infer Path}\`
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
      : TPath extends \`\${infer Namespace}:\${infer Path}\`
        ? Namespace extends TranslateNamespace
          ? I18nUtils.Get<TranslationsDictionary[Namespace], Path> extends object
            ? TranslationsPaths<I18nUtils.Get<TranslationsDictionary[Namespace], Path>>
            : TranslationsPaths<TranslationsDictionary[Namespace]>
          : never
        : never;

  /**
   * All translations _paths_ of the given one, e.g. if \`TPath\` would be
   * \`"dashboard.users.[id].edit"\` the generated type would be the union
   * \`"dashboard.users.[id]" | "dashboard.users" | "dashboard"\`.
   */
  export type TranslationsPathsAncestors<
    TPath extends string,
    TSeparator extends string = ".",
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
   * Unlike in \`next-translate\` we allow passing some predefined arguments as
   * shortcuts for common use cases:
   * - \`"obj"\` as a shortcut for \`{ returnObjects: true }\`
   * - \`""\` as a shortcut for \`{ fallback: "" }\`
   *
   */
  type TranslationShortcut = "obj" | "";

  /**
   * Query object to populate the returned translated string interpolating data
   * or a TranslationShortcut.
   *
   * NOTE: when using a shortcut passing TranslationOptions to \`t()\` is not supported
   * TODO: type safe this behaviour of the third argument (options).
   * 
   * @internal
   */
  export type TranslationQuery =
    | undefined
    | null
    | TranslationShortcut
    | {
        [key: string]: string | number | boolean;
      };

  /**
   * Options of the translate function or a TranslationShortcut.
   *
   * NOTE: when using a shortcut passing TranslationOptions to \`t()\` is not supported
   * TODO: type safe this behaviour of the third argument (options).
   * 
   * @internal
   */
  type TranslationOptions =
    | undefined
    | TranslationShortcut
    | {
        returnObjects?: boolean;
        fallback?: string | string[];
        default?: string;
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
    TReturn = TranslationAtPath<TPath>,
  >(
    path: TPath,
    query?: TranslationQuery,
    options?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function **with** namespace, it allows to select all available
   * strings _only_ in the given namespace.
   */
  export type TranslateNamespaced<TNamespace extends TranslateNamespace> = <
    TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
    TReturn = TranslationAtPathFromNamespace<TNamespace, TPath>,
  >(
    path: TPath,
    query?: TranslationQuery,
    options?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function _loose_ type, to use only in implementations that uses
   * the \`t\` function indirectly without needng knowledge of the string it needs
   * to output.
   */
  export type TranslateLoose<TReturn = string> = (
    path?: any,
    query?: TranslationQuery,
    options?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function _loosest_ type it allows to return string or object or array
   * or whatever basically.
   */
  export type TranslateLoosest<TReturn = any> = (
    path?: any,
    query?: TranslationQuery,
    options?: TranslationOptions,
  ) => TReturn;

  /**
   * @internal
   */
  export type Dictionaries = Record<string, TranslationsDictionaryLoose>;

  /**
   * @internal
   */
  export type RouteArgs<TRouteId extends RouteId | RouteIdError> =
    | {
        id: TRouteId extends RouteIdDynamic ? TRouteId : never;
        params: TRouteId extends RouteIdDynamic ? RouteParams[TRouteId] : never;
      }
    | {
        id: TRouteId extends RouteIdStatic | RouteIdError ? TRouteId : never;
        params?: undefined;
      };

  /**
   * Params globally available from the URL/folder structure named accordingly
   * to the \`localeParam\` option, e.g. \`lang\` for a typical folder structure
   * such as \`/[lang]/my-route/page.tsx\`.
   */
  export type Params = {
    ${options.routes.localeParamName}: Locale;
  };

  /**
   * Props available to each page/layout when a root \`localeParam\` is in place (e.g. 
   * in the typical _next.js_ folder structure \`/[lang]/my-route/page.tsx\`).
   */
  export type Props<TProps = {}> = TProps & {
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
`;
};

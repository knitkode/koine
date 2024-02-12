import { forin, isArray, isBoolean, isObject, isString } from "@koine/utils";
import type { I18nCompiler } from "../../compiler";
import { dataParamsToTsInterfaceBody } from "../../compiler/helpers";
import {
  hasOnlyPluralKeys,
  hasPlurals,
  pickNonPluralValue,
  transformKeysForPlurals,
} from "../../compiler/pluralisation";

const buildTypeForObjectValue = (
  key: string | number,
  value: I18nCompiler.DataTranslationValue,
) => {
  if (!isArray(value) && isObject(value)) {
    if (hasPlurals(value)) {
      return hasOnlyPluralKeys(value)
        ? `"${key}": string;`
        : `"${key}": string | ${buildTypeForValue(pickNonPluralValue(value))}`;
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

  // console.log("generateTypes: outputDir", outputDir, "outputPath", outputPath);
  return out.sort();
};

const buildRouteParams = (routes: I18nCompiler.DataRoutes) => {
  const out: string[] = [];

  forin(routes, (routeId, { params }) => {
    if (params) {
      out.push(`"${routeId}": { ${dataParamsToTsInterfaceBody(params)} };`);
    }
  });

  return out;
};

const buildRoutesUnion = (
  routes: I18nCompiler.DataRoutes,
  filterFn: (
    routeId: keyof I18nCompiler.DataRoutes,
    routeData: I18nCompiler.DataRoutes[string],
  ) => undefined | boolean,
) =>
  Object.keys(routes)
    .filter((routeId) => filterFn(routeId, routes[routeId]))
    .sort()
    .map((routeId) => `"${routeId}"`)
    .join(" | ");

// TODO: probably move the  Translate types into the adapter-next-translate
// unless we will use the same api for other adapters
export default ({ config, input, routes }: I18nCompiler.AdapterArg) => {
  const routeIdStatic = buildRoutesUnion(routes, (_, { params }) => !params);
  const routeIdDynamic = buildRoutesUnion(routes, (_, { params }) => !!params);

  return `
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import type { Split } from "@koine/utils";
import type { I18nUtils } from "@koine/i18n";

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
   * Route dynamic params dictionary for each dynamic route id
   */
  export type RouteParams = {
    ${buildRouteParams(routes).join("\n    ")}
  }

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
  export type TranslationShortcut = "obj" | "";

  /**
   * Query object to populate the returned translated string interpolating data
   * or a TranslationShortcut.
   *
   * NOTE: when using a shortcut passing TranslationOptions to \`t()\` is not supported
   * TODO: type safe this behaviour of the third argument (options).
   */
  export type TranslationQuery =
    | undefined
    | null
    | TranslationShortcut
    | {
        [key: string]: string | number | boolean;
      };

  /**
   * Opions of the translate function or a TranslationShortcut.
   *
   * NOTE: when using a shortcut passing TranslationOptions to \`t()\` is not supported
   * TODO: type safe this behaviour of the third argument (options).
   */
  export type TranslationOptions =
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
    s: TPath,
    q?: TranslationQuery,
    o?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function **with** namespace, it allows to select all available
   * strings _only_ in the given namespace.
   */
  export type TranslateNamespaced<TNamespace extends TranslateNamespace> = <
    TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
    TReturn = TranslationAtPathFromNamespace<TNamespace, TPath>,
  >(
    s: TPath,
    q?: TranslationQuery,
    o?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function _loose_ type, to use only in implementations that uses
   * the \`t\` function indirectly without needng knowledge of the string it needs
   * to output.
   */
  export type TranslateLoose<TReturn = string> = (
    s?: any,
    q?: TranslationQuery,
    o?: TranslationOptions,
  ) => TReturn;

  /**
   * Translate function _loosest_ type it allows to return string or object or array
   * or whatever basically.
   */
  export type TranslateLoosest<TReturn = any> = (
    s?: any,
    q?: TranslationQuery,
    o?: TranslationOptions,
  ) => TReturn;
}
`;
};

import type { Simplify } from "@koine/utils";
import type { PartialDeep } from "@koine/utils";
import type * as AdapterJs from "../adapter-js";
import type * as AdapterNext from "../adapter-next";
import type * as AdapterNextTranslate from "../adapter-next-translate";
import type * as AdapterReact from "../adapter-react";
import type { CodeDataOptionsResolved } from "./code";
import type { I18nCompilerConfigResolved } from "./config";
import type { PluralSuffix } from "./pluralisation";

export namespace I18nCompiler {
  /**
   * The i18n compiler config, if user defined config allows partiality then we
   * need to provide the defaults.
   */
  export type Config = I18nCompilerConfigResolved;

  /**
   * Branded `string`
   */
  export type Locale = string; // & { __locale: true };

  /**
   * Branded `string`
   */
  export type RouteId = string; // & { __routeId: true };

  /**
   * Branded `string`
   */
  export type RoutePathname = string; // & { __routePathname: true };

  /**
   * Dictionary where the key is the param _name_ and the value indicates
   * the **type** of the accepted param _value_
   */
  export type DataParams = Record<
    string,
    "string" | "number" | "stringOrNumber"
  >;

  /**
   * Data extracted from filesystem structure
   */
  export type DataInput = {
    /**
     * List of the translations source `.json` files
     *
     * TODO: maybe support more formats like `yml` or `.po`
     */
    translationFiles: DataInputTranslationFile[];
    /**
     * List of the locale folders found in the input source data
     */
    localesFolders: string[];
  };

  /**
   * Basic data of a translation file as read from the filesystem
   */
  export type DataInputTranslationFile = {
    /**
     * The relative path from the given `${cwd}/${locale}`
     */
    path: string;
    locale: Locale;
    data: { [key: string]: I18nCompiler.DataTranslationValue };
  };

  export type DataSummary = Record<
    Locale,
    {
      words: number;
      characters: number;
      files: DataSummaryFile[];
    }
  >;

  /**
   * {@link DataSummary}
   */
  export type DataSummaryFile = {
    locale: Locale;
    path: string;
    url: string;
    words: number;
    characters: number;
  };

  /**
   * This contains all the generated/transformed/parsed data used for code generation
   * {@link DataRoute} - {@link DataTranslations}
   */
  export type DataCode<TAdapterName extends AdapterName> = {
    config: Config;
    options: CodeDataOptionsResolved<TAdapterName>;
    input: DataInput;
    routes: DataRoutes;
    translations: DataTranslations;
  };

  export type AnyDataCode = {
    [Name in AdapterName]: DataCode<Name>;
  }[AdapterName];

  /**
   * All **routes** related data
   */
  export type DataRoutes = {
    /**
     * Flat collection of {@link DataRoute}
     */
    byId: Record<RouteId, DataRoute>;
    /**
     * Whether there are only static routes
     */
    onlyStaticRoutes: boolean;
    /**
     * Whether there are some SPA routes
     */
    haveSpaRoutes: boolean;
    /**
     * List of _wildcarded_ routes ids
     */
    wildcardIds: RouteId[];
    /**
     * List of _dynamic_ routes ids
     */
    dynamicRoutes: RouteId[];
    /**
     * List of _static_ routes ids
     */
    staticRoutes: RouteId[];
  };

  /**
   * The data shape for a single **route** entry
   */
  export type DataRoute = {
    /**
     * Unique identifier of the route
     */
    id: RouteId;
    /**
     * Function name of the route, e.g. `account_edit`
     * according to the {@link CodeDataOptionsRoutes}
     */
    fnName: string;
    /**
     * Dictionary with route ids as keys each one holding a dictionary of its
     * pathnames by locale
     */
    pathnames: Record<Locale, RoutePathname>;
    /**
     * When URLs are the same there is no `Locale` index, just a plain string
     */
    pathnamesSlim?: string | Record<Locale, RoutePathname>;
    /**
     */
    pathnamesSpa?: Record<Locale, RoutePathname>;
    /**
     * The route params dictionary {@link DataParams}}
     */
    params?: DataParams;
    /**
     * Flag routes that behave as wildcard rewrites/redirects
     */
    wildcard?: boolean;
    /**
     * Flags routes children of a wildcard route (in SPA applications subrouting)
     */
    inWildcard?: boolean;
  };

  /**
   * Flat collection of {@link DataTranslation}
   */
  export type DataTranslations = Record<string, DataTranslation>;

  /**
   * The data shape for a single **translation** entry
   */
  export type DataTranslation = {
    /**
     * Unique identifier of the translation
     */
    id: string;
    /**
     * Namespace of the translation based on the input filename it comes from
     * e.g. `myDir/myFileName`
     */
    namespace: string;
    /**
     * Dot spaced path of the translation within the file content data it comes from
     * e.g. `myObj.nestedKey.myKey`
     */
    path: string;
    /**
     * The concatenation of:
     * - `namespace`
     * - `namespaceDelimiter` from {@link CodeDataOptionsTranslations}
     * - `path`
     */
    fullKey: string;
    /**
     * Function name of the translation, e.g. `myDir_myFileName_myObj_nestedKey`
     * according to the {@link CodeDataOptionsTranslations}
     */
    fnName: string;
    /**
     * Translation' value type
     */
    typeValue: "Primitive" | "Array" | "Object";
    /**
     * Dictionary of the translation' values {@link DataTranslationValue} mapped by locale
     */
    values: Record<Locale, DataTranslationValue>;
    /**
     * Flag as `true` when all values for all locales have the same value (a.k.a.
     * there are no real translations...)
     */
    equalValues?: boolean;
    /**
     * Dictionary of the plural versions of the translations' values
     * {@link DataTranslationValue} for each plural suffix mapped by locale
     */
    pluralValues?: Record<Locale, Record<PluralSuffix, DataTranslationValue>>;
    /**
     * Indicates whether this translation has plurals versions
     */
    plural?: boolean;
    /**
     * Dictionary of the translation dynamic params to be interpolated {@link DataParams}}
     */
    params?: DataParams;
  };

  /**
   * All possible translation value (JSON serializable)
   */
  export type DataTranslationValue =
    | string
    | number
    | boolean
    | string[]
    | { [key: string]: DataTranslationValue };

  /**
   * Built in adapters definition (map)
   */
  type AdaptersOptionsMap = {
    js: AdapterJs.Options;
    react: AdapterReact.Options;
    next: AdapterNext.Options;
    "next-translate": AdapterNextTranslate.Options;
  };

  /**
   * Any adapter user-based configuration (union)
   */
  export type AnyAdapterConfiguration = {
    [Name in AdapterName]: {
      name: Name;
      options?: PartialDeep<AdaptersOptionsMap[Name]>;
    };
  }[AdapterName];

  /**
   * An adapter resolved configuration shape
   */
  type AdapterConfigurationResolvedEntry<T extends AdapterName> = {
    name: T;
  } & AdaptersOptionsMap[T];

  /**
   * Any adapter resolved configuration (union)
   */
  export type AnyAdapterConfigurationResolved = {
    [Name in AdapterName]: AdapterConfigurationResolvedEntry<Name>;
  }[AdapterName];

  /**
   * An adapter resolved configuration (generic)
   */
  export type AdapterConfigurationResolved<T extends AdapterName> =
    T extends "js"
      ? AdapterConfigurationResolvedEntry<"js">
      : T extends "react"
        ? AdapterConfigurationResolvedEntry<"react">
        : T extends "next"
          ? AdapterConfigurationResolvedEntry<"next">
          : T extends "next-translate"
            ? AdapterConfigurationResolvedEntry<"next-translate">
            : never;

  /**
   * Any resolved adapter (union)
   */
  export type AnyAdapterResolved = {
    [Name in AdapterName]: AdapterResolved<Name>;
  }[AdapterName];

  /**
   * A resolved adapter (generic)
   */
  export type AdapterResolved<T extends AdapterName> = T extends "js"
    ? Simplify<ReturnType<AdapterJs.Adapter>>
    : T extends "react"
      ? Simplify<ReturnType<AdapterReact.Adapter>>
      : T extends "next"
        ? Simplify<ReturnType<AdapterNext.Adapter>>
        : T extends "next-translate"
          ? Simplify<ReturnType<AdapterNextTranslate.Adapter>>
          : never;

  /**
   * Built in adapters names
   */
  // export type AdapterName = keyof AdaptersOptionsMap;
  export type AdapterName = "js" | "react" | "next" | "next-translate";

  /**
   * A generator within an {@link Adapter}, responsible for generating one or
   * more files/folders
   */
  export type AdapterGenerator<T extends I18nCompiler.AdapterName> = (
    data: I18nCompiler.DataCode<T>,
  ) => AdapterGeneratorResult;

  /**
   * The shape of what an {@link AdapterGenerator} returns, a dictionary of
   * files where the key is a `fileId`
   */
  export type AdapterGeneratorResult = Record<string, I18nCompiler.AdapterFile>;

  /**
   * Adapter file anatomy
   */
  export type AdapterFile = {
    /**
     * File directory, by default it is placed in the root code generation
     * configured directory see `cwd` and `output` in {@link import("./code/write.ts").CodeWriteOptions}
     * @default "."
     */
    dir?: string;
    /**
     * File name
     */
    name: string;
    /**
     * File extension
     */
    ext: "d.ts" | "ts" | "tsx" | "mjs" | "js" | "json";
    /**
     * Function that generates the file content
     */
    content: () => string;
    /**
     * Whether the generated file should be added to the automatically generated
     * `index.ts` barrel file
     */
    index: boolean;
    /**
     * Optionally disable a generator, useful for testing, developing and experiments
     */
    disabled?: boolean;
  };

  /**
   * An {@link AdapterFile} whose `content` function has been called to generate content.
   */
  export type AdapterFileGenerated = Omit<AdapterFile, "content"> & {
    /**
     * The file content as string
     */
    content: string;
    /**
     * The file full relative path: `dir`, `name` and `ext` of {@link AdapterFile}
     */
    path: string;
    /**
     * Flags generated barrel files
     */
    isBarrel: boolean;
  };
}

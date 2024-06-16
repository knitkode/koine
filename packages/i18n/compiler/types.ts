import type { SetOptional } from "@koine/utils";
import type { AdapterJs } from "../adapter-js";
import type { AdapterNext } from "../adapter-next";
import type { AdapterNextTranslate } from "../adapter-next-translate";
import type { AdapterReact } from "../adapter-react";
import type { CodeDataOptionsResolved } from "./code";
import type { I18nCompilerConfigResolved } from "./config";
import type { PluralSuffix } from "./pluralisation";

// eslint-disable-next-line @typescript-eslint/no-namespace
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
    translationFiles: DataInputTranslationFile[];
    localesFolders: string[];
  };

  /**
   * Basic metadata of a `.json` translation file as read from the filesystem
   */
  export type DataInputTranslationFile = {
    /**
     * The relative path from the given `${cwd}/${locale}`
     */
    path: string;
    locale: Locale;
    data: { [key: string]: I18nCompiler.DataTranslationValue };
  };

  /**
   * {@link DataRoute} - {@link DataTranslations}
   */
  export type DataCode = {
    config: Config;
    options: CodeDataOptionsResolved;
    input: DataInput;
    routes: DataRoutes;
    translations: DataTranslations;
  };

  /**
   * {@link DataRoute}
   */
  export type DataRoutes = {
    byId: Record<RouteId, DataRoute>;
    wildcardIds: RouteId[];
    /**
     * Whether there are only static routes
     */
    onlyStaticRoutes: boolean;
    dynamicRoutes: RouteId[];
    staticRoutes: RouteId[];
  };

  /**
   * A route metadata
   */
  export type DataRoute = {
    id: RouteId;
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
   * {@link DataTranslation}
   */
  export type DataTranslations = Record<string, DataTranslation>;

  /**
   */
  export type DataTranslation = {
    id: string;
    /**
     * Translation type
     */
    typeValue: "Primitive" | "Array" | "Object";
    /**
     * Values by locale dictionary
     */
    values: Record<Locale, DataTranslationValue>;
    /**
     * Plural versions of the values by locale dictionary
     */
    pluralValues?: Record<Locale, Record<PluralSuffix, DataTranslationValue>>;
    /**
     * Is this a translation with plurals versions
     */
    plural?: boolean;
    /**
     * The translation params dictionary {@link DataParams}}
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
   * Built in adapters with their options
   */
  export type AnyAdapter =
    | SetOptional<AdapterJs, "options">
    | SetOptional<AdapterReact, "options">
    | SetOptional<AdapterNext, "options">
    | SetOptional<AdapterNextTranslate, "options">;

  /**
   * Built in adapters with their options (resolved options)
   */
  export type AnyAdapterResolved =
    | AdapterJs
    | AdapterReact
    | AdapterNext
    | AdapterNextTranslate;

  type AdOptsFor<T extends AdaptersName> = AdaptersOptions<T> &
    (Adapter<T>["dependsOn"] extends AdaptersName[]
      ? {
          [N in Adapter<T>["dependsOn"][number] as `parent_${N}`]: {
            options: AdaptersOptions<N>;
          };
        }
      : {});

  type b = AdOptsFor<"next">;

  /**
   * Built in adapter options
   */
  type AdaptersOptions<T extends AdaptersName> = T extends "js"
    ? AdapterJs["options"]
    : T extends "react"
      ? AdapterReact["options"]
      : T extends "next"
        ? AdapterNext["options"]
        : T extends "next-translate"
          ? AdapterNextTranslate["options"]
          : never;

  /**
   * Built in adapters names
   */
  export type AdaptersName = AnyAdapter["name"];

  /**
   * Adapter creator function, either _sync_ or _async_
   */
  export type AdapterCreator<T extends AdaptersName> = (
    arg: AdapterArg<T>,
  ) => Adapter<T> | Promise<Adapter<T>>;

  /**
   * Adapter anatomy
   */
  export type Adapter<T extends AdaptersName = AdaptersName> = {
    dependsOn?: AdaptersName[];
    files: AdapterFile<T>[];
    // files: AdapterFile[];
  };

  /**
   * {@link DataCode}
   */
  export type AdapterArgData = DataCode;

  /**
   * {@link AdapterArgData}
   */
  export type AdapterArg<T extends AdaptersName = AdaptersName> =
    AdapterArgData & {
      adapterOptions: AdaptersOptions<T>;
    };
  // name: T;
  //   data: DataCode;
  // };
  //   data: Omit<DataCode, "config">;
  // } & Pick<DataCode, "config">;

  /**
   * Adapter file anatomy
   */
  export type AdapterFile<T extends AdaptersName = AdaptersName> = {
    name: string;
    /**
     * File extension
     */
    ext: "ts" | "tsx" | "mjs" | "js" | "json";
    /**
     * Function that generates the file content
     */
    fn: (arg: AdapterArg<T>) => string;
    /**
     * Whether the generated file should be added to the automatically generated
     * `index.ts` barrel file
     */
    index?: boolean;
  };

  /**
   * An {@link AdapterFile} whose `fn` has been called to generate content.
   */
  export type AdapterGeneratedFile = Omit<AdapterFile<AdaptersName>, "fn"> & {
    content: string;
  };
  // export type AdapterGeneratedFile = Omit<AdapterFile, "fn"> & {
  //   content: string;
  // };
}

import type { I18nCodegenConfig } from "./getConfig";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace I18nCodegen {
  /**
   * The i18n codegen config, if user defined config allows partiality then we
   * need to provide the defaults.
   */
  export type Config = I18nCodegenConfig;

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
   * Basic metadata of a `.json` translation file as read from the filesystem
   */
  export type TranslationFile = {
    /**
     * The relative path from the given `${cwd}/${locale}`
     */
    path: string;
    locale: Locale;
    data: { [key: string]: I18nCodegen.DataTranslationValue };
  };

  /**
   * Basic metadata of translation's root locales folders as read from the filesystem
   */
  export type LocalesFolders = {
    path: string;
    code: Locale;
  };

  /**
   * The whole I18n data extracted from folder structure and given config
   */
  export type Data = {
    config: Config;
    locales: Locale[];
    defaultLocale: Locale;
    hideDefaultLocaleInUrl: boolean;
    localesFolders: LocalesFolders[];
    files: TranslationFile[];
    routes: DataRoutes;
    translations: DataTranslations;
  };

  /**
   * {@link DataRoute}
   */
  export type DataRoutes = Record<RouteId, DataRoute>;

  /**
   * A route metadata
   */
  export type DataRoute = {
    id: RouteId;
    /**
     * The route id as TypeScript type name
     */
    typeName: string;
    /**
     * Dictionary with route ids as keys each one holding a dictionary of its
     * pathnames by locale
     */
    pathnames: Record<Locale, RoutePathname>;
    /**
     * When URLs are the same there is no `Locale` index, just a plain string
     */
    optimizedPathnames: string | Record<Locale, RoutePathname>;
    /**
     * The route params dictionary {@link DataRoutesParams}}
     */
    params: undefined | DataRoutesParams;
    /**
     * The route params name
     */
    paramsNames: undefined | string[];
    /**
     * Flag routes that have dynamic params
     */
    dynamic: boolean;
    /**
     * Flag routes that behave as wildcard rewrites/redirects
     */
    wildcard: boolean;
    /**
     * Flags routes children of a wildcard route (in SPA applications subrouting)
     */
    inWildcard: boolean;
  };

  /**
   * Dictionary where the key is the route param _name_ and the value indicates
   * the **type** of the accepted param _value_
   */
  export type DataRoutesParams = Record<
    string,
    "string" | "number" | "stringOrNumber"
  >;

  /**
   * {@link DataTranslation}
   */
  export type DataTranslations = Record<string, DataTranslation>;

  /**
   */
  export type DataTranslation = {
    id: RouteId;
    plural: boolean;
    /**
     * object keys path of a translation in the
     */
    values: Record<Locale, DataTranslationValue>;
    typeValue: "Primitive" | "Array" | "Object";
    // TODO:
    typeName: string;

    /**
     * The translation params dictionary {@link DataTranslationParams}}
     */
    params: undefined | DataTranslationParams;
    /**
     * The translation params name
     */
    paramsNames: undefined | string[];
    dynamic: boolean;
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
   * Dictionary where the key is the route param _name_ and the value indicates
   * the **type** of the accepted param _value_
   */
  export type DataTranslationParams = Record<
    string,
    "string" | "number" | "stringOrNumber"
  >;

  /**
   * Built in adapters
   */
  export type BuiltinAdapters = "js" | "next" | "next-translate";

  /**
   * Adapter anatomy
   */
  export type Adpater = (data: Data) => {
    dependsOn?: BuiltinAdapters[];
    files: AdpaterFile[];
  };

  /**
   * Adapter file anatomy
   */
  export type AdpaterFile = {
    name: string;
    /**
     * File extension
     */
    ext: "ts" | "tsx" | "mjs" | "js" | "json";
    /**
     * Function that generates the file content
     */
    fn: (data: Data) => string;
    /**
     * Whether the generated file should be added to the automatically generated
     * `index.ts` barrel file
     */
    index?: boolean;
  };

  /**
   * An {@link AdpaterFile} whose `fn` has been called to generate content.
   */
  export type AdpaterFileWithContent = Omit<AdpaterFile, "fn"> & {
    content: string;
  };
}

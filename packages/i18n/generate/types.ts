// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace I18nGenerate {
  export type Config = {
    locales: Locale[];
    defaultLocale: Locale;
    hideDefaultLocaleInUrl: boolean;
  };

  export type Locale = string; // & { __locale: true };

  export type RouteId = string; // & { __routeId: true };

  export type RoutePathname = string; // & { __routeUrl: true };

  export type TranslationFile = {
    path: string;
    locale: Locale;
    data: { [key: string]: any };
  };

  export type LocalesFolders = {
    path: string;
    code: Locale;
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
   * The whole I18n data extracted from folder structure and given config
   */
  export type Data = {
    locales: Locale[];
    defaultLocale: Locale;
    hideDefaultLocaleInUrl: boolean;
    localesFolders: LocalesFolders[];
    files: TranslationFile[];
    routes: DataRoutes;
  };

  export type BuiltinAdapters = "js" | "next" | "next-translate";

  export type Adpater = (data: Data) => {
    dependsOn?: BuiltinAdapters[];
    files: AdpaterFiles;
  };

  export type AdpaterFiles = AdpaterFile[];
  export type AdpaterFile = {
    name: string;
    /**
     * File extension
     */
    ext: "ts" | "tsx" | "js" | "json";
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

  export type SourceFile = Omit<AdpaterFile, "fn"> & {
    content: string;
  };
}

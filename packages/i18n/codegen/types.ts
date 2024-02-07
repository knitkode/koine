import type { I18nCodegenConfig, I18nCodegenConfigOptions } from "./getConfig";
import type { PluralSuffix } from "./pluralisation";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace I18nCodegen {
  /**
   * The i18n codegen config, if user defined config allows partiality then we
   * need to provide the defaults.
   */
  export type Config = I18nCodegenConfig;

  /**
   * User defined config {@link Config}
   */
  export type OptionalConfig = I18nCodegenConfigOptions;

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
   * The whole I18n data extracted from folder structure and given config
   */
  export type Data = {
    config: Config;
    fs: DataFs;
    summary: DataSummary;
    source: DataSource;
  };

  /**
   * Data extracted from filesystem structure
   */
  export type DataFs = {
    translationFiles: DataFsTranslationFile[];
    localesFolders: string[];
  };

  /**
   * Basic metadata of a `.json` translation file as read from the filesystem
   */
  export type DataFsTranslationFile = {
    /**
     * The relative path from the given `${cwd}/${locale}`
     */
    path: string;
    locale: Locale;
    data: { [key: string]: I18nCodegen.DataTranslationValue };
  };

  /**
   * {@link DataRoute} - {@link DataTranslations}
   */
  export type DataSource = {
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
    optimizedPathnames?: string | Record<Locale, RoutePathname>;
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
   * Built in adapters
   */
  export type AdapterBuiltin = "js" | "next" | "next-translate";

  /**
   * Adapter anatomy
   */
  export type Adpater = (arg: AdapterArg) => {
    dependsOn?: AdapterBuiltin[];
    files: AdpaterFile[];
  };

  export type AdapterArg = {
    config: Config;
    data: Pick<Data, "fs" | "source">;
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
    fn: (arg: AdapterArg) => string;
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

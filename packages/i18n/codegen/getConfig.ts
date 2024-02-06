import { glob } from "glob";
import { PartialDeep, mergeObjects } from "@koine/utils";
import type { I18nCodegen } from "./types";

export type I18nCodegenConfig = typeof configDefaults;

export type I18nCodegenConfigPartial = PartialDeep<I18nCodegenConfig>;

const configDefaults = {
  locales: ["en"] as I18nCodegen.Locale[],
  defaultLocale: "en" as I18nCodegen.Locale,
  hideDefaultLocaleInUrl: true,
  fs: {
    cwd: process.cwd(),
    ignore: [],
  },
  routes: {
    /** @default  "~.json" */
    translationJsonFileName: "~.json",
    tokens: {
      /** @default  "^" */
      parentReference: "^",
      /** @default  "." */
      idDelimiter: ".",
      /** @default  "*" */
      pathnameWildcard: "*",
    },
  },
  translations: {
    dynamicDelimiters: {
      start: "{{",
      end: "}}",
    },
    // TODO: add pluralisation config
    /**
     * It creates `t_` functions that returns objects and arrays to use as
     * data source.
     *
     * NB: this greatly increased the generated code, tree shaking will still
     * apply though.
     *
     * @default true
     */
    fnsAsDataSources: true,
    /**
     * Generate `namespace_tKey()` function prefix, prepended to the automatically
     * generated function names.
     *
     * @default ""
     */
    fnsPrefix: "",
    /**
     * Given a translation value as `"myKey": ["two", "words"]`:
     * - when `true`: it outputs `t_myKey_0`  and `t_myKey_1` functions
     * - when `false`: if `fnsAsDataSources` is `true` it outputs `t_myKey` otherwise
     * it outputs nothing (TODO: maybe we could log this info in this case)
     *
     * NB: It is quite unlikely that you want to set this to `true`.
     *
     * @default false
     */
    createArrayIndexBasedFns: false,
  },
};

let getLocalesFoldersFromFs = (
  config: Pick<I18nCodegenConfig, "fs" | "defaultLocale">,
) => {
  const {
    fs: { cwd, ignore },
    defaultLocale,
  } = config;

  const folders = glob
    .sync("*", {
      cwd,
      withFileTypes: true,
      ignore: [...ignore, "node_modules/**"],
      // onlyDirectories: true,
      // @see defaults https://www.npmjs.com/package/glob#dots
      // dot: false,
    })
    .filter((folder) => folder.isDirectory())
    .map((path) => path.relative()) as I18nCodegen.Locale[];

  return folders.sort((a, b) =>
    defaultLocale && a === defaultLocale ? -1 : a.localeCompare(b),
  );
};

/**
 * Get I18n codegen config with defaults
 */
export let getConfig = (options: PartialDeep<I18nCodegenConfig>) => {
  const config = mergeObjects(
    { ...configDefaults },
    options as I18nCodegenConfig,
  );

  // dynamically define locales
  config.locales = getLocalesFoldersFromFs(config);

  // ensure defaultLocale
  config.defaultLocale = config.defaultLocale || config.locales[0];

  // ensure boolean value
  config.hideDefaultLocaleInUrl = !!config.hideDefaultLocaleInUrl;

  return config;
};

import { mergeObjects } from "@koine/utils";
import type { I18nCodegen } from "./types";

export type I18nCodegenConfig = typeof configDefaults;

const configDefaults = {
  locales: ["en"] as I18nCodegen.Locale[],
  defaultLocale: "en" as I18nCodegen.Locale,
  hideDefaultLocaleInUrl: true,
  /** @default  "~.json" */
  routesTranslationJsonFileName: "~.json",
  /** @default  "^" */
  tokenParentRouteReference: "^",
  /** @default  "." */
  tokenRouteIdDelimiter: ".",
  /** @default  "*" */
  tokenRoutePathnameWildcard: "*",
  translations: {
    dynamicDelimiters: {
      start: "{{",
      end: "}}",
    },
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

/**
 * Get I18n codegen config with defaults
 */
export let getConfig = (options: Partial<I18nCodegenConfig>) =>
  mergeObjects({ ...configDefaults }, options);

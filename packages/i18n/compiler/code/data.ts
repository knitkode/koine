import { type PartialDeep, objectMergeWithDefaults } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { getCodeDataRoutes } from "./data-routes";
import { getCodeDataTranslations } from "./data-translations";

export const codeDataRoutesOptions = {
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
};

export type CodeDataRoutesOptions = typeof codeDataRoutesOptions;

export const codeDataTranslationsOptions = {
  /**
   * A list of globs to run against source files, those that are matched will be
   * ignored
   *
   * @see https://www.npmjs.com/package/minimatch
   */
  ignorePaths: [] as string[],
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
  fnsAsDataCodes: true,
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
   * - when `false`: if `fnsAsDataCodes` is `true` it outputs `t_myKey` otherwise
   * it outputs nothing (TODO: maybe we could log this info in this case)
   *
   * NB: It is quite unlikely that you want to set this to `true`.
   *
   * @default false
   */
  createArrayIndexBasedFns: false,
};

export type CodeDataTranslationsOptions = typeof codeDataTranslationsOptions;

export const codeDataOptions = {
  routes: codeDataRoutesOptions,
  translations: codeDataTranslationsOptions,
};

export type CodeDataOptions = typeof codeDataOptions;

export let getCodeData = (
  config: I18nCompiler.Config,
  options: PartialDeep<CodeDataOptions>,
  dataInput: I18nCompiler.DataInput,
) => {
  const { routes, translations } = objectMergeWithDefaults(
    codeDataOptions,
    options,
  );
  translations.ignorePaths.push(routes.translationJsonFileName);

  return {
    routes: getCodeDataRoutes(config, routes, dataInput),
    translations: getCodeDataTranslations(config, translations, dataInput),
  };
};

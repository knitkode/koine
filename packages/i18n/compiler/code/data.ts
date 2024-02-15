import { type PartialDeep, objectMergeWithDefaults } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { codeDataRoutesOptions, getCodeDataRoutes } from "./data-routes";
import {
  codeDataTranslationsOptions,
  getCodeDataTranslations,
} from "./data-translations";

const codeDataOptions = {
  routes: codeDataRoutesOptions,
  translations: codeDataTranslationsOptions,
};

export type CodeDataOptions = typeof codeDataOptions;

export let getCodeData = (
  config: I18nCompiler.Config,
  options: PartialDeep<CodeDataOptions>,
  input: I18nCompiler.DataInput,
): I18nCompiler.DataCode => {
  const optionsSafe = objectMergeWithDefaults(codeDataOptions, options);
  optionsSafe.translations.ignorePaths.push(
    optionsSafe.routes.translationJsonFileName,
  );

  // order locales
  input = {
    ...input,
    localesFolders: input.localesFolders.sort((a, b) =>
      config.defaultLocale ? -1 : a.localeCompare(b),
    ),
  };

  return {
    config,
    options: optionsSafe,
    input,
    routes: getCodeDataRoutes(config, optionsSafe.routes, input),
    translations: getCodeDataTranslations(
      config,
      optionsSafe.translations,
      input,
    ),
  };
};

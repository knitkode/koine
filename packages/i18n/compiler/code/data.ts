import { type PartialDeep, objectMergeWithDefaults } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { codeDataRoutesOptions, getCodeDataRoutes } from "./data-routes";
import {
  codeDataTranslationsOptions,
  getCodeDataTranslations,
} from "./data-translations";

const codeDataOptions = {
  adapter: {
    name: "js",
    options: {},
  },
  outputFiles: {},
  routes: codeDataRoutesOptions,
  translations: codeDataTranslationsOptions,
} satisfies CodeDataOptionsResolved;

export type CodeDataOptions = {
  adapter: I18nCompiler.AnyAdapter;
  outputFiles?: Partial<{
    // TODO: make this works with generics based on chosen adapter?
    // defaultLocale: string;
    // index: string;
    // isLocale: string;
    // locales: string;
    // routes: string;
    // routesSlim: string;
    // to: string;
    // toFns: string;
    // toFormat: string;
    // types: string;
  }>;
  routes?: PartialDeep<typeof codeDataRoutesOptions>;
  translations?: PartialDeep<typeof codeDataTranslationsOptions>;
};

export type CodeDataOptionsResolved = {
  adapter: I18nCompiler.AnyAdapterResolved;
  outputFiles: {};
  routes: typeof codeDataRoutesOptions;
  translations: typeof codeDataTranslationsOptions;
};

export let getCodeData = (
  config: I18nCompiler.Config,
  options: CodeDataOptions,
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
    // TODO: types, remove this assertion
    options: optionsSafe as CodeDataOptionsResolved,
    input,
    routes: getCodeDataRoutes(config, optionsSafe.routes, input),
    translations: getCodeDataTranslations(
      config,
      optionsSafe.translations,
      input,
    ),
  };
};

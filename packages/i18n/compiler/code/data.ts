import { type PartialDeep } from "@koine/utils";
import type { I18nCompiler } from "../types";
import { resolveAdapterOptions } from "./adapters";
import { codeDataRoutesOptions, getCodeDataRoutes } from "./data-routes";
import {
  codeDataTranslationsOptions,
  getCodeDataTranslations,
} from "./data-translations";
import type { CodeWriteOptionsResolved } from "./write";

export const defaultCodeDataOptions = {
  outputFiles: {},
  routes: codeDataRoutesOptions,
  translations: codeDataTranslationsOptions,
} satisfies Omit<CodeDataOptionsResolved<"js">, "adapter">;

/**
 * Options for _code data_ generation
 */
export type CodeDataOptions /* <TAdapterName extends I18nCompiler.AdapterName> */ =
  {
    /**
     * The adapater configuration to use for code generation.
     * Specify its `name` and `options` in an _object dictionary_.
     */
    adapter: I18nCompiler.AnyAdapterConfiguration;
    /**
     * A _dictionary_ that allows to override the filename of each generated file
     *
     * TODO: make this works with generics based on chosen adapter?
     */
    outputFiles?: Partial<{
      // defaultLocale: string;
      // index: string;
      // isLocale: string;
      // locales: string;
      // routes: string;
      // routesSlim: string;
      // to: string;
      // types: string;
    }>;
    /**
     * Options for `routes` code data generation handling
     */
    routes?: PartialDeep<typeof codeDataRoutesOptions>;
    /**
     * Options for `translations` code data generation handling
     */
    translations?: PartialDeep<typeof codeDataTranslationsOptions>;
  };

export type CodeDataOptionsResolved<
  TAdapterName extends I18nCompiler.AdapterName = I18nCompiler.AdapterName,
> = {
  adapter: I18nCompiler.AdapterConfigurationResolved<TAdapterName>;
  // adapter: I18nCompiler.AnyAdapterConfigurationResolved;
  outputFiles: {};
  routes: typeof codeDataRoutesOptions;
  translations: typeof codeDataTranslationsOptions;
  /**
   * Only here if the compiler actually `write`s.
   */
  write?: CodeWriteOptionsResolved;
};

export let getCodeData = async <TAdapterName extends I18nCompiler.AdapterName>(
  config: I18nCompiler.Config,
  options: CodeDataOptions,
  input: I18nCompiler.DataInput,
): Promise<I18nCompiler.DataCode<TAdapterName>> => {
  const resolvedOptions = await resolveAdapterOptions(options);
  return resolveCodeData(config, resolvedOptions, input);
};

export let getCodeDataSync = <TAdapterName extends I18nCompiler.AdapterName>(
  config: I18nCompiler.Config,
  options: CodeDataOptions,
  input: I18nCompiler.DataInput,
): I18nCompiler.DataCode<TAdapterName> => {
  const resolvedOptions = resolveAdapterOptions(options);
  return resolveCodeData(config, resolvedOptions, input);
};

function resolveCodeData<TAdapterName extends I18nCompiler.AdapterName>(
  config: I18nCompiler.Config,
  options: CodeDataOptionsResolved<TAdapterName>,
  input: I18nCompiler.DataInput,
) {
  options.translations.ignorePaths.push(options.routes.translationJsonFileName);

  // order locales
  input = {
    ...input,
    localesFolders: input.localesFolders.sort((a, b) =>
      config.defaultLocale ? -1 : a.localeCompare(b),
    ),
  };

  return {
    config,
    options,
    input,
    routes: getCodeDataRoutes(config, options.routes, input),
    translations: getCodeDataTranslations(config, options.translations, input),
  };
}

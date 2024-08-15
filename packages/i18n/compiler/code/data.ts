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
  routes: codeDataRoutesOptions,
  translations: codeDataTranslationsOptions,
} satisfies Omit<CodeDataOptionsResolved<"js">, "adapter" | "write">;

/**
 * Options for `routes` _code data_ generation handling
 */
export type CodeDataOptionsRoutes = typeof codeDataRoutesOptions;

/**
 * Options for `translations` _code data_ generation handling
 */
export type CodeDataOptionsTranslations = typeof codeDataTranslationsOptions;

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
     * User defined {@link CodeDataOptionsRoutes}
     */
    routes?: PartialDeep<CodeDataOptionsRoutes>;
    /**
     * User defined {@link CodeDataOptionsTranslations}
     */
    translations?: PartialDeep<CodeDataOptionsTranslations>;
  };

export type CodeDataOptionsResolved<
  TAdapterName extends I18nCompiler.AdapterName = I18nCompiler.AdapterName,
> = {
  adapter: I18nCompiler.AdapterConfigurationResolved<TAdapterName>;
  /**
   * Resolved {@link CodeDataOptionsRoutes}
   */
  routes: CodeDataOptionsRoutes;
  /**
   * Resolved {@link CodeDataOptionsTranslations}
   */
  translations: CodeDataOptionsTranslations;
  /**
   * Only here if the compiler actually `write`s
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

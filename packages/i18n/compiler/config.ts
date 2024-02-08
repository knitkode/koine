import { type PartialDeep, mergeObjects } from "@koine/utils";
import { codeDataOptions } from "./code";
import { inputDataOptions } from "./input";
import { summaryDataOptions } from "./summary";
import type { I18nCompiler } from "./types";

export type I18nCompilerConfig = typeof configDefaults;

export type I18nCompilerConfigOptions = PartialDeep<I18nCompilerConfig>;

export type I18nCompilerSharedConfig = typeof sharedConfig;

export const sharedConfig = {
  locales: ["en"] as I18nCompiler.Locale[],
  defaultLocale: "en" as I18nCompiler.Locale,
  hideDefaultLocaleInUrl: true,
};

export const configDefaults = {
  ...sharedConfig,
  input: inputDataOptions,
  code: codeDataOptions,
  summary: summaryDataOptions,
};

/**
 * Get I18n compiler config with defaults
 */
export let getConfig = (
  options: I18nCompilerConfigOptions,
  dataInput: I18nCompiler.DataInput | false,
) => {
  // dynamically define locales
  if (dataInput) options.locales = options.locales || dataInput.localesFolders;

  // ensure defaultLocale
  options.defaultLocale = options.defaultLocale || options.locales?.[0];

  // ensure boolean value
  options.hideDefaultLocaleInUrl = !!options.hideDefaultLocaleInUrl;

  const merged = mergeObjects(
    { ...configDefaults },
    options as I18nCompilerConfig,
  );

  // ensure sorted locales
  merged.locales = merged.locales.sort((a, b) =>
    merged.defaultLocale ? -1 : a.localeCompare(b),
  );
  return merged;
};

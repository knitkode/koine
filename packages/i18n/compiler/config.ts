import { mergeObjects } from "@koine/utils";
import type { I18nCompiler } from "./types";

export type I18nCompilerConfig = typeof configDefaults;

export const configDefaults = {
  locales: ["en"] as I18nCompiler.Locale[],
  defaultLocale: "en" as I18nCompiler.Locale,
  hideDefaultLocaleInUrl: true,
};

/**
 * Get basic i18n compiler config with defaults and automatic inference from
 * input data
 */
export let getConfig = (
  dataInput: I18nCompiler.DataInput,
  options: Partial<I18nCompilerConfig> = {},
) => {
  // dynamically define locales
  options.locales = options.locales || dataInput.localesFolders;

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

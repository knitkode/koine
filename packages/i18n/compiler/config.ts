import { normaliseUrl, objectMergeWithDefaults } from "@koine/utils";
import type { I18nCompiler } from "./types";

export type I18nCompilerConfig = {
  /**
   * Used to generate SEO optimized alternate URLs
   *
   * NB: It will be normalised and trailing slash stripped out in order to ease
   * and make consistent a simple concatenation with relative URLs.
   */
  baseUrl: `http://${string}` | `https://${string}` | string;
  defaultLocale: I18nCompiler.Locale;
  locales?: I18nCompiler.Locale[];
  hideDefaultLocaleInUrl?: boolean;
};

export type I18nCompilerConfigResolved = Required<
  Omit<I18nCompilerConfig, "baseUrl"> & {
    baseUrl: string;
  }
>;

export const configDefaults = {
  baseUrl: "https://example.com",
  locales: ["en"],
  defaultLocale: "en",
  hideDefaultLocaleInUrl: true,
} satisfies I18nCompilerConfigResolved;

/**
 * Get basic i18n compiler config with defaults and automatic inference from
 * input data
 */
export let getConfig = (
  dataInput: I18nCompiler.DataInput,
  options: I18nCompilerConfig = configDefaults,
) => {
  options.baseUrl = normaliseUrl(options.baseUrl);

  // dynamically define locales
  options.locales = options.locales || dataInput.localesFolders;

  // ensure defaultLocale
  options.defaultLocale = options.defaultLocale || options.locales?.[0];

  // ensure boolean value
  options.hideDefaultLocaleInUrl = !!options.hideDefaultLocaleInUrl;

  const merged = objectMergeWithDefaults(configDefaults, options);

  // ensure sorted locales
  merged.locales = merged.locales.sort((a, b) =>
    merged.defaultLocale ? -1 : a.localeCompare(b),
  );
  return merged;
};

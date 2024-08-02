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
  /**
   * By default this is computed by reading the folder structure of your translations
   * @default ["en"]
   */
  locales?: I18nCompiler.Locale[];
  /**
   * By default this is computed by using the first locale computed or defined
   * @default "en"
   */
  defaultLocale: I18nCompiler.Locale;
  /**
   * @default true
   */
  hideDefaultLocaleInUrl?: boolean;
  /**
   * @default false
   */
  trailingSlash?: boolean;
  /**
   * @default false
   */
  debug?: boolean;
};

export type I18nCompilerConfigResolved = Required<I18nCompilerConfig> & {
  /**
   * Whether we have only a single locale.
   *
   * @computed
   */
  single: boolean;
};

export const configDefaults: I18nCompilerConfigResolved = {
  baseUrl: "https://example.com",
  locales: ["en"],
  defaultLocale: "en",
  hideDefaultLocaleInUrl: true,
  trailingSlash: false,
  debug: false,
  single: true,
};

/**
 * Get basic i18n compiler config with defaults and automatic inference from
 * input data
 */
export let getConfig = (
  dataInput: I18nCompiler.DataInput,
  options?: I18nCompilerConfig,
) => {
  if (options) {
    options.baseUrl = normaliseUrl(options.baseUrl);

    // dynamically define locales
    options.locales = options.locales || dataInput.localesFolders;

    // ensure defaultLocale
    options.defaultLocale = options.defaultLocale || options.locales?.[0];

    // ensure boolean value
    options.hideDefaultLocaleInUrl = !!options.hideDefaultLocaleInUrl;
  } else if (dataInput) {
    options = {} as I18nCompilerConfig;

    // dynamically define locales
    options.locales = dataInput.localesFolders;
  }

  const merged = objectMergeWithDefaults(configDefaults, options);

  // ensure sorted locales
  merged.locales = merged.locales.sort((a, b) =>
    merged.defaultLocale ? -1 : a.localeCompare(b),
  );

  // compute single
  merged.single = merged.locales.length === 1;

  return merged;
};

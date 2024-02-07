import { type PartialDeep, mergeObjects } from "@koine/utils";
import { dataFsConfig } from "./getDataFs";
import { dataSourceConfig } from "./getDataSource";
import { dataSummaryConfig } from "./getDataSummary";
import type { I18nCodegen } from "./types";

export type I18nCodegenConfig = typeof configDefaults;

export type I18nCodegenConfigOptions = PartialDeep<I18nCodegenConfig>;

export const configDefaults = {
  locales: ["en"] as I18nCodegen.Locale[],
  defaultLocale: "en" as I18nCodegen.Locale,
  hideDefaultLocaleInUrl: true,
  /**
   * Config _fs_
   */
  fs: dataFsConfig,
  /**
   * Config _source_
   */
  source: dataSourceConfig,
  /**
   * Config _summary_
   */
  summary: dataSummaryConfig,
};

/**
 * Get I18n codegen config with defaults
 */
export let getConfig = (
  options: I18nCodegenConfigOptions,
  dataFs?: I18nCodegen.DataFs,
) => {
  if (dataFs) {
    // dynamically define locales
    options.locales = options.locales || dataFs.localesFolders;

    // ensure defaultLocale
    options.defaultLocale = options.defaultLocale || options.locales[0];

    // ensure boolean value
    options.hideDefaultLocaleInUrl = !!options.hideDefaultLocaleInUrl;
  }

  const merged = mergeObjects(
    { ...configDefaults },
    options as I18nCodegenConfig,
  );

  // ensure sorted locales
  merged.locales = merged.locales.sort((a, b) =>
    merged.defaultLocale ? -1 : a.localeCompare(b),
  );
  return merged;
};

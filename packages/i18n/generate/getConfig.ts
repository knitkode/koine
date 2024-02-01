import type { I18nGenerate } from "./types";

/**
 * @deprecated
 */
export function getConfig(
  options: Partial<I18nGenerate.Config>,
): I18nGenerate.Config {
  return {
    locales: options.locales || ["en"],
    defaultLocale: options.defaultLocale || "en",
    hideDefaultLocaleInUrl: !!options.hideDefaultLocaleInUrl,
  };
}

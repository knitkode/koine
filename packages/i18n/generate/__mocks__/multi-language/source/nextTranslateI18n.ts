import { defaultLocale } from "./defaultLocale";
import { locales } from "./locales";

/**
 * Get shared 'next-translate' configuration
 *
 * @see https://github.com/vinissimus/next-translate#how-are-translations-loaded
 *
 * @param {Partial<import("next-translate").I18nConfig>} config
 * @return {import("next-translate").I18nConfig}
 */
export function translate(config = {}) {
  return {
    locales,
    defaultLocale,
    logBuild: false,
    // logger: () => void 0,
    loadLocaleFrom: (locale: string, namespace: string) =>
      import(`./translations/${locale}/${namespace}.json`).then(
        (m) => m.default as string,
      ),
    ...config,
  };
}

export default translate;

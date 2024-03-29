/**
 * Get 'next-translate' configuration
 *
 * @see https://github.com/vinissimus/next-translate#how-are-translations-loaded
 *
 * @param {Omit<Partial<import("next-translate").I18nConfig>, "pages"> & { pages: Record<string, import("./types").I18n.TranslateNamespace[]> }} config
 */
module.exports = (config = { pages: {} }) => {
  return {
    locales: ["en"],
    defaultLocale: "en",
    logBuild: false,
    // logger: () => void 0,
    loadLocaleFrom: (locale, namespace) =>
      import(`./translations/${locale}/${namespace}.json`).then(
        (m) => m.default,
      ),
    ...config,
  };
};

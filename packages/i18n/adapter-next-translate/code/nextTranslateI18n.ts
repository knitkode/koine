import type { I18nCompiler } from "../../compiler/types";

export default ({
  config,
  adapterOptions,
}: I18nCompiler.AdapterArg<"next-translate">) => {
  const { loader } = adapterOptions;
  return `
  /**
   * Get 'next-translate' configuration
   *
   * @see https://github.com/vinissimus/next-translate#how-are-translations-loaded
   * 
   * @param {Omit<Partial<import("next-translate").I18nConfig>, "pages"> & { pages: Record<string, import("./types").I18n.TranslateNamespace[]> }} config
   */
  module.exports = (config = { pages: {} }) => {
    return {
      locales: [${config.locales.map((l) => `"${l}"`).join(", ")}],
      defaultLocale: "${config.defaultLocale}",
      logBuild: false,${loader ? "\n      loadLocaleFrom: (locale, namespace) => import(`./translations/${locale}/${namespace}.json`).then((m) => m.default)," : ""}
      ...${JSON.stringify(adapterOptions)},
      ...config,
    };
  }
  `;
};

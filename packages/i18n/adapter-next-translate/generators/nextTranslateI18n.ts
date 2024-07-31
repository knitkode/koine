import { createGenerator } from "../../compiler/createAdapter";
import { getTranslationsDir } from "../../compiler/helpers";

export default createGenerator("next-translate", (data) => {
  const {
    config,
    options: {
      adapter: { name, ...adapterOptions },
    },
  } = data;
  return {
    nextTranslateI18n: {
      name: "nextTranslateI18n",
      ext: "js",
      content: () => /* js */ `
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
    logBuild: false,${adapterOptions.loader ? `\n      loadLocaleFrom: (locale, namespace) => import(\`${getTranslationsDir(0)}/\${locale}/\${namespace}.json\`).then((m) => m.default),` : ``}
    ...${JSON.stringify(adapterOptions)},
    ...config,
  };
}
`,
    },
  };
});

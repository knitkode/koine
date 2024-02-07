import type { I18nCodegen } from "../../codegen";

export default ({ config }: I18nCodegen.AdapterArg) => `
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
    logBuild: false,
    // logger: () => void 0,
    loadLocaleFrom: (locale, namespace) => import(\`./translations/\${locale}/\${namespace}.json\`).then((m) => m.default),
    ...config,
  };
}
`;

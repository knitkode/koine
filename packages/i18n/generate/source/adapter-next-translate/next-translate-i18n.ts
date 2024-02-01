// import type { I18nGenerate } from "../../types";

export default (/* data: I18nGenerate.Data, */) => `
import type { I18nConfig } from "next-translate";
import { locales } from "./locales";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

type NextTranslateConfig = Omit<Partial<I18nConfig>, "pages"> & {
  pages: Record<string, I18n.TranslateNamespace[]>
};

/**
 * Get 'next-translate' configuration
 *
 * @see https://github.com/vinissimus/next-translate#how-are-translations-loaded
 */
export function translate(config: NextTranslateConfig = { pages: {} }) {
  return {
    locales,
    defaultLocale,
    logBuild: false,
    // logger: () => void 0,
    loadLocaleFrom: (locale: string, namespace: string) => import(\`./translations/\${locale}/\${namespace}.json\`).then((m) => m.default as string),
    ...config,
  };
}

export default translate;
`;

import { getI18nDictionaries_inline } from "../../adapter-js/code/getI18nDictionaries_inline";
import type { I18nCompiler } from "../../compiler/types";

export default ({
  // config: { single },
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
import { I18nTranslateProvider } from "./I18nTranslateProvider";
import { defaultLocale } from "./defaultLocale";
import { getLocale } from "./getLocale";
// import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18n } from "./types";
${getI18nDictionaries_inline()}

export type I18nLayoutProps = React.PropsWithChildren<{
  /**
   * Optionally set this manually to override the current locale
   */
  locale?: I18n.Locale;
  namespaces?: I18n.TranslateNamespace[];
}>;

/**
 * Optionally use this _in each_ \`layout.tsx\` where you have some translations
 * specific to that layout and its descendant layouts and pages
 * 
 * **For App Router only**
 */
export const I18nLayout = async ({
  locale,
  namespaces = [],
  children,
}: I18nLayoutProps) => {
  locale = locale || getLocale();
  const dictionaries = await getI18nDictionaries({ locale, namespaces });

  return (
    <I18nTranslateProvider
      locale={locale}
      dictionaries={dictionaries}
    >
      {children}
    </I18nTranslateProvider>
  );
};

/**
 * Optionally Use this _only in_ \`layout.tsx\` to get the current _locale_.
 *
 * **For App Router only**
 */
I18nLayout.locale = getLocale;
I18nLayout.getLocale = getLocale;

export default I18nLayout;
`;

// import { getI18nDictionaries_inline } from "../../adapter-js/code/getI18nDictionaries_inline";
import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
import { defaultLocale } from "./defaultLocale";
import { I18nLocaleContext } from "./I18nLocaleContext";
import type { I18n } from "./types";

export type I18nLayoutLangProps = React.PropsWithChildren<{
  locale?: I18n.Locale;
}>;

/**
 * Use this _only once_ in \`app/[${localeParamName}]/layout.tsx\` to set the locale context
 * value server side
 *
 * **For App Router only**
 */
export const I18nLayoutLang = async ({
  locale = defaultLocale,
  children,
}: I18nLayoutLangProps) => {
  I18nLocaleContext.set(locale);

  return (
    <I18nLocaleContext.Provider value={locale}>
      {children}
    </I18nLocaleContext.Provider>
  );
};

export default I18nLayoutLang;
`;

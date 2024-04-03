import { getI18nDictionaries_inline } from "../../adapter-js/code/getI18nDictionaries_inline";
import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
import { I18nProvider } from "./I18nProvider";
import { defaultLocale } from "./defaultLocale";
// import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18n } from "./types";

${getI18nDictionaries_inline()}

export type I18nLayoutProps = React.PropsWithChildren<{
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
  locale = defaultLocale,
  namespaces = [],
  children,
}: I18nLayoutProps) => {
  const dictionaries = await getI18nDictionaries({ locale, namespaces });

  return (
    <I18nProvider
      locale={locale}
      dictionaries={dictionaries}
    >
      {children}
    </I18nProvider>
  );
};

export default I18nLayout;
`;

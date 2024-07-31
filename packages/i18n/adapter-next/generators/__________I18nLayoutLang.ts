import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    options: {
      routes: { localeParamName },
    },
  } = arg;
  return {
    I18nLayoutLang: {
      dir: "server",
      name: "I18nLayoutLang",
      ext: "tsx",
      index: true,
      content: () => /* js */ `
import React from "react";
import { defaultLocale } from "../defaultLocale";
import { locales } from "../locales";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";
import { I18nLocaleContext } from "./I18nLocaleContext";

export type I18nLayoutLangProps = React.PropsWithChildren<{
  locale?: I18n.Locale;
}>;

/**
 * Use this _only once_ in \`app/[${localeParamName}]/layout.tsx\` to set the
 * locale context value server side
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

type Configurator = {
  /**
   * Optionally override the locale read from the URL param \`[${localeParamName}]\`
   */
  locale?: I18n.Locale;
};

/**
 * @example
 * 
 * \`\`\`
 * type Props = {
 *   params: {
 *     slug: string;
 *   };
 * };
 * 
* const i18nLayoutLang = i18nServer.layoutLang<Props>(async (_props, _locale) => {
*   return {
*     namespaces: ["common"],
*   };
* });
 * \`\`\`
 */
export const createI18nLayoutLang = <TProps extends {}>(
  // configurator: (props: I18n.Props & TProps, locale: I18n.Locale) => Configurator | Promise<Configurator>
) => {
  return {
    generateStaticParams: () => {
      return locales.map((l) => ({ ${localeParamName}: l }));
    },
    default: (impl: (props: I18n.Props & TProps & React.PropsWithChildren<{
      I18nProvider: ((props: React.PropsWithChildren) => React.ReactNode) & {
        htmlAttrs: Pick<React.ComponentPropsWithoutRef<"html">, "lang" | "dir">;
      }
    }>, locale: I18n.Locale) => React.ReactNode | Promise<React.ReactNode>) => {
      return async (props: I18n.Props & TProps) => {
        // const locale = props.params.${localeParamName};
        const locale = getLocale();
        const I18nProvider = () => <I18nLayoutLang locale={locale} />;
        // TODO: determine "dir" dynamically
        I18nProvider.htmlAttrs = { lang: locale, dir: "ltr" };
        const render = await impl({ ...props, I18nProvider }, locale);
        return render;
      }
    }
  }
};

export default I18nLayoutLang;
`,
    },
  };
});

import { getI18nDictionaries_inline } from "../../adapter-js/generators/getI18nDictionaries_inline";
import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    options: {
      routes: { localeParamName },
    },
  } = arg;

  return {
    I18nLayout: {
      dir: "server",
      name: "I18nLayout",
      ext: "tsx",
      // index: true,
      content: () => /* js */ `
import React from "react";
// import { getI18nDictionaries } from "../getI18nDictionaries";
import { defaultLocale } from "../defaultLocale";
import { I18nTranslateProvider } from "../I18nTranslateProvider";
import { locales } from "../locales";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";
import { I18nLayoutRoot } from "./I18nLayoutRoot";
// import { I18nNotFound } from "./I18nNotFound";
import { I18nLocaleContext } from "./I18nLocaleContext";
${getI18nDictionaries_inline(1)}

export type I18nLayoutProps = React.PropsWithChildren<Configurator>;

/**
 * Optionally use this _in each_ \`layout.tsx\` where you have some translations
 * to expose to the client components specific to that layout and its descendant
 * layouts and pages
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

  I18nLocaleContext.set(locale);

  return (
    <I18nLocaleContext.Provider value={locale}>
      <I18nTranslateProvider
        locale={locale}
        dictionaries={dictionaries}
      >
        {children}
      </I18nTranslateProvider>
    </I18nLocaleContext.Provider>
  );
};

/**
 * Optionally use this _only in each_ \`layout.tsx\` to get the current _locale_
 * from the layout props.
 *
 * **For App Router only**
 */
I18nLayout.locale = (props: any) => props.params.${localeParamName};

type Configurator = {
  /**
   * Optionally set this manually to override the current locale
   */
  locale?: I18n.Locale;
  /**
   * Optionally set the translations _namespaces_ to expose to the client
   * components down this layout's components tree
   */
  namespaces?: I18n.TranslateNamespace[];
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
 * const i18nLayout = i18nServer.layout<Props>(async (_props, _locale) => {
 *   return {
 *     namespaces: ["dashboard"],
 *   };
 * });
 * \`\`\`
 */
export const createI18nLayout = <TProps extends {}>(
  configurator?: (props: I18n.Props & TProps, locale: I18n.Locale) => Configurator | Promise<Configurator>
) => {
  return {
    notFound: () => {
      // <I18nNotFound />
    },
    generateStaticParams: () => {
      return locales.map((l) => ({ ${localeParamName}: l }));
    },
    default: (
      impl: (
        props: I18n.Props<
          TProps & React.PropsWithChildren<{
            i18nHtmlAttrs: Pick<React.ComponentPropsWithoutRef<"html">, "lang" | "dir">
          }>
        >,
        locale: I18n.Locale
      ) => React.ReactNode | Promise<React.ReactNode>
    ) => {
      return async (props: I18n.Props<TProps>) => {
        // const locale = props.params.${localeParamName};
        const locale = getLocale();
        // TODO: determine "dir" dynamically
        const i18nHtmlAttrs = { lang: locale, dir: "ltr" };
        const options = configurator ? await configurator(props, locale) : {};
        const inner = await impl({ ...props, i18nHtmlAttrs }, locale);
        return (<I18nLayout {...options}>{inner}</I18nLayout>);
      }
    }
  }
};

createI18nLayout.Root = I18nLayoutRoot;

export default I18nLayout;
`,
    },
  };
});

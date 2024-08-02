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
import type { Metadata } from "next/types";
import { rtlLocales } from "@koine/i18n";
// import { getI18nDictionaries } from "../getI18nDictionaries";
import { defaultLocale } from "../defaultLocale";
import { I18nTranslateProvider } from "../I18nTranslateProvider";
import { locales } from "../locales";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";
import { I18nLayoutRoot } from "./I18nLayoutRoot";
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
 * 
 * // 1) configure and create a layout
 * 
 * // with a simple object
 * const layout = i18nServer.layout({
 *   namespaces: ["dashboard"],
 * });
 * 
 * // or with a function (async supported)
 * type Props = { params: { slug: string; }; };
 * 
 * const layout = i18nServer.layout((props: Props, locale) => {
 *   return {
 *     namespaces: ["dashboard"],
 *   };
 * });
 * 
 * // 2) export the metadata (maybe only in /app/[${localeParamName}]/layout.tsx)
 * 
 * // with a sync function
 * export const generateMetadata = layout.generateMetadata((props) => {
 *    return {};
 * });
 * 
 * // or an async function
 * export const generateMetadata = layout.generateMetadata(async (props) => {
 *    return {};
 * });
 * 
 * // 3) export the default component
 * 
 * // 3a) in /app/[${localeParamName}]/layout.tsx)
 * 
 * // only thing to do is to spread the i18nHtmlAttrs prop on the <html> element
 * export default layout.default((props) => {
 *   const { i18nHtmlAttrs, children } = props;
 * 
 *   return (
 *     <html {...i18nHtmlAttrs}>
 *       <head />
 *       <body>{children}</body>
 *     </html>
 *   );
 * });
 * 
 * // 3b) in /app/[${localeParamName}]/ ...folders... /layout.tsx)
 * 
 * // with a sync function (if you do not need to await)
 * export default layout.default((props) => {
 *    return <>{props.route.id} {props.locale}</>;
 * });
 * 
 * // or an async function (if you need to await)
 * export default layout.default(async (props) => {
 *   const data = await fetch(...);
 *   return <>{props.route.id} {props.locale}</>;
 * });
 * \`\`\`
 */
export const createI18nLayout = <
  TProps extends {},
>(
  configurator?:
    | ((
        props: I18n.Props<TProps>,
        locale: I18n.Locale,
      ) => Configurator | Promise<Configurator>)
    | Configurator,
) => {
  const resolveConfigurator = async (props: I18n.Props<TProps>) => {
    const localeParam = props.params?.${localeParamName};
    const config = configurator
      ? typeof configurator === "function"
        ? await configurator(props, localeParam)
        : configurator
      : null;
    const { locale: localeConfig, ...restConfig } = config || {};
    const locale = localeConfig || getLocale();
    return { ...restConfig, locale };
  };

  return {
    generateStaticParams: () => locales.map((l) => ({ ${localeParamName}: l })),
    generateMetadata: (
      impl: (
        props: TProps & { locale: I18n.Locale },
      ) => Metadata | Promise<Metadata>,
    ) => {
      return async (props: I18n.Props<TProps>): Promise<Metadata> => {
        const { locale } = await resolveConfigurator(props);
        const metadata = await impl({ locale, ...props });
        return metadata;
      };
    },
    default: (
      impl: (
        props: TProps & { locale: I18n.Locale } & React.PropsWithChildren<{
            i18nHtmlAttrs: Pick<
              React.ComponentPropsWithoutRef<"html">,
              "lang" | "dir"
            >;
          }>,
      ) => React.ReactNode | Promise<React.ReactNode>,
    ) => {
      return async (props: I18n.Props<TProps>) => {
        const config = await resolveConfigurator(props);
        const { locale } = config;
        const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
        const i18nHtmlAttrs = { lang: locale, dir };
        const render = await impl({ locale, i18nHtmlAttrs, ...props });
        return <I18nLayout {...config}>{render}</I18nLayout>;
      };
    },
  };
};

createI18nLayout.Root = I18nLayoutRoot;

export default I18nLayout;
`,
    },
  };
});

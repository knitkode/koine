import { createGenerator } from "../../../compiler/createAdapter";
import { GLOBAL_I18N_IDENTIFIER } from "../../../compiler/helpers";

export default createGenerator("next", (arg) => {
  const {
    options: {
      routes: { localeParamName },
    },
  } = arg;

  return {
    I18nLayout: {
      dir: createGenerator.dirs.server,
      name: "I18nLayout",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
import React from "react";
import type { Metadata } from "next/types";
import { i18nConsole, i18nRtlLocales } from "@koine/i18n";
import { getI18nDictionaries } from "../internal/getI18nDictionaries";
import { I18nTranslateProvider } from "../I18nTranslateProvider";
import { locales } from "../locales";
import type { I18n } from "../types";
import { I18nLayoutRoot } from "./I18nLayoutRoot";
import {
  type NextProps,
  type I18nNextPropsLayout,
  type I18nProps,
  type I18nServerConfigurator,
  resolveConfigurator,
} from "./i18nServerHelpers";

type Config = {
  /**
   * Optionally set this manually to override the current locale
   */
  locale?: I18n.Locale;
  /**
   * Optionally set the translations _namespaces_ to expose to the client
   * components down this layout's components tree
   */
  namespaces?: I18n.TranslationsNamespace[];
};

export type I18nLayoutProps = React.PropsWithChildren<Config>;

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
  // if (!locale && !namespaces.length) {
  //   return <>{children}</>;
  // }

  // locale = locale || getLocale();
  const dictionaries = namespaces.length
    ? await getI18nDictionaries({ locale, namespaces })
    : {};

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
 * @example
 * 
 * \`\`\`ts
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
 * const layout = i18nServer.layout<Props>((props, locale) => {
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
 * // 3a) in /app/[${localeParamName}]/layout.tsx and /app/not-found.tsx
 * 
 * // first spread the i18nHtmlAttrs prop on the <html> element, then render
 * // the {I18nScript} node in the <body>
 * export default layout.default((props) => {
 *   const { i18nHtmlAttrs, children } = props;
 * 
 *   return (
 *     <html {...i18nHtmlAttrs}>
 *       <head />
 *       <body>
 *         {I18nScript}
 *         {children}
 *       </body>
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
export const createI18nLayout =
  <TProps extends I18nNextPropsLayout>() =>
  <TConfigurator extends I18nServerConfigurator<Config, TProps>>(
    configurator?: TConfigurator,
  ) => ({
    generateStaticParams: () => locales.map((l) => ({ ${localeParamName}: l })),
    generateMetadata: (
      impl: (
        props: I18nProps<TProps, Config, TConfigurator>,
      ) => Metadata | Promise<Metadata>,
    ) => {
      return async (rawProps: NextProps<TProps>) => {
        const { params: _rawParams, ...rawPropsWithoutParams } = rawProps;
        const config = await resolveConfigurator<TProps, Config, TConfigurator>(
          rawProps as unknown as TProps,
          configurator,
        );
        const { locale, params } = config;
        const metadata = await impl({
          ...rawPropsWithoutParams,
          locale,
          params,
        } as unknown as I18nProps<TProps, Config, TConfigurator>);
        return metadata;
      };
    },
    default: (
      impl: (
        props: I18nProps<TProps, Config, TConfigurator> &
          React.PropsWithChildren<{
            /**
             * Render this in
             * - \`/app/[${localeParamName}]/layout.tsx\`
             * - \`/app/not-found.tsx\`
             */
            I18nScript: React.ReactNode;
            /**
             * Spread this prop on the \`<html {...i18nHtmlAttrs}>\` element in:
             * - \`app/[${localeParamName}]/layout.tsx\`
             * - \`app/not-found.tsx\`
             */
            i18nHtmlAttrs: Pick<
              React.ComponentPropsWithoutRef<"html">,
              "lang" | "dir"
            >
          }>,
      ) => React.ReactNode | Promise<React.ReactNode>,
    ) => {
      return async (rawProps: NextProps<TProps>) => {
        const { params: _rawParams, ...rawPropsWithoutParams } = rawProps;
        const config = await resolveConfigurator<TProps, Config, TConfigurator>(
          rawProps as unknown as TProps,
          configurator,
        );
        const { locale, namespaces, params } = config;${createGenerator.log(arg, "layout.default", "resolveConfigurator", "locale")}
        const dir = i18nRtlLocales.includes(locale) ? "rtl" : "ltr";
        const i18nHtmlAttrs = { lang: locale, dir };
        const I18nScript = (
          <script
            dangerouslySetInnerHTML={{
              __html: \`globalThis.${GLOBAL_I18N_IDENTIFIER} = "\${locale}";\`
            }}
          ></script>
        );
        const render = await impl({
          ...({
            ...rawPropsWithoutParams,
            locale,
            params,
          } as unknown as I18nProps<TProps, Config, TConfigurator>),
          I18nScript,
          i18nHtmlAttrs,
        });
        return (
          <I18nLayout
            locale={locale}
            namespaces={namespaces}
          >
            {render}
          </I18nLayout>
        );
      };
    },
  });

createI18nLayout.Root = I18nLayoutRoot;
`,
    },
  };
});

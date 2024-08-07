import { getI18nDictionaries_inline } from "../../adapter-js/generators/getI18nDictionaries_inline";
import { createGenerator } from "../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    config: { single },
    options: {
      routes: { localeParamName },
    },
  } = arg;
  return {
    I18nPage: {
      dir: "server",
      name: "I18nPage",
      ext: "tsx",
      // index: true,
      content: () => /* js */ `
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { defaultLocale } from "../defaultLocale";
import { isLocale } from "../isLocale";
import { locales } from "../locales";
import type { I18n } from "../types";
import { I18nLocaleContext } from "./I18nLocaleContext";
import { I18nMetadataSetter } from "../I18nMetadataSetter";
import { I18nTranslateProvider } from "../I18nTranslateProvider";
import { I18nRouteSetter } from "../I18nRouteSetter";
// import { getI18nDictionaries } from "../getI18nDictionaries";
import { getI18nMetadata } from "../getI18nMetadata";
import { getLocale } from "./getLocale";
${getI18nDictionaries_inline(1)}

export type I18nPageProps<TRouteId extends I18n.RouteId> =
  React.PropsWithChildren<
    {
      ${
        single
          ? ""
          : `/**
       * Optionally set this manually to override the current locale
       */
      locale?: I18n.Locale;
      `
      }namespaces?: I18n.TranslateNamespace[];
      route: I18n.RouteArgs<TRouteId>;
    }
  >;

/**
 * Use this _in each_ \`page.tsx\` render function
 *
 * **For App Router only**
 */
export const I18nPage = async <TRouteId extends I18n.RouteId>(
  props: I18nPageProps<TRouteId>,
) => {
  const {
    locale: localeProp,
    namespaces = [],
    route,
    children,
  } = props;
  const locale = localeProp || getLocale();
  const metadata = getI18nMetadata({ locale, ...route });
  const dictionaries = await getI18nDictionaries({ locale, namespaces });

  return (
    <>
      <I18nRouteSetter id={route.id} />
      <I18nMetadataSetter metadata={metadata} />
      <I18nTranslateProvider
        locale={locale}
        dictionaries={dictionaries}
      >
        {children}
      </I18nTranslateProvider>
    </>
  );
};

// /**
//  * Use this as **first thing** in _in each_ of your \`page.tsx\` file both in the
//  * _component_ function and in the \`generateMetadata\` function.
//  *
//  * **For App Router only**
//  * @deprecated
//  */
// I18nPage.init = pageInit;

/**
 * Use this _in each_ \`page.tsx\` -> \`generateMetadata\` function
 *
 * **For App Router only**
 */
I18nPage.generateMetadata = getMetadata;

/**
 * Optionally Use this _only in_ \`page.tsx\` to get the current _locale_ from
 * the page props.
 *
 * **For App Router only**
 */
I18nPage.locale = (props: any) => props.${localeParamName};

// declare globalThis {
declare global {
  var __i18n_locale: I18n.Locale;
}

/**
 * This function both sets and return the current locale based on the given
 * _props_ by simply reading the dedicated \`[localeParamName]\` dynamic segment
 * of the URL.
 * It automatically 404s with next.js's \`notFound\` if the locale does not exists.
 *
 * **For App Router only**
 * 
 * @internal
 */
function pageInit(params: I18n.Props["params"]): I18n.Locale;
function pageInit(props: I18n.Props): I18n.Locale;
function pageInit(paramsOrProps: I18n.Props["params"] | I18n.Props) {
  const params = (paramsOrProps as any)?.params || paramsOrProps;
  if (params) {
    const locale = (params as any).${localeParamName};

    if (isLocale(locale)) {
      ${
        single
          ? ``
          : `
      // set the server context based locale as early as possible, usually this
      // function is called as first thing in the page components. Setting the
      // locale here might help reducing the cases where a 't' function needed
      // in those "root" page components is obtained by calling 'getT' without
      // passing a 'locale' argument. Passing the 'locale' should not be needed
      // actually, but...
      I18nLocaleContext.set(locale);
      global.__i18n_locale = locale;
      `
      }return locale;
    }
  }

  notFound();
}

/**
 * Use this _in each_ \`page.tsx\` -> \`generateMetadata\` function
 *
 * **For App Router only**
 * 
 * @internal
 */
function getMetadata <TRouteId extends I18n.RouteId>(
  options: { locale?: I18n.Locale; } & I18n.RouteArgs<TRouteId>,
  metadata?: Metadata,
) {
  const { locale: localeProp } = options;
  const locale = localeProp || getLocale();
  const { alternates: alternatesOverride, openGraph: openGraphOverride, ...restMetadata } = metadata || {};
  const { canonical: canonicalOverride, languages: languagesOverride = {} } =
    alternatesOverride || {};
  const { alternates, canonical } = getI18nMetadata({ ...options, locale });

  return {
    ...restMetadata,
    alternates: {
      canonical: canonicalOverride || canonical,
      languages: { ...alternates, ...languagesOverride },
    },
    // TODO: make this optional through a compiler option, also maybe move it to getI18nMetadata
    openGraph: {
      locale,
      alternateLocale: locales.filter((l) => l !== locale),
      ...(openGraphOverride || {})
    }
  };
};

type Configurator<TRouteId extends I18n.RouteId> = {
  /**
   * Specify the page's route data
   */
  route: I18n.RouteArgs<TRouteId>;
  /**
   * Optionally set the translations _namespaces_ to expose to the client
   * components down this page's components tree
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
 * const i18nPage = i18nServer.page<Props>(async (_props, _locale) => {
 *   return {
 *     route: { id: "home" },
 *     namespaces: ["~home"],
 *   };
 * });
 * \`\`\`
 * @returns 
 */
export const createI18nPage = <TProps extends {}, TRouteId extends I18n.RouteId = I18n.RouteId>(
  configurator: (props: I18n.Props & TProps, locale: I18n.Locale) => Configurator<TRouteId> | Promise<Configurator<TRouteId>>
) => {
  return {
    generateMetadata: (impl: (props: I18n.Props & TProps, locale: I18n.Locale) => Promise<Metadata>) => {
      return async (props: I18n.Props & TProps): Promise<Metadata> => {
        const locale = pageInit(props);
        const { route } = await configurator(props, locale);
        const custom = await impl(props, locale)
        return getMetadata({ ...route, locale }, custom)
      };
    },
    default: (impl: (props: I18n.Props & TProps, locale: I18n.Locale) => React.ReactNode | Promise<React.ReactNode>) => {
      return async (props: I18n.Props & TProps) => {
        const locale = pageInit(props);
        const { route, ...options } = await configurator(props, locale);
        const render = await impl(props, locale);
        return (<I18nPage route={route} {...options}>{render}</I18nPage>);
      }
    }
  }
};

export default I18nPage;
`,
    },
  };
});

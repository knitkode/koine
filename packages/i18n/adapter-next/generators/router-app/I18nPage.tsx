import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    config: { single },
  } = arg;
  return {
    I18nPage: {
      dir: createGenerator.dirs.server,
      name: "I18nPage",
      ext: "tsx",
      index: false,
      content: () => /* j s */ `
import React from "react";
import type { Metadata } from "next/types";
import { i18nConsole } from "@koine/i18n";
import { getI18nDictionaries } from "../internal/getI18nDictionaries";
import { getI18nMetadata } from "../internal/getI18nMetadata";
import { I18nMetadataSetter } from "../internal/I18nMetadataSetter";
import { I18nRouteSetter } from "../internal/I18nRouteSetter";
import { I18nTranslateProvider } from "../I18nTranslateProvider";
import { locales } from "../locales";
import type { I18n } from "../types";
import { getLocale } from "./getLocale";
import {
  type NextProps,
  type I18nNextPropsPage,
  type I18nProps,
  type I18nServerConfigurator,
  resolveConfigurator
} from "./i18nServerHelpers";

type Config<TRouteId extends I18n.RouteId> = {
  /**
   * Specify the page's route data
   */
  route: I18n.RouteArgs<TRouteId>;
  /**
   * Optionally set the translations _namespaces_ to expose to the client
   * components down this page's components tree
   */
  namespaces?: I18n.TranslationsNamespace[];${
    single
      ? ""
      : `
  /**
   * Optionally set this manually to override the current locale
   */
  locale?: I18n.Locale;`}
};

export type I18nPageProps<TRouteId extends I18n.RouteId> =
  React.PropsWithChildren<Config<TRouteId>>;

/**
 * Use this _in each_ \`page.tsx\` render function
 *
 * **For App Router only**
 */
export const I18nPage = async <TRouteId extends I18n.RouteId>({
  locale,
  namespaces = [],
  route,
  children,
}: I18nPageProps<TRouteId>) => {
  locale = locale || getLocale();
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

/**
 * @example
 * 
 * \`\`\`ts
 * 
 * // 1) configure and create a page
 * 
 * // with a simple object
 * const page = i18nServer.page({
 *   route: { id: "about" },
 *   namespaces: ["~about"],
 * });
 *
 * // or with a function (async supported)
 * type Props = { params: { slug: string; }; };
 * 
 * const page = i18nServer.page((props: Props) => {
 *   return {
 *     route: { id: "collection.[slug]", params: { slug: props.params.slug } },
 *     namespaces: ["~collection-single"],
 *   };
 * });
 * 
 * // 2) export the metadata
 * 
 * // with a sync function
 * export const generateMetadata = page.generateMetadata((props) => {
 *    return {};
 * });
 * 
 * // or an async function
 * export const generateMetadata = page.generateMetadata(async (props) => {
 *    return {};
 * });
 * 
 * // 3) export the default component
 * 
 * // with a sync function (if you do not need to await)
 * export default page.default((props) => {
 *    return <>{props.route.id} {props.locale}</>;
 * });
 * 
 * // or an async function (if you need to await)
 * export default page.default(async (props) => {
 *   const data = await fetch(...);
 *   return <>{props.route.id} {props.locale}</>;
 * });
 * \`\`\`
 */
export const createI18nPage =
  <TProps extends I18nNextPropsPage>() =>
  <
    TRouteId extends I18n.RouteId,
    TConfigurator extends I18nServerConfigurator<Config<TRouteId>, TProps>,
  >(
    configurator?: TConfigurator,
  ) => ({
    generateMetadata: (
      impl: (
        props: I18nProps<TProps, Config<TRouteId>, TConfigurator>,
      ) => Metadata | Promise<Metadata>,
    ) => {
      return async (rawProps: NextProps<TProps>) => {
        const { params: _rawParams, ...rawPropsWithoutParams } = rawProps;
        const config = await resolveConfigurator<
          TProps,
          Config<TRouteId>,
          TConfigurator
        >(rawProps as unknown as TProps, configurator);
        const { locale, params, route } = config;
        const metadata = await impl({
          ...rawPropsWithoutParams,
          locale,
          params,
          route,
        } as unknown as I18nProps<TProps, Config<TRouteId>, TConfigurator>);

        const {
          alternates: alternatesOverride,
          openGraph: openGraphOverride,
          ...restMetadata
        } = metadata || {};
        const {
          canonical: canonicalOverride,
          languages: languagesOverride = {},
        } = alternatesOverride || {};
        const { alternates, canonical } = getI18nMetadata({ ...route, locale });

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
            ...(openGraphOverride || {}),
          },
        };
      };
    },
    default: (
      impl: (
        props: I18nProps<TProps, Config<TRouteId>, TConfigurator>,
      ) => React.ReactNode | Promise<React.ReactNode>,
    ) => {
      return async (rawProps: NextProps<TProps>) => {
        const { params: _rawParams, ...rawPropsWithoutParams } = rawProps;
        const config = await resolveConfigurator<
          TProps,
          Config<TRouteId>,
          TConfigurator
        >(rawProps as unknown as TProps, configurator);
        const { locale, namespaces, params, route } = config;${createGenerator.log(arg, "page.default", "resolveConfigurator", "locale")}
        const render = await impl({
          ...rawPropsWithoutParams,
          locale,
          params,
          route,
        } as unknown as I18nProps<TProps, Config<TRouteId>, TConfigurator>);

        return (
          <I18nPage
            locale={locale}
            route={route}
            namespaces={namespaces}
          >
            {render}
          </I18nPage>
        );
      };
    },
  });
`,
    },
  };
});

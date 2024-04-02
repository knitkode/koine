import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GetStaticPathsContext, GetStaticPropsContext } from "next";
import type { I18nAppPropsData } from "./I18nApp";
import { getI18nAlternates } from "./getI18nAlternates";
import { getI18nDictionaries } from "./getI18nDictionaries";
import { isLocale } from "./isLocale";
import { locales } from "./locales";
import { type RouteIdError, isErrorRoute } from "./routesError";
import type { I18n } from "./types";

/**
 * Get current _locale_ from \`getStaticProps\` context data (its first argument)
 */
function locale(params: GetStaticPropsContext["params"]): I18n.Locale | undefined;
function locale(ctx: GetStaticPropsContext): I18n.Locale | undefined;
function locale(
  ctxOrParams: GetStaticPropsContext["params"] | GetStaticPropsContext,
) {
  const params = ctxOrParams?.params || ctxOrParams;
  if (params) {
    const locale = (params as any).${localeParamName};

    if (isLocale(locale)) {
      return locale;
    }
  }

  return; // defaultLocale;
}

/**
 * Get localised paths to feed into \`getStaticPaths\`
 */
const paths = <P extends { [key: string]: any }>(params?: P) =>
  locales.map((l) => ({
    params: { ${localeParamName}: l, ...(params || {}) },
    // locale: l,
  })) as Array<string | { params: P & { ${localeParamName}: I18n.Locale }; locale?: string }>;

/**
 * Function to use as \`getStaticPaths\` with \`fallback: false\`
 */
const staticPaths = (_context?: GetStaticPathsContext) => ({
  paths: paths(),
  fallback: false,
});

type I18nPropsOptions<
  TRouteId extends I18n.RouteId | RouteIdError,
  TParams,
  TData,
> = {
  namespaces: I18n.TranslateNamespace[];
  // routeId: TRouteId;
  // routeParams?: TRouteId extends I18n.RouteIdDynamic
  //   ? I18n.RouteParams[TRouteId]
  //   : never;
  params?: TParams;
  data?: TData;
} & (
  // as in I18n.RouteArgs
  | {
      routeId: TRouteId extends I18n.RouteIdDynamic ? TRouteId : never;
      routeParams: TRouteId extends I18n.RouteIdDynamic
        ? I18n.RouteParams[TRouteId]
        : never;
    }
  | {
      routeId: TRouteId extends I18n.RouteIdStatic | RouteIdError
        ? TRouteId
        : never;
      routeParams?: undefined;
    }
);

/**
 * Get page props data feed into \`getStaticProps\`'s return
 */
const props = async <
  TRouteId extends I18n.RouteId | RouteIdError,
  TParams,
  TData,
>({
  locale,
  namespaces,
  routeId,
  routeParams,
  params,
  data,
}: {
  locale: I18n.Locale;
} & I18nPropsOptions<TRouteId, TParams, TData>) => {
  const props: I18nAppPropsData = {
    i18n: {
      locale: locale,
      alternates: isErrorRoute(routeId)
        ? {}
        : // @ts-expect-error FIXME: route conditional type
          getI18nAlternates({ locale, id: routeId, params: routeParams }),
      dictionaries: await getI18nDictionaries({ locale, namespaces }),
    },
  };

  return {
    ...props,
    params: { ${localeParamName}: locale, ...(params || ({} as TParams)) },
    data: data || ({} as TData),
  };
};

/**
 * Get page props data to use as immediate return of \`getStaticProps\`
 */
const staticProps = async <
  TRouteId extends I18n.RouteId | RouteIdError,
  TParams,
  TData,
>({
  ctx,
  revalidate,
  ...options
}: {
  ctx: GetStaticPropsContext;
  revalidate?: number;
} & I18nPropsOptions<TRouteId, TParams, TData>) => {
  const locale = ctx.params?.${localeParamName} as I18n.Locale;

  return {
    // @ts-expect-error FIXME: route conditional type
    props: await props({ locale, ...options }),
    revalidate,
  };
};

/**
 * **For Pages Router only**
 */
export const i18nGet = {
  locale,
  paths,
  staticPaths,
  props,
  staticProps,
};

export default i18nGet;
`;

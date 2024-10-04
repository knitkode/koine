import { createGenerator } from "../../../compiler/createAdapter";

export default createGenerator("next", (arg) => {
  const {
    // routes: { dynamicRoutes },
    options: {
      routes: { localeParamName },
    },
  } = arg;
  return {
    i18nGet: {
      name: "i18nGet",
      ext: "ts",
      index: true,
      content: () => /* j s */ `
import type { GetStaticPathsContext, GetStaticPropsContext } from "next";
import { i18nDefaultMetadata} from "@koine/i18n";
import type { I18nAppPropsData } from "./I18nApp";
import { defaultLocale } from "./defaultLocale";
import { getI18nDictionaries } from "./internal/getI18nDictionaries";
import { getI18nMetadata } from "./internal/getI18nMetadata";
import { type RouteIdError, isErrorRoute } from "./internal/routesError";
import { isLocale } from "./isLocale";
import { locales } from "./locales";
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

/**
 * {@link I18n.RouteArgs}
 */
type I18nPropsOptions<
  TRouteId extends I18n.RouteId | RouteIdError,
  TParams,
  TData,
> = {
  namespaces: I18n.TranslationsNamespace[];
  params?: TParams;
  data?: TData;
  route: I18n.RouteArgs<TRouteId>;
};

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
  route,
  params,
  data,
}: {
  locale: I18n.Locale;
} & I18nPropsOptions<TRouteId, TParams, TData>) => {
  const props: I18nAppPropsData = {
    i18n: {
      locale: locale,
      metadata: isErrorRoute(route.id)
        ? i18nDefaultMetadata
        : getI18nMetadata({ locale, ...route }),
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
`,
    },
  };
});

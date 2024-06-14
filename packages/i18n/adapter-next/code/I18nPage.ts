import { getI18nDictionaries_inline } from "../../adapter-js/code/getI18nDictionaries_inline";
import type { I18nCompiler } from "../../compiler/types";

export default ({
  config: { single },
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import type { Metadata } from "next/types";
import { I18nMetadataSetter } from "./I18nMetadataSetter";
import { I18nTranslateProvider } from "./I18nTranslateProvider";
import { I18nRouteSetter } from "./I18nRouteSetter";
import { defaultLocale } from "./defaultLocale";
// import { getI18nDictionaries } from "./getI18nDictionaries";
import { getI18nMetadata } from "./getI18nMetadata";
import { getLocale } from "./getLocale";
import { isLocale } from "./isLocale";
import type { I18n } from "./types";

${getI18nDictionaries_inline()}

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
    } & I18n.RouteArgs<TRouteId>
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
    id,
    params,
    children,
  } = props;
  const locale = localeProp || getLocale();
  const metadata = getI18nMetadata(locale, id, params);
  const dictionaries = await getI18nDictionaries({ locale, namespaces });

  return (
    <>
      <I18nRouteSetter id={id} />
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

function locale(props: any): I18n.Locale;
function locale(params: I18n.Props["params"]): I18n.Locale;
function locale(props: I18n.Props): I18n.Locale;
function locale(paramsOrProps: I18n.Props["params"] | I18n.Props) {
  const params = (paramsOrProps as any)?.params || paramsOrProps;
  if (params) {
    const locale = (params as any).${localeParamName};

    if (isLocale(locale)) {
      return locale;
    }
  }

  notFound();
}

/**
 * Use this _in each_ \`page.tsx\` to get the current _locale_ from the page props
 *
 * It automatically 404s with next.js's \`notFound\` if the locale does not exists.
 *
 * **For App Router only**
 */
I18nPage.locale = locale;

/**
 * Use this _in each_ \`page.tsx\` -> \`generateMetadata\` function
 *
 * **For App Router only**
 */
I18nPage.metadata = <TRouteId extends I18n.RouteId>(
  options: Omit<I18nPageProps<TRouteId>, "namespaces">,
  metadata?: Metadata,
) => {
  const { alternates: alternatesOverride, ...restMetadata } = metadata || {};
  const { canonical: canonicalOverride, languages: languagesOverride = {} } =
    alternatesOverride || {};
  const { alternates, canonical } = getI18nMetadata(
    options.locale || defaultLocale,
    options.id,
    options.params,
  );

  return {
    ...restMetadata,
    alternates: {
      canonical: canonicalOverride || canonical,
      languages: { ...alternates, ...languagesOverride },
    },
  };
};

export default I18nPage;
`;

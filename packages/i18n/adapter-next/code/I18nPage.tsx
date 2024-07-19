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
import { I18nLocaleContext } from "./I18nLocaleContext";
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

function init(params: I18n.Props["params"]): I18n.Locale;
function init(props: I18n.Props): I18n.Locale;
function init(paramsOrProps: I18n.Props["params"] | I18n.Props) {
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
      // actually, but 
      I18nLocaleContext.set(locale);
      global.locale = locale;
      `
      }return locale;
    }
  }

  notFound();
}

/**
 * Use this as **first thing** in _in each_ of your \`page.tsx\` file both in the
 * _component_ function and in the \`generateMetadata\` function.
 *
 * This function both sets and return the current locale based on the given
 * _props_ by simply reading the dedicated \`[localeParamName]\` dynamic segment
 * of the URL.
 * It automatically 404s with next.js's \`notFound\` if the locale does not exists.
 *
 * **For App Router only**
 */
I18nPage.init = init;

/**
 * Use this _in each_ \`page.tsx\` -> \`generateMetadata\` function
 *
 * **For App Router only**
 */
I18nPage.metadata = <TRouteId extends I18n.RouteId>(
  options: { locale?: I18n.Locale; } & I18n.RouteArgs<TRouteId>,
  metadata?: Metadata,
) => {
  const { locale: localeProp } = options;
  const locale = localeProp || getLocale();
  const { alternates: alternatesOverride, ...restMetadata } = metadata || {};
  const { canonical: canonicalOverride, languages: languagesOverride = {} } =
    alternatesOverride || {};
  const { alternates, canonical } = getI18nMetadata({ ...options, locale });

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

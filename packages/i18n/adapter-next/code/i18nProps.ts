import type { I18nCompiler } from "../../compiler/types";

export default ({
  options: {
    routes: { localeParamName },
  },
}: I18nCompiler.AdapterArg<"next">) => `
import { getAlternates } from "./getAlternates";
import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18nAppPropsData } from "./I18nApp";
import type { I18n } from "./types";

type I18nPropsOptions<TRouteId extends I18n.RouteId, TParams, TData> = {
  locale: I18n.Locale;
  namespaces: I18n.TranslateNamespace[];
  routeId: TRouteId; // | "404" | "500";
  routeParams?: TRouteId extends I18n.RouteIdDynamic
    ? I18n.RouteParams[TRouteId]
    : never;
  params?: TParams;
  data?: TData;
};

/**
 * **For Pages Router only**
 */
export async function i18nProps<TRouteId extends I18n.RouteId, TParams, TData>({
  locale,
  namespaces,
  routeId,
  routeParams,
  params,
  data,
}: I18nPropsOptions<TRouteId, TParams, TData>) {
  const props: I18nAppPropsData = {
    i18n: {
      locale: locale,
      // @ts-expect-error FIXME: route conditional type
      alternates: getAlternates({ locale, id: routeId, params: routeParams }),
      dictionaries: await getI18nDictionaries({ locale, namespaces }),
    }
  }

  return {
    ...props,
    params: ${localeParamName ? `{ ${localeParamName}: locale, ...(params || ({} as TParams)) }` : `params || ({} as TParams)`},
    data: data || ({} as TData),
  };
}

export default i18nProps;
`;

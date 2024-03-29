import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
import { I18nAlternatesSetter } from "./I18nAlternatesSetter";
import { I18nProvider } from "./I18nProvider";
import { I18nRouteProvider } from "./I18nRouteProvider";
import { defaultLocale } from "./defaultLocale";
import { getAlternates } from "./getAlternates";
import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18n } from "./types";

export type I18nPageProps<TRouteId extends I18n.RouteId> =
  React.PropsWithChildren<
    {
      locale?: I18n.Locale;
      namespaces?: I18n.TranslateNamespace[];
    } & I18n.RouteArgs<TRouteId>
  >;

/**
 * For App Router only
 */
export const I18nPage = async <TRouteId extends I18n.RouteId>(
  props: I18nPageProps<TRouteId>,
) => {
  const {
    locale = defaultLocale,
    namespaces = [],
    id,
    params,
    children,
  } = props;
  const dictionaries = await getI18nDictionaries({ locale, namespaces });
  const alternates = await getAlternates({ locale, id, params });

  return (
    <I18nProvider
      locale={locale}
      dictionaries={dictionaries}
    >
      <I18nAlternatesSetter alternates={alternates} />
      <I18nRouteProvider id={id}>{children}</I18nRouteProvider>
    </I18nProvider>
  );
};

export default I18nPage;
`;

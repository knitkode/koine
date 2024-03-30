import type { I18nCompiler } from "../../compiler/types";

export default ({ config: { single } }: I18nCompiler.AdapterArg<"next">) => `
import { I18nAlternatesSetter } from "./I18nAlternatesSetter";
import { I18nProvider } from "./I18nProvider";
import { I18nRouteSetter } from "./I18nRouteSetter";
import { defaultLocale } from "./defaultLocale";
import { getAlternates } from "./getAlternates";
import { getI18nDictionaries } from "./getI18nDictionaries";
import type { I18n } from "./types";

export type I18nPageProps<TRouteId extends I18n.RouteId> =
  React.PropsWithChildren<
    {
      locale${single ? "?" : ""}: I18n.Locale;
      namespaces?: I18n.TranslateNamespace[];
    } & I18n.RouteArgs<TRouteId>
  >;

/**
 * Use this _in each_ \`page.tsx\`
 * 
 * **For App Router only**
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
  // @ts-expect-error FIXME: route conditional type
  const alternates = await getAlternates({ locale, id, params });
  const dictionaries = await getI18nDictionaries({ locale, namespaces });

  return (
    <>
      <I18nRouteSetter id={id} />
      <I18nAlternatesSetter alternates={alternates} />
      <I18nProvider
        locale={locale}
        dictionaries={dictionaries}
      >
        {children}
      </I18nProvider>
    </>
  );
};

export default I18nPage;
`;

import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"react">) => `
"use client";

import { useMemo, useState } from "react";
import type { I18n } from "@/i18n";
import { I18nAlternatesContext } from "./I18nAlternatesContext";

export type I18nAlternatesProviderProps = React.PropsWithChildren<{
  alternates?: I18n.Alternates;
}>;

/**
 * @internal
 */
export function I18nAlternatesProvider(props: I18nAlternatesProviderProps) {
  const { children } = props;
  // const id = useRouteId();
  // const locale = useLocale();
  const [alternates, setAlternates] = useState<I18n.Alternates>(
    props.alternates || ({} as I18n.Alternates),
  );
  const value = useMemo(
    () => [alternates, setAlternates] as const,
    [alternates],
  );
  // const { xDefault, others = [] } = alternates;

  // useEffect(() => {
  //   if (id) {
  //     setAlternates(i18nGetAlternates({ locale, id ))
  //   }
  // }, [id, locale])

  return (
    <I18nAlternatesContext.Provider value={value}>
      {children}
    </I18nAlternatesContext.Provider>
  );
}

// export default I18nAlternatesProvider;
`;

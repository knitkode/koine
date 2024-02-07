// import type { I18nCodegen } from "../../types";

export default (/* {}: I18nCodegen.AdapterArg, */) => `
"use client";

import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import type { I18n } from "./types";

/**
 * Wrap next-translate useTranslations for type safety and adds TranslationShortcut
 * as second/thir argument.
 *
 * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
 *
 * About the typescript support for translation strings see:
 * - https://github.com/vinissimus/next-translate/issues/721
 */
export const useT = <TNamespace extends I18n.TranslateNamespace>(namespace: TNamespace) => {
  const t = useTranslation().t;
  const tMemoized = useMemo(
    () =>
      function <
        TPath extends I18n.TranslationsPaths<I18n.TranslationsDictionary[TNamespace]>,
        TReturn = I18n.TranslationAtPathFromNamespace<TNamespace, TPath>,
      >(s: TPath, q?: I18n.TranslationQuery, o?: I18n.TranslationOptions): TReturn {
        return t(
          (namespace ? namespace + ":" + s : s) as string,
          q === "obj" || q === "" ? null : q,
          q === "obj" || o === "obj"
            ? { returnObjects: true }
            : q === "" || o === ""
              ? { fallback: "" }
              : o,
        ) as TReturn;
        // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<I18n.TranslationQuery, I18n.TranslationOptions> : TReturn;
        // );
      },
    [t, namespace],
  );
  return tMemoized;
};

export default useT;
`;

import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import type {
  TranslationsDictionary,
  TranslationsPaths,
  TranslateNamespace,
  TranslationQuery,
  TranslationOptions,
  TranslateDefault,
  TranslateNamespaced,
} from "../types";

/**
 * Wrap `next-translate` useTranslations for type safety and adds TranslationShortcut
 * as second/thir argument.
 *
 * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
 *
 * About the typescript support for translation strings see:
 * - https://github.com/vinissimus/next-translate/issues/721
 *
 * **NOTE**: To make typescript work nicely here make sure to enable
 * [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule)
 * in your `tsconfig.json` file.
 */
export function useT(): TranslateDefault;
export function useT<TNamespace extends TranslateNamespace>(
  namespace: TNamespace
): TranslateNamespaced<TNamespace>;
export function useT<TNamespace extends TranslateNamespace>(
  namespace?: TNamespace
) {
  const t = useTranslation().t;
  const tMemoized = useMemo(
    () =>
      function <TReturn = string>(
        s: TranslationsPaths<TranslationsDictionary[TNamespace], true>,
        q?: TranslationQuery,
        o?: TranslationOptions
      ): TReturn {
        return t(
          namespace ? `${namespace}:${s}` : s,
          q === "obj" || q === "" ? null : q,
          q === "obj" || o === "obj"
            ? { returnObjects: true }
            : q === "" || o === ""
            ? { fallback: "" }
            : o
          // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : TReturn;
        );
      },
    [t, namespace]
  );
  return tMemoized;
}

// Instead of wrapping the `useTranslation` hook from [`next-translate`](https://github.com/vinissimus/next-translate/blob/master/src/useTranslation.tsx)
// we might just rewrite it with our custom implementation but the `_context`
// to use is not exposed by the library...
// import { useContext, useMemo } from "react"
// import wrapTWithDefaultNs from "next-translate/lib/cjs/wrapTWithDefaultNs";
// import I18nContext from "next-translate/lib/cjs/_context";
// export default function useTranslation(defaultNS?: string): I18n {
//   const ctx = useContext(I18nContext)
//   return useMemo(
//     () => ({
//       ...ctx,
//       t: wrapTWithDefaultNs(ctx.t, defaultNS),
//     }),
//     [ctx.lang, defaultNS]
//   )
// }

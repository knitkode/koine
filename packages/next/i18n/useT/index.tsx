/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */

/**
 * @file
 *
 * About the typescript support for translation strings @see:
 * - https://github.com/vinissimus/next-translate/issues/721
 */
import { useMemo } from "react";
import useTranslation from "next-translate/useTranslation";

export type TranslateNamespace = Extract<keyof Koine.NextTranslations, string>;

type Join<S1, S2> = S1 extends string
  ? S2 extends string
    ? `${S1}.${S2}`
    : S1
  : never;

export type TranslationsPaths<
  T,
  TAddRoot extends true | undefined = undefined
> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? // if we have an object
      K extends string
      ? TAddRoot extends true
        ? `${K}` | Join<K, TranslationsPaths<T[K], TAddRoot>>
        : Join<K, TranslationsPaths<T[K], TAddRoot>>
      : K
    : K;
}[keyof T];

export type TranslationsAllPaths = {
  [N in Extract<keyof Koine.NextTranslations, string>]: {
    [K in Extract<
      keyof Koine.NextTranslations[N],
      string
    >]: Koine.NextTranslations[N][K] extends Array<
      // if we have an array of objects
      Record<string, unknown>
    >
      ? `${N}:${K}`
      : // if we have an object
      Koine.NextTranslations[N][K] extends Record<string, unknown>
      ?
          | `${N}:${K}` /* Add for "obj" */
          | Join<
              K extends string ? `${N}:${K}` : `${N}:`,
              TranslationsPaths<Koine.NextTranslations[N][K], true>
            >
      : // if we have an array of primitives
      Koine.NextTranslations[N][K] extends Array<string | number | boolean>
      ? `${N}:${K}`
      : // if we have a primitve string/number/boolean
      Koine.NextTranslations[N][K] extends string | number | boolean
      ? K extends string
        ? `${N}:${K}`
        : `${N}:`
      : ``;
  }[Extract<keyof Koine.NextTranslations[N], string>];
}[Extract<keyof Koine.NextTranslations, string>];

/**
 * Passing just `obj` is a shortcut for `{ returnObjects: true }`
 */
export type TranslationQuery =
  | undefined
  | null
  | "obj"
  | {
      [key: string]: string | number | boolean;
    };

/**
 * Passing just `obj` is a shortcut for `{ returnObjects: true }`
 */
export type TranslationOptions =
  | undefined
  | "obj"
  | {
      returnObjects?: boolean;
      fallback?: string | string[];
      default?: string;
    };

export type TranslateLoose = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s: any, // s: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  q?: any, // q?: TranslationQuery,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o?: any // o?: TranslationOptions
) => string;

export type Translate<
  TNamespace extends keyof Koine.NextTranslations | undefined
> = TNamespace extends keyof Koine.NextTranslations
  ? TranslateNamespaced<TNamespace>
  : TranslateDefault;

export type TranslateDefault = <TReturn extends unknown = string>(
  s: TranslationsAllPaths,
  q?: TranslationQuery,
  o?: TranslationOptions
) => TReturn;

export type TranslateNamespaced<
  TNamespace extends keyof Koine.NextTranslations
> = <TReturn extends unknown = string>(
  s: TranslationsPaths<Koine.NextTranslations[TNamespace]>,
  q?: TranslationQuery,
  o?: TranslationOptions
) => TReturn;

/**
 * Wrap `next-translate` useTranslations adding the `obj` second argument shortcut
 * and type safety
 *
 * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
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
      <TReturn extends unknown = string>(
        s: TranslationsPaths<Koine.NextTranslations[TNamespace], true>,
        q?: TranslationQuery,
        o?: TranslationOptions
      ): TReturn =>
        t(
          // @ts-expect-error again...
          (namespace ? `${namespace}:${s}` : s) as
            | TemplateStringsArray
            | string,
          q === "obj" ? null : q,
          q === "obj" || o === "obj" ? { returnObjects: true } : o
          // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : TReturn;
        ),
    [t, namespace]
  );
  return tMemoized;
}

/**
 * Using this as generic instead of the interface on the namespace `Koine.NextTranslations`
 * generates the typescript warning `Type instantiation is excessively deep and possibly infinite.`
 * Its usage is left here and commented out. Maybe we can restore it once we find
 * the time to look for a way to avoid the warning
 */
// type Translations = { [key: string]: Record<string, unknown> };

// export type TranslationsAllPaths<TTranslations extends Translations> = {
//   [N in Extract<keyof TTranslations, string>]: {
//     [K in Extract<
//       keyof TTranslations[N],
//       string
//     >]: TTranslations[N][K] extends Array<
//       // if we have an array of objects
//       Record<string, unknown>
//     >
//       ? Join<
//           K extends string ? `${N}:${K}` : `${N}:`,
//           Paths<TTranslations[N][K], true>
//         >
//       : // if we have an object
//       TTranslations[N][K] extends Record<string, unknown>
//       ? Join<
//           K extends string ? `${N}:${K}` : `${N}:`,
//           Paths<TTranslations[N][K], true>
//         > /* &
//           Record<TTranslations[N][K], object> */
//       : // if we have an array of primitives
//       TTranslations[N][K] extends Array<string | number | boolean>
//       ? Join<
//           K extends string ? `${N}:${K}` : `${N}`,
//           Paths<TTranslations[N][K], true>
//         >
//       : // if we have a primitve string/number/boolean
//       TTranslations[N][K] extends string | number | boolean
//       ? K extends string
//         ? `${N}:${K}`
//         : `${N}:`
//       : ``;
//   }[Extract<keyof TTranslations[N], string>];
// }[Extract<keyof TTranslations, string>];

// export type Translate<
//   TTranslations extends Translations = Koine.NextTranslations,
//   TNamespace extends undefined | keyof TTranslations = undefined
// > = <TReturn extends unknown = string>(
//   s: TNamespace extends keyof TTranslations
//     ? Paths<TTranslations[TNamespace]>
//     : TranslationsAllPaths<TTranslations>,
//   q?: TranslationQuery,
//   o?: TranslationOptions
// ) => TReturn;

// export function useT<
//   TTranslations extends Translations = Koine.NextTranslations,
//   TNamespace extends keyof TTranslations | undefined = undefined
// >(namespace?: TNamespace) {
//   const t = useTranslation().t;
//   const tMemoized = useMemo(
//     () =>
//       <TReturn extends unknown = string>(
//         s: TNamespace extends keyof TTranslations
//           ? Paths<TTranslations[TNamespace], true>
//           : TranslationsAllPaths<TTranslations>,
//         q?: TranslationQuery,
//         o?: TranslationOptions
//       ) =>
//         t(
//           namespace ? `${namespace}:${s}` : s,
//           q === "obj" ? null : q,
//           q === "obj" || o === "obj" ? { returnObjects: true } : o
//           // ) as TReturn extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : TReturn;
//         ) as TReturn,
//     [t, namespace]
//   );
//   return tMemoized;
// }

/**
 * Instead of wrapping the `useTranslation` hook from [`next-translate`](https://github.com/vinissimus/next-translate/blob/master/src/useTranslation.tsx)
 * we might just rewrite it with our custom implementation but the `_context`
 * to use is not exposed by the library...
 */
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

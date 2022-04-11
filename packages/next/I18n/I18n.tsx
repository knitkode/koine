/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
/**
 * @file
 *
 * About the typescript support for translation strings @see:
 * - https://github.com/vinissimus/next-translate/issues/721
 *
 * About the issue with page transitions @see:
 * - https://github.com/vinissimus/next-translate/issues/447
 * - https://github.com/vinissimus/next-translate/pull/743
 */
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import format from "date-fns/format";
import useTranslation from "next-translate/useTranslation";
import type { Option } from "@koine/react";
import { useDateLocale } from "@koine/react";

export { default as T } from "next-translate/Trans";
// export const T = (props: TransProps) => <Trans {...props} />;

// type Translations = Koine.NextTranslations;

type Join<S1, S2> = S1 extends string
  ? S2 extends string
    ? `${S1}.${S2}`
    : never
  : never;

type Paths<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Join<K, Paths<T[K]>>
    : K;
}[keyof T];

// type AllPaths = {
//   [N in keyof Koine.NextTranslations]: Koine.NextTranslations[N] extends Record<string, unknown> ? object : never;
// }[keyof Koine.NextTranslations];

export type AllPaths = {
  [N in keyof Koine.NextTranslations]: {
    [K in keyof Koine.NextTranslations[N]]: Koine.NextTranslations[N][K] extends Array<
      // if we have an array of objects
      Record<string, unknown>
    >
      ? Join<
          K extends string ? `${N}:${K}` : `${N}:`,
          Paths<Koine.NextTranslations[N][K]>
        >
      : // if we have an object
      Koine.NextTranslations[N][K] extends Record<string, unknown>
      ? Join<
          K extends string ? `${N}:${K}` : `${N}:`,
          Paths<Koine.NextTranslations[N][K]>
        >
      : // if we have an array of primitives
      Koine.NextTranslations[N][K] extends Array<string | number | boolean>
      ? Join<
          K extends string ? `${N}:${K}` : `${N}`,
          Paths<Koine.NextTranslations[N][K]>
        >
      : // if we have a primitve string/number/boolean
      Koine.NextTranslations[N][K] extends string | number | boolean
      ? K extends string
        ? `${N}:${K}`
        : `${N}:`
      : ``;
  }[keyof Koine.NextTranslations[N]];
}[keyof Koine.NextTranslations];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type TranslateReturn<
  Q extends TranslationQuery,
  O extends TranslationOptions
> = string;
// Q extends undefined
//   ? string
//   :
//   O extends undefined
//     ? string
//     :
//         | string
//         | readonly string[]
//         | TemplateStringsArray
//         | Record<string, unknown>
//         | readonly Record<string, unknown>[];

/**
 * Passing just `obj` is a shortcut for `{ returnObjects: true }`
 */
type TranslationQuery =
  | undefined
  | null
  | "obj"
  | {
      [key: string]: string | number | boolean;
    };

/**
 * Passing just `obj` is a shortcut for `{ returnObjects: true }`
 */
type TranslationOptions =
  | undefined
  | "obj"
  | {
      returnObjects?: boolean;
      fallback?: string | string[];
      default?: string;
    };

export type TranslateNamespace = keyof Koine.NextTranslations;

export type TranslateKey = AllPaths;

export type Translate<
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  R extends unknown = string,
  N extends undefined | keyof Koine.NextTranslations = undefined,
  Q extends TranslationQuery = undefined,
  O extends TranslationOptions = undefined
> = (
  s: N extends keyof Koine.NextTranslations
    ? Paths<Koine.NextTranslations[N]> | AllPaths
    : AllPaths,
  q?: Q,
  o?: O
) => R extends undefined | unknown ? TranslateReturn<Q, O> : R;

export type TranslateLoose = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  s: any,
  // s: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  q?: any,
  // q?: TranslationQuery,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o?: any
  // o?: TranslationOptions
) => string;

/**
 * FIXME: the use of `useMemo` is a hopefully-temporary solution to fix the FOUC
 * problem of untranslated text during page transitions
 *
 * @see https://github.com/vinissimus/next-translate/issues/513#issuecomment-779826418
 */
export function useT<N extends TranslateNamespace | undefined>(namespace?: N) {
  const t = useTranslation().t;
  // const typedT = <
  //   // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
  //   R extends unknown = string,
  //   // Q extends TranslationQuery = TranslationQuery
  //   // O extends TranslationOptions = TranslationOptions
  // >(
  //   s: N extends TranslateNamespace
  //     ? Paths<Koine.NextTranslations[N]> | AllPaths
  //     : AllPaths,
  //   q?: TranslationQuery,
  //   o?: TranslationOptions
  // ) =>
  //   // eslint-disable-next-line
  //   t.call(
  //     null,
  //     namespace ? `${namespace}:${s}` : s,
  //     q === "obj" ? null : q,
  //     q === "obj" || o === "obj" ? { returnObjects: true } : o
  //   // ) as R extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : R;
  //   ) as R;
  // return typedT;

  const tMemoized = useMemo(
    () =>
      <R extends unknown = string>(
        s: N extends TranslateNamespace
          ? Paths<Koine.NextTranslations[N]> | AllPaths
          : AllPaths,
        q?: TranslationQuery,
        o?: TranslationOptions
      ) =>
        t(
          namespace ? `${namespace}:${s}` : s,
          q === "obj" ? null : q,
          q === "obj" || o === "obj" ? { returnObjects: true } : o
          // ) as R extends (undefined | never | unknown) ? TranslateReturn<TranslationQuery, TranslationOptions> : R;
        ) as R,
    [t, namespace]
  );
  // return tMemoized as Translate<N>;
  return tMemoized;
}

/**
 * @deprecated Not sure whether this will ever be useful
 */
export function useLooseT(namespace?: string) {
  const { t } = useTranslation(namespace);
  // return t;
  const tMemoized = useMemo(() => t, [t]);

  return tMemoized;
}

export function translationAsOptions(
  t: TranslateLoose,
  i18nKey: string
): Option[] {
  const dictionary = t(i18nKey, undefined, {
    returnObjects: true,
  }) as unknown as Record<string, string>;

  return Object.keys(dictionary).map((key) => ({
    value: key,
    label: dictionary[key],
  }));
}

type FormatType = typeof format;

/**
 * Automatically returns the `date-fns/format` function with the right locale
 * passed as option (grabbed from next router value).
 */
export const useDateFormat = () => {
  const [formatter, setFormatter] = useState<FormatType>(
    () =>
      (...args: Parameters<FormatType>) =>
        format(...args)
  );
  const router = useRouter();
  const locale = useDateLocale(router.locale);

  useEffect(() => {
    if (locale) {
      const newFormatter = (
        date: Parameters<FormatType>[0],
        _format: Parameters<FormatType>[1],
        options: Parameters<FormatType>[2]
      ) => format(date, _format, { ...(options || {}), locale });
      setFormatter(
        () =>
          (...args: Parameters<FormatType>) =>
            newFormatter(...args)
      );
    }
  }, [locale]);

  return formatter;
};

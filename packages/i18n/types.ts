// import type {
//   // Get,
//   Split,
// } from "@koine/utils";

type Split<
  S extends string,
  Delimiter extends string,
> = S extends `${infer Head}${Delimiter}${infer Tail}`
  ? [Head, ...Split<Tail, Delimiter>]
  : S extends Delimiter
    ? []
    : [S];

/**
 * @file
 *
 * Test this on TSplayground:
 * https://www.typescriptlang.org/play?#code/PTAEFpK6dv4YpSBQJSgJYEYAcA7YAFwE8AHTfAcwGcA6AEzqJrTGQ86+7hRQYCmAYwA2AQwBOA0PjEBbATTJih0gJJ58oAN4oMlIgIkAzFdIAqEsfhriimAPY2dejKHQAiAH4eAXKGsSAG5XAF8+fXxDEzNQS2tbMXsnGgBhJ2NMKh1w8LYIHkKi4sh8rE1ickVmVnQS+obUFFIyaQApB0oAHgBlbAAaUB6AJgA+UABeIexQAQAPQ3wGGlAaIglKKlcAfiHh2YWBJZW1jepXDF2AAwASbT7QujuR0KuL0H8+1398AQA3IwhNAAKmBemBoAAIpghMlZBISKAHMYAiIRKAiAALaTrBJ2Rw2cHAFDzMgOCREDFVOJWGz4lLQ2EEySIqYaAh0eJ0pIEmhA4Cg8GgABy8kUylUJ0xDgAriIGKA5EkhJiMdjQJkREcxSsAO5GHG0xJwlaSaSCTK-BhEklzMkUqmtGl4pICUUKJSxKYAUQWVlhXQA1gISMjndyTYy4SzBqdNqN+YLQBCAErCGUSGiYAGKsRkVoKlo4hwHXGw1HomU0MQAIy1q3Wm1AyixK2MEgccgCGKN9PwQotlEwcKRNYAVsJKQAKKsysRoxHtzvdto9ADywo1mC1AEo6EK1JSq4o1dIrpRjEYrqAPI2hIGPBiS2tyTj1Q5x5OsFoFHJyYjrAVMgpABKIhQAbQvIdDG-NZrHsHknFmCQO0zABdKdMSIIgyBoXwQDg+8HABEwRAcXU6CETtgAAR2AAB2ABWRiAGZsBYgA2DjgGwABOFjcF4+iAAYdxtUlyUpItw2NXkAAUkkxGgulccwUHGKZdAwcCAGlv1AX0yyIIMQzDcxY0bahRjQ3x3nQeZRBlQRZjkMhSFHCdYRoQYBFc9zJCsEhvJctzETjahWDcOJdLQ0sjmWUA0yoiQGC6cKqEGX4SPGAAfGR-iMcDYryjxH12LKjDssApCEDMswBERESVWQqGkD9PJYd5-HMGK4uORLhHJVL0sGGV8EDfByPwcZdneDA8tubQdNedwwCxTAVg2p9QBraRa3rIgS2PU8b3ax8aGlClaqIObQDyjpuh0wYuVklIFNbLoep0tDRlGKqK3I5sNjkYdsxPckAhQsRETDYDMBB+wAUitxut6+ZFgS9K7pkGU5F2iRsZrBwHC1axsYAQShkg0ss7I8vwXH8cJ4nSem0BrjuZa3ii+y5kc5zAnW6hZhEGgBC6-KSJCUJwMM-1jODUMUXMhszioay+oSi8jFANd2d1j5JcBPgBTBZMBtqzMwdzfMBELakw3nStqzraQsZbJSNQ7LssWkXVpQO3tEMJc2GBhaMEToUBD1AY8Vl90Bz3wS8JGvW8NnvR9DobV8Tvar9KEVXz-wCJYgYKsDzcg5PoOkSg4KiTBg+Q1CaAwrCcLwgiiBUQNiKMYwyIoqi5FohjmLYzjuL4gShNE8S7Ukx0LCDk1ybRd7Pc01xwM3Qu5ZUBXTOV1feSjZkEQstXrP8LS3F0-SD4DRWzNPhlw4vkhd7Q-p0pv27eb82kL5UKHlJzBRAf5KmEC-JhVpsjKKL0+w0HPk4Fk380aHH6klIaNM1aZQKhIXKRsJBFWxqVfWFUJAAOqumK2DUmrWDEK1MBXlbrdTfjYVB8Iv7CjQpgjGKwcEpTwZsUa41Jq6jZtsW6UUFp3GFKEXwnMVroHWpteOJZdoBFdttY6CcPBnVWJdIg11ZFuHup0fAXQ9Lo3iicWm+tFqKOUUtFa-hnFKKuM9ThNBN7KSQcHFBH80EIgwd9X6NCAa6iBvDUGSMkQEwCtDJEKI4YIzBgglGMlkHcPQXwgR9jVZNnpozHWeUiYkwEGTPKlNAqiOFqUvG5Sdos2qdIxOCilEqO5lFVaBwgGlxIELbIAhRbiz6YbKhYRZZ+kPiZJWOSgl5LCXwq+8Y0LS1mUZBZr8XSRhCTw9ZVlYp2P6trAmetdh6x+IQxMZsIQAFV8AiEwMGfSVxfgLHALiCMAhrz6gCAwICYgaBZmFjQTs0hgJ2wEJaO2kMqC4yOCwAIkUIQXUktdNsEMR5-i0MdIQoLFC2XNuAROhjxweGvKC7smKroykpMYCGVxtCgCkEQDM+A1yfi8v4dYMppCvCFOSq4pUaWmmMVixlGoWVstMGiGsvd-AUOFcmBe9opLUkCXCHoJjrqTFOlS8hHh7lCgAIqCoRKwqSJYyRkDlK6E6HKuUIt+caBFWMDBGDJPiYWDAkhiCFBDMQSzdX6sZfudV5thRrnMN6fw-sjix3BdkUN9LTEyuUGCpsOqCRrjcrybaVwiBTh3NeLak1KQ0BlPmSSdshTmDXJCNc-LqTVkvGqLau1MRiD+I4DMqSTrrRSoi5FURQBTgcIWlIe4NVL2knmpwlqjCslcHlMag4rTrpxmiHdS78B6ulTdeaLhJngUVv4dKNlimNJxs0gmFS2nWBCFFUIZrzYFqLWGBO7q7DSGMGNJkSEQ1hoJEehlRAo0PJFHGhNoAk0EtTXSiNlJs3IYPQWk0xbS3lqwCsKtqxa2aobebJtLa21Og7W+btAhe39tlATH96oR0KkkEihQE6p0zpsHO5MxIJIOkXZwrDRaJg7s3XCygpHsYHog5mk92M75RRdRIblvKWDbH8JU1mr6+kKpEEq+8Wnb101M0VPTUULRiDlEQEz6VLOgHfSbJMEIdUAaAyOf2MJVTTujAuAIQhVBuW7LID0Eo9ptkwJmSk7Hx0nuBAJxeQntWrwEJ9d04pYhnISu5zLnpVDY0k-ChgGlVL5Yi5rFYeWdQRfeLsGr4WzCpXMBVswf0oocP2QISEcKbMiCIB+tzaWNSeYJMmYEuphzSkZaCGQtWzCDGHNEzRqwxlfkCEOhOTshR9rENufabt4H6SdvNprkpoNJc1cvMNPW+u2cNZ9NMnK1OGr-lOVweEwMpHXiIfx-RXA0RMweldl9XAOGByJnjrAdyTHGOYZ7XKhu3dG-gYDWhQRTaxHNsLWXVBLdi2iciq2xZanLE4RqJ1Tt7YO67IU6VNpaATlQMGWhccFYEJd2013hPdba6oFr-PgFYNy2loXGlQAqQwAjgQL2tBTHSupD7GAvsHr8YpAJviVlf1awt1QP0AcYCB11iMBJQckEN0iSH+z83Q5QLDiY8PEdqeR+51H6PQBkQcGLZegxs7HQp4iQu8MyBak4z3bDWIkgpsUEKBOJbryAbRyOSgYcapEEp1jmblJfh22FhNciWoGAsOY0dtWWAc8CDtui7asocKRvnSlp07mAAyxMfdTGV6sEzgRLfG++-gc3luIcm9etyu3DvxgOZczBgAQoiKi+BQIjg7Iyk8W7QYpEhnXJn6orheDoGOSF+BE-bh3ydMiRKtQ0GANoS-84BChGJObDsDgmUk0EBIKO5hMRbWklIGFMWCdQhREMkHNOsREXHLbdULdBFVfQwAAchr3v1eTFhBSxCgKnArgQ2m1AAYBIDCxhGbEkl5D40S25wXVS26wYBTDr2kCmDV38U+i10OXQW8A8B+mR0eXsFeXcgbgDTIl+Bu2znRnlgrEnSVDmAxF1BLC1AajwIEDckxFhxVG3AYCkC0HgNj3Nij2rR7gpD1FwOZ1Z1M2g0bV-w0Rj0A3RGzlaiknVBrRrC0JWEdi0DzFDxhGbjNDEB8joCoCjlO0cOcODRRFDQDQuiJkkAYFGmQ2Wyz1JRgyuCSLj2pEhFBUxEiJSloLXxWAYLSxoLoLSF-3lA0LXGMC6A8HCIyIcCiI8ATCFCSO5nIMEy1Wb3yOyMMCKLUNKPKNUh6H0NRRywcXwVUiq1M0NXcwKLX3UgmLGMWnMH6MkBYEeDuAuVAAADFos1gVjtA1iehBolg1V9ZNiYtsZFoTjtinh7gDiGAjj-B7JbADBwAw4XYtRwAvkiBwBXkhCAABIsGgIQDYNycARQb4ogYASacAMaY8BgcAP4SQZGcwOYu4BYgYmgHYtYi4ogI43YLE74EhfkdgRoYkkk8AMoHAAgYAOw8wGofIUk+k+oPgFom7AAcVlyRKmClziCFzGMazx2kA3SWCkytENWK2k2tFGC7xQIEHs1pkt3Zwi2ByF3tzh1ADkm9g2nS3cwyz1wEF+mR1BFjXjVBG6hLCVHeX+MBMwBCxkIkEDBkBhDGURGxCkFzHeRrVdJENkDpyriuCkEhREABDaGPwAFkHAGA5R-l25sJcJ8JgBdQEzmAqgASgSM9rB-DyQqBiAASMgsgABif0kmIM0M8MyMsSc2QuUMQdEtHMmufwo-JwU-LULnZkxfNYUAakw1KcMtVU7QUIWHWlNkogcwQkgoBk8c7gckioY8GkzqOoCchcjgJk5LSkQQUQM0d3EcGcstUff9XrUwWzEIZktc8QV0pPD3GcnU87YXQRW7cXKcBUswbqIXHcXc10IXQXXU+oukxc38hAKcykw6Wk+cv80C6AE2MAEPSgp0NlPkjnaI27KYmCUIL2ZcDwOgSoVoGgcACk-AU1PgaSNcF5EgRY+wIQT6MYv+WYoYndRadKR4cCO4eitCK4+i3peRbQeiugRizi2mUINCdixOHi5i1iviwSq4YSvigSnYEhfEkcgi6kIixqSEAg+QGECioY0zCXJEmi09Oivi7ipiqS0StWI4jiriyS0y6SvSyyzYfikyuy8S2y6gfi3pBrfEqhZHH4omFCYnUAcCMQfUSFBQH5EBf9L44cIwecH5ZM6MzuOMlnLEGUGsSiaiKgGbNETAIwYAQKxQKFUK1ycK3gqKkQGKrCgsugiQcAZQKwOQbCmq1Ncs8g6SJ+IgDogQBSWqgJSi2mCXLGTStSS4C2XBEaLS-Eh4sE54jaQ7d49GCK34y01MkEx4qICEhwKEhmNAuEhE0YzSxaNYgAfUWIpBllWOTh1k6vkHsrOpTgGm2Lcp0H8vtMLkuq7DyhfhRFavateuUjTDWBvnGKaSZnCAwHuLAFBKeJeJmo+PmukD+OTKtOBIhtWshOhK2vhMzF2pFxWH2vOoJiOoGNOt2LxrVMkCuusv1jZQvX0lepvSxiBp1hBsNj7KBGZMXQcDdzyL511NSnYO-LZu1QcFIphHasNSUpIoj3UsmPav5pXJu3MAcBUsIKEFFqmHFqVrUvIulroNlp50FsploEmB3XAgVuFpVroLQmNoVo1pBnNrX0GC+roJ+s+kVtUttpls2RnwaIVuvFxwVC0Njh4OHBICjhjhUGC0pAEGmx1nTU2HrDi3DywBRF0PwzpUlqECFADqgNAzFkXzYwkA4xRTVGj29QkF9VdHjhgLdqIM1W-WMDj3VCzrFG-xY2TOgMUGhRIK3w3Js0OiVDIqdiDzxqkCYHBCFG8vJA7F1BWACqCvysMEKtdAiuiGiv+LitjJAESsxGStStHnStlEyuytyuCoEAKtDyXuKqsFKv+KaquyXnPJHEOinDoBfvYy+xNo5rS0GBfs5AcANrblhzvi1EpCkHxBzCmFKj0zbMpHAiIFiimDfqBH0BRCnDfroC1GoCxEmAmCmBYkAfeEwBQbfvAmGDQnwcmVAZ5HAYxFQYLpoHAmwB-kRXodIb3AAPEFUCnA8GBA8EGFKh3EcyZpQrGR90IcnTQYwaoCwZwamGGHIbcEocRnoJoeIcYYEbCAiHZVly5S0bAYEGlggrHLArAoAsIBnIcGAqJOMZMYoIdAfvG3MZ7LvmgYxFFLFnMC4Z8HUYwFUy0GftfrodNP-snyfCnCIG-oCdoHUbyBAusb-PJMKt8hRR1k6LnKsbid-L4BcecMNTvmlAUBVWAF4dcFrDr0KdKcZShJoA8BQGcxQBcYbPwE2K1AUlagAAkoVcnXB7AM8BAVUOmFBmxmEBAam6mGnj9mmOrhnyYiYZVt4MAemtQVUZm68hnWpimMAFAe5b53hcdln8o1gEUtnQ1ccamMBQhLdUCiB-BwJ3hDFfgNm3BbwZCznQAf5XBIESBb4LmPnYEW8Nprn-LLa6mTyNzHzCt2QtA75S7TBCs1cz0nmfBKMBAwxnDHN8m+nl4wxGnJnWmBABn9H3gKnAWixsWJmz88WVnGU9M8hIhohYWV4bcUhRMt8+zanlzrtQUCChBNzxsczWgnHNG1FFBAWZzXBYmmgMAXHKQphtzvH+k3AAA9GRKVlIKSAltxgQDxjwDFjweV9AJVlV0AaVqlmVmPbV4lvVvTA1jAZVoVtaEV-wcx0uQsBwcV9JyV41tVjEdq3I81zxq191qKO11VmwI8NAhWzVhWsta1sAQ1+1jER1js9koNrgVwaV31tMP8GCBB3UfbSkakrho4Xhm8Lx2N4No16VglrNt-ZRwK-N5N4cotvCvh3V-VuN21mRdN712BmtwwYYP3TN4uftv3at4dgQAdjEU1vtid+BgIPN5bdUzsTUugJ2KcW5qKQtjwYtncS3DALd4tvhrxvdxt7Vw9m8Ntk9g9ltm8S13d1wMh8t+N7tsN0zP15TAIflLhjF3wRZkZ+9qKGsflAlrhv9vVk9oQL9jwYl3wY5ugU5gDtwBgflU1rhuDhDk9zFmE6N6D2ZogcD94YwflBwMJ311tqFAjzd-lId7NgQb9ijxDjATEYDqFGd0D4cLUSjtwTAaj8d4YLhmD9DsULj-QYYFDvDmd-jjwK5kTz3ajwoyTgTvD2T9AP47C0kScEE3ygmT5yGQKKUA+hUQjbRY8Q7d4OQcTuvItv5gFlTsANTkEu0TTowVCEKdyfOLyKVOUIzt-HaaQUzn0twCzqdvD6z0KWThwFjhQRT28Dj-9sINFL1sNp9ztvgUIIAA
 *
 * @see
 * - https://stackoverflow.com/q/75531366/1938970: fix for `Type instantiation is excessively deep and possibly infinite in Promise.all`
 *
 * @notes
 * I might take a better look at how things were done in [i18next](https://github.com/i18next/i18next/blob/master/index.d.ts)
 */

type MergeDictionaries<T, K> = Omit<T, keyof K> & K;

type Join<A, Sep extends string = "", R extends string = ""> = A extends [
  infer First,
  ...infer Rest,
]
  ? Join<
      Rest,
      Sep,
      R extends "" ? `${First & string}` : `${R}${Sep}${First & string}`
    >
  : R;

type BuildRecursiveJoin<TList, TSeparator extends string> = Exclude<
  TList extends [...infer ButLast, unknown]
    ? Join<ButLast, TSeparator> | BuildRecursiveJoin<ButLast, TSeparator>
    : never,
  ""
>;

type JoinObjectPath<S1, S2> = S1 extends string
  ? S2 extends string
    ? `${S1}.${S2}`
    : S1
  : never;

/**
 * A very simplified version of `type-fest`'s `Get` type
 */
type GetWithPath<BaseType, Keys extends readonly string[]> = Keys extends []
  ? BaseType
  : Keys extends readonly [infer Head, ...infer Tail]
    ? GetWithPath<
        Head extends keyof BaseType ? BaseType[Head] : unknown,
        Extract<Tail, string[]>
      >
    : never;

/**
 * A very simplified version of `type-fest`'s `Get` type, its implementation
 * of square brackets doesn't match our convention as we always keep dots
 * around the brackets and the brackets do not mean dynamic object access but
 * just a dynamic portion of a route.
 */
type Get<BaseType, Path extends string | readonly string[]> = GetWithPath<
  BaseType,
  Path extends string ? Split<Path, "."> : Path
>;

/**
 *
 */
type TranslationsDictionaryDefault = {
  // "~": any;
  "~": {
    test: string;
    static: string;
    dynamic: {
      static: string;
      "[key]": {
        index: string;
        "[id]": string;
      };
    };
  };
};

/**
 * Dictionary of all the translations
 *
 * It must uses `~` as namespace for routes defintions to make the `to` and `useTo`
 * working
 */
export type TranslationsDictionary = MergeDictionaries<
  TranslationsDictionaryDefault,
  I18n.Translations
>;

/**
 * Namespaces should match the filenames were translations are defined
 */
export type TranslateNamespace = Extract<keyof TranslationsDictionary, string>;

/**
 * Translation **value** found at a specific _path_ in the given _namespace_
 *
 * `TPath` can be any of all possible paths:
 * - `plusKey` sub dictionaries within a namespace
 * - `plusKey.nested` whatever nested level of nesting within a namespace
 */
export type TranslationAtPathFromNamespace<
  TNamespace extends TranslateNamespace,
  TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
> = TNamespace extends TranslateNamespace
  ? TPath extends string // TranslationsPaths<TranslationsDictionary[TNamespace]>
    ? Get<TranslationsDictionary[TNamespace], TPath>
    : TranslationsDictionary[TNamespace]
  : never;

/**
 * The generic type passed and to use with {@link TranslationAtPath} when you
 * want to build a type extending that
 */
export type TranslationAtPathGeneric =
  | TranslateNamespace
  | TranslationsAllPaths;

/**
 * Translation **value** found at a _path_
 *
 * `TPath` can be any of all possible paths begininng with a namespace:
 * - `namespace` only a namespace
 * - `namespace:plusKey` sub dictionaries within a namespace
 * - `namespace:plusKey.nested` whatever nested level of nesting
 */
export type TranslationAtPath<TPath extends TranslationAtPathGeneric> =
  TPath extends TranslateNamespace
    ? TranslationsDictionary[TPath]
    : TPath extends `${infer Namespace}:${infer Path}`
      ? Namespace extends TranslateNamespace
        ? Get<TranslationsDictionary[Namespace], Path>
        : never
      : never;

/**
 * All translations paths from the given _path_
 *
 * `TPath` can be any of all possible paths begininng with a namespace:
 * - `namespace` only a namespace
 * - `namespace:plusKey` sub dictionaries within a namespace
 * - `namespace:plusKey.nested` whatever nested level of nesting
 */
export type TranslationPathsFrom<TPath extends TranslationAtPathGeneric> =
  TPath extends TranslateNamespace
    ? TranslationsPaths<TranslationsDictionary[TPath]>
    : TPath extends `${infer Namespace}:${infer Path}`
      ? Namespace extends TranslateNamespace
        ? Get<TranslationsDictionary[Namespace], Path> extends object
          ? TranslationsPaths<Get<TranslationsDictionary[Namespace], Path>>
          : TranslationsPaths<TranslationsDictionary[Namespace]>
        : never
      : never;

/**
 * All translations _paths_ of the given one, e.g. if `TPath` would be
 * `"dashboard.users.[id].edit"` the generated type would be the union
 * `"dashboard.users.[id]" | "dashboard.users" | "dashboard"`.
 */
export type TranslationsPathsAncestors<
  TPath extends string,
  TSeparator extends string = ".",
> = BuildRecursiveJoin<Split<TPath, TSeparator>, TSeparator>;

/**
 * Recursive mapped type to extract all usable string paths from a translation
 * definition object (usually from a JSON file).
 * It uses the `infer` "trick" to store the object in memory and prevent
 * [infinite instantiation errors](https://stackoverflow.com/q/75531366/1938970)
 */
export type TranslationsPaths<T, TAsObj extends boolean = true> = {
  [K in Extract<keyof T, string>]: T[K] extends  // exclude empty objects, empty arrays, empty strings
    | Record<string, never>
    | never[]
    | ""
    ? never
    : // recursively manage objects
      T[K] extends Record<string, unknown>
      ?
          | (TAsObj extends true ? `${K}` : never) // this is to be able to use the "obj" shortcut
          | JoinObjectPath<K, TranslationsPaths<T[K], TAsObj>>
      : // allow primitives or array of primitives
        // TODO: support array of objects recursively? For now we just stop at the array name
        T[K] extends
            | string
            | number
            | boolean
            | Array<string | number | boolean | object>
        ? `${K}`
        : // exclude anything else
          never;
}[Extract<keyof T, string>] extends infer O
  ? O
  : never;

/**
 * Recursive mapped type of all usable string paths from the whole translations
 * dictionary. It uses the `infer` "trick" to store the object in memory and prevent
 * [infinite instantiation errors](https://stackoverflow.com/q/75531366/1938970)
 */
export type TranslationsAllPaths = {
  [N in Extract<keyof TranslationsDictionary, string>]: {
    [K in Extract<
      keyof TranslationsDictionary[N],
      string
    >]: TranslationsDictionary[N][K] extends  // exclude empty objects, empty arrays, empty strings
      | Record<string, never>
      | never[]
      | ""
      ? never
      : // recursively manage objects
        TranslationsDictionary[N][K] extends Record<string, unknown>
        ?
            | `${N}:${K}` // this is to be able to use the "obj" shortcut
            | JoinObjectPath<
                K extends string ? `${N}:${K}` : `${N}:`,
                TranslationsPaths<TranslationsDictionary[N][K]>
              >
        : // allow primitives or array of primitives
          // TODO: support array of objects recursively? For now we just stop at the array name
          TranslationsDictionary[N][K] extends
              | string
              | number
              | boolean
              | Array<string | number | boolean | object>
          ? `${N}:${K}`
          : // exclude anything else
            never;
  }[Extract<keyof TranslationsDictionary[N], string>];
}[Extract<keyof TranslationsDictionary, string>] extends infer O
  ? O
  : never;

/**
 * Unlike in `next-translate` we allow passing some predefined arguments as
 * shortcuts for common use cases:
 * - `"obj"` as a shortcut for `{ returnObjects: true }`
 * - `""` as a shortcut for `{ fallback: "" }`
 *
 */
export type TranslationShortcut = "obj" | "";

/**
 * Query object to populate the returned translated string interpolating data
 * or a TranslationShortcut.
 *
 * NOTE: when using a shortcut passing TranslationOptions to `t()` is not supported
 * TODO: type safe this behaviour of the third argument (options).
 */
export type TranslationQuery =
  | undefined
  | null
  | TranslationShortcut
  | {
      [key: string]: string | number | boolean;
    };

/**
 * Opions of the translate function or a TranslationShortcut.
 *
 * NOTE: when using a shortcut passing TranslationOptions to `t()` is not supported
 * TODO: type safe this behaviour of the third argument (options).
 */
export type TranslationOptions =
  | undefined
  | TranslationShortcut
  | {
      returnObjects?: boolean;
      fallback?: string | string[];
      default?: string;
    };

/**
 * Translate function which optionally accept a namespace as first argument
 */
export type Translate<
  TNamespace extends TranslateNamespace | undefined = TranslateNamespace,
> = TNamespace extends TranslateNamespace
  ? TranslateNamespaced<TNamespace>
  : TranslateDefault;

/**
 * Translate function **without** namespace, it allows to select any of the all
 * available strings in _all_ namespaces.
 */
export type TranslateDefault = <
  TPath extends TranslationsAllPaths,
  TReturn = TranslationAtPath<TPath>,
>(
  s: TPath,
  q?: TranslationQuery,
  o?: TranslationOptions,
) => TReturn;

/**
 * Translate function **with** namespace, it allows to select all available
 * strings _only_ in the given namespace.
 */
export type TranslateNamespaced<TNamespace extends TranslateNamespace> = <
  TPath extends TranslationsPaths<TranslationsDictionary[TNamespace]>,
  TReturn = TranslationAtPathFromNamespace<TNamespace, TPath>,
>(
  s: TPath,
  q?: TranslationQuery,
  o?: TranslationOptions,
) => TReturn;

/**
 * Translate function _loose_ type, to use only in implementations that uses
 * the `t` function indirectly without needng knowledge of the string it needs
 * to output.
 */
export type TranslateLoose<TReturn = string> = (
  s?: any,
  q?: TranslationQuery,
  o?: TranslationOptions,
) => TReturn;

/**
 * Translate function _loosest_ type it allows to return string or object or array
 * or whatever basically.
 */
export type TranslateLoosest<TReturn = any> = (
  s?: any,
  q?: TranslationQuery,
  o?: TranslationOptions,
) => TReturn;

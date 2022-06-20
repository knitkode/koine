/**
 * Translations dictionary extracted from JSON files.
 * You need to augment this type with something like:
 *
 * ```ts
 * declare namespace Koine {
 *   interface NextTranslations {
 *     "~": typeof import("./locales/en/~.json");
 *     "_": typeof import("./locales/en/_.json");
 *     "$team": typeof import("./locales/en/$team.json");
 *     "home": typeof import("./locales/en/home.json");
 *     "Header": typeof import("./locales/en/Header.json");
 *   }
 * }
 * ```
 * 
 * An alternative to the use of the extended namespace (that I could not make it
 * to work) is to augment the interface commented here below with module
 * augmentation, something like:
 * 
 * ```ts
 * declare module "@koine/next/i18n" {
 *   interface TranslationsDictionary {
 *     "~": typeof import("./locales/en/~.json");
 *   }
 * }
 *```

 * Best to follow a convention to name the files which become the namespaces:
 *
 * - `~`: for app wide **urls** translated definitions
 * - `_`: for app wide **common** translations
 * - `${data}`: dollar prefix for static **data** like arrays, objects, .etc
 * - `{route-name}`: lower cased for **route** specific data
 * - `{ComponentName}`: pascal cased for **components** specific data
 */
export type TranslationsDictionary = Koine.NextTranslations;
// export interface TranslationsDictionary {
//   [key: string]: any;
// }

export type TranslateNamespace = Extract<keyof TranslationsDictionary, string>;

type Join<S1, S2> = S1 extends string
  ? S2 extends string
    ? `${S1}.${S2}`
    : S1
  : never;

export type TranslationsPaths<
  T,
  TAddRoot extends true | undefined = undefined
> = {
  [K in Extract<keyof T, string>]: T[K] extends Array<
    // if we have an array of objects
    Record<string, unknown>
  >
    ? `${K}`
    : // if we have an object
    T[K] extends Record<string, unknown>
    ? TAddRoot extends true
      ? `${K}` | Join<K, TranslationsPaths<T[K], TAddRoot>>
      : Join<K, TranslationsPaths<T[K], TAddRoot>>
    : // | `${K}` /* Add for "obj" */
    // | Join<K extends string ? `${K}` : ``, TranslationsPaths<T[K], true>>
    // if we have an array of primitives
    T[K] extends Array<string | number | boolean>
    ? `${K}`
    : // if we have a primitive string/number/boolean
    T[K] extends string | number | boolean
    ? K extends string
      ? `${K}`
      : never
    : never;
}[Extract<keyof T, string>];

export type TranslationsAllPaths = {
  [N in Extract<keyof TranslationsDictionary, string>]: {
    [K in Extract<
      keyof TranslationsDictionary[N],
      string
    >]: TranslationsDictionary[N][K] extends Array<
      // if we have an array of objects
      Record<string, unknown>
    >
      ? `${N}:${K}`
      : // if we have an object
      TranslationsDictionary[N][K] extends Record<string, unknown>
      ?
          | `${N}:${K}` /* Add for "obj" */
          | Join<
              K extends string ? `${N}:${K}` : `${N}:`,
              TranslationsPaths<TranslationsDictionary[N][K], true>
            >
      : // if we have an array of primitives
      TranslationsDictionary[N][K] extends Array<string | number | boolean>
      ? `${N}:${K}`
      : // if we have a primitive string/number/boolean
      TranslationsDictionary[N][K] extends string | number | boolean
      ? K extends string
        ? `${N}:${K}`
        : `${N}:`
      : never;
  }[Extract<keyof TranslationsDictionary[N], string>];
}[Extract<keyof TranslationsDictionary, string>];

/**
 * Query object to populate the returned translated string interpolating data.
 *  Unlike in `next-translate` we allow passing just `obj` as a shortcut for
 * `{ returnObjects: true }`. In such case the thrid argument will not exists.
 *
 * TODO: type safe this behaviour of the third argument (options).
 */
export type TranslationQuery =
  | undefined
  | null
  | "obj"
  | {
      [key: string]: string | number | boolean;
    };

/**
 * Opions of the translate function. Unlike in `next-translate` we allow passing
 * just `obj` as a shortcut for `{ returnObjects: true }`.
 */
export type TranslationOptions =
  | undefined
  | "obj"
  | {
      returnObjects?: boolean;
      fallback?: string | string[];
      default?: string;
    };

/**
 * Translate function which optionally accept a namespace as first argument
 */
export type Translate<TNamespace extends TranslateNamespace | undefined> =
  TNamespace extends TranslateNamespace
    ? TranslateNamespaced<TNamespace>
    : TranslateDefault;

/**
 * Translate function **without** namespace, it allows to select any of the all
 * available strings in all namespaces.
 */
export type TranslateDefault = <TReturn = string>(
  s: TranslationsAllPaths,
  q?: TranslationQuery,
  o?: TranslationOptions
) => TReturn;

/**
 * Translate function **with** namespace, it allows to select only the all available
 * strings in the given namespace.
 */
export type TranslateNamespaced<TNamespace extends TranslateNamespace> = <
  TReturn = string
>(
  s: TranslationsPaths<TranslationsDictionary[TNamespace], true>,
  q?: TranslationQuery,
  o?: TranslationOptions
) => TReturn;

/**
 * Translate function loose type, to use only in implementations that uses
 * the `t` function indirectly without needng knowledge of the string it needs
 * to output.
 */
export type TranslateLoose = (
  s?: any,
  q?: TranslationQuery,
  o?: TranslationOptions
) => string;

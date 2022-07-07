/**
 * @file
 *
 * Test this on TSplayground:
 *
 * https://www.typescriptlang.org/play#code/MYewdgzgLgBFCmAPWBeGBvAUDGEBcMARBAIYAmJhANNnAYVOZTTgK4FY5sCM9r3hWgF8WMeAFsADlACeHIZgWZQkWKwBOAGxhpOMAG4lNrePVIVBSsvGCaS6+DDAlx8CJJLBHAaRABLMEc9WUlHADkkKAAVdRJIOyg-cAgdDFocBGQCEPgQADM4SIBudJgNTWyZUPyyrRKcIRKlHJgAKX8wAB4AZW4qGG6AJgA+VN6xZHgwMhTodQCAc1oAfgHBiYRp2ah5sCWuGFWAAwASdF6hADozoaEj0oJe2gJA-Xh1EswkSRB1WBaYnEIAkkpAAAokKAACwgnVoUVEUQAgmQyAAlEAgWCRKYzODqEwwAA+ZWm8DyAXgZFSrDJFMCZEwo10tAA2t4YAEYABRZCxYBQToAa3gMhqCNwO0WwwAugQouyZRtcSkkepYjI4QcAPTazkFADujihJDeMDi5vVJBkMBqIAARgArGxQCClNE2X5kTpzRb9WlCsAgA1gYa0MMHY5nbx3B4wXX6mBGmAms0Wh3OgWlBXeJU4rYwD2gdTe317f1gQPB0OlZalA7I1EYrHKgs7Ez1rhR9Axo7EtodTrefqA+KQ0EQCHQ2E5mUjlHozFQYYRg5cAjtAJDkexMeJZJTmGdWfzptLlednAJkmnHt3eMAKhgC5geV+RAzhBgD+1l-jepJTcug5fM8TLBZDhgW9exgAgjiOHcgRBA9ISPE98RMC8DgIBM-ENY1TUcC17A1W0CkkeZxD8RI3jdBtFVbPE1Q1H0pT2fswFYcR7Xeft7UxTR4DiVccG7Xs41w-CU0I80YAovwqJoxxwO1TjuPebV+JAQS4mzBjQO2XYIJJNSePUPiBKEsBaxgEDJgLcDOzE2M11gqD7mw9ymlZXkdk8QURTFAoJXA2VPm+X5-iqRxR2BcdkiRTRNEPFIWRwVkwk5MAeT5fzhVFGpfEpS4ImQWLkMgfpQrlNIDnZLKcr8gV8qC2yOngErInK+LIAyudJSM2UCCKwJOrK3c4v3XqwhlfT7KYq1NU7SSkwItNspI60yNtJ0XTotciy9VijIrKsQxEmALtEqCzjCIQ8GjFy1xwvU8NW6T1p2zMoE7EaOtK6IJoqiA+rmzY8UOktjr9UkzprVy61cg4b1u+7Hr7bUnxfN9zMIT9v1-JGuEAwc-1cuzwcMxZINvO6HrvPs4NRvAELJtduqmydUNhP6xsBpCepBmbFX6dt4CupGJZexNk1TIiNsW7b5MUvxaN+9q+Y5idQdzRjVUW6H2JMrizIs7SrIl7s6fRztpbe2WZJIOTKOo1XlLYhZVJNjStJ06zyY1gGteSHW83mqmjacb3zJJX2rKc2y9YGxY-yttGGb-Jn0Dpjznq84QfNy5rAsKwOuqBwW+qqj2wsUQumoCgqCl5oOK856vBplT5MYfbAnwhCAIGpx1WGgKCMz7PwUidiAoUi4BWFgHGoPQGAHCgDQwAAeV2gV8AwxwXJ-L5EB+P44GimBg7AABFEx1BtFBaBJWlrHpKln6jpLP7xp1BBwEkeg6qBQIOBGq4EOLRzNn7eoXBGiYEwD3PuMAB5D3YiPMeRwJ6cmnrgOefwF5L3fEcVe69N472+vvMWMAj6-giufAEbdQRb2kBOHQn9X7kkpIyABH4-6fyAVwMh6ht671dMsAgcc4iwIOHkIwmh7SeCFBI5OkdwKsi7p2N+JBWCaCgCo8CMiaHhVPpFGA1hbD2EcIwgWCAwguDcB4LwqRfL8kbq1Fu5dbETg7tKbuep6GwAsXYBwF9QhXzbvAexrh3CeCpMeaJji4lJxLs3Mu41vHJGZDAY8HoN4iKTgGIMIZUihQABT72vlzacQ50n8z3NrKIiTYleBlMMAAlDoUYUQ8mbxKIE8xNgQnWMvhzKJDiWnxKaRMpxjgDIwFSW1YqrdMmQGybk+A+TsrzKKdWUpNcKnyiYShGpniMkNJDtMmJsz+pi2GP0AAjio6+d93gyH6CAZ5xzt6sOSJ0lA3TekiP6aY8+wSrFhJipEgAIuSHRejUgbK2YUysxTspoHKZU75EBErJW5o8r5qzXkPw+YSi5PzOb-MBZsvpCCBngtCXkWkApQRlAgPAKIZT2lHNsfAWFcjdFQBBWfIJQyIVMrACy8AbKOUJJmck+ZYzmmzOGGU5w1y4nymVXE7lETeXaq8N6K5SSvDDBKAmelYrGXMqmjKqIcqNXOPmYss59TJoTlVeqk1pgr4GvgLqpV8rDUOu9WahBKgx5QH5fC1AdquUlAjf8KINJ2WcoYJEQg7SE3JH+AAVRTRysphByiZs+Im2SaAo1wsFUWzIUA8CsEuPwUtygc0wHtKkaIRaJDSBkC28twBO25qLYYYw8AW1AAhttps://www.typescriptlang.org/play#code/MYewdgzgLgBFCmAPWBeGBvAUDGEBcMARBAIYAmJhANNnAYVOZTTgK4FY5sCM9r3hWgF8WMeAFsADlACeHIZgWZQkWKwBOAGxhpOMAG4lNrePVIVBSsvGCaS6+DDAlx8CJJLBHAaRABLMEc9WUlHADkkKAAVdRJIOyg-cAgdDFocBGQCEPgQADM4SIBudJgNTWyZUPyyrRKcIRKlHJgAKX8wAB4AZW4qGG6AJgA+VN6xZHgwMhTodQCAc1oAfgHBiYRp2ah5sCWuGFWAAwASdF6hADozoaEj0oJe2gJA-Xh1EswkSRB1WBaYnEIAkkpAAAokKAACwgnVoUVEUQAgmQyAAlEAgWCRKYzODqEwwAA+ZWm8DyAXgZFSrDJFMCZEwo10tAA2t4YAEYABRZCxYBQToAa3gMhqCNwO0WwwAugQouyZRtcSkkepYjI4QcAPTazkFADujihJDeMDi5vVJBkMBqIAARgArGxQCClNE2X5kTpzRb9WlCsAgA1gYa0MMHY5nbx3B4wXX6mBGmAms0Wh3OgWlBXeJU4rYwD2gdTe317f1gQPB0OlZalA7I1EYrHKgs7Ez1rhR9Axo7EtodTrefqA+KQ0EQCHQ2E5mUjlHozFQYYRg5cAjtAJDkexMeJZJTmGdWfzptLlednAJkmnHt3eMAKhgC5geV+RAzhBgD+1l-jepJTcug5fM8TLBZDhgW9exgAgjiOHcgRBA9ISPE98RMC8DgIBM-ENY1TUcC17A1W0CkkeZxD8RI3jdBtFVbPE1Q1H0pT2fswFYcR7Xeft7UxTR4DiVccG7Xs41w-CU0I80YAovwqJoxxwO1TjuPebV+JAQS4mzBjQO2XYIJJNSePUPiBKEsBaxgEDJgLcDOzE2M11gqD7mw9ymlZXkdk8QURTFAoJXA2VPm+X5-iqRxR2BcdkiRTRNEPFIWRwVkwk5MAeT5fzhVFGpfEpS4ImQWLkMgfpQrlNIDnZLKcr8gV8qC2yOngErInK+LIAyudJSM2UCCKwJOrK3c4v3XqwhlfT7KYq1NU7SSkwItNspI60yNtJ0XTotciy9VijIrKsQxEmALtEqCzjCIQ8GjFy1xwvU8NW6T1p2zMoE7EaOtK6IJoqiA+rmzY8UOktjr9UkzprVy61cg4b1u+7Hr7bUnxfN9zMIT9v1-JGuEAwc-1cuzwcMxZINvO6HrvPs4NRvAELJtduqmydUNhP6xsBpCepBmbFX6dt4CupGJZexNk1TIiNsW7b5MUvxaN+9q+Y5idQdzRjVUW6H2JMrizIs7SrIl7s6fRztpbe2WZJIOTKOo1XlLYhZVJNjStJ06zyY1gGteSHW83mqmjacb3zJJX2rKc2y9YGxY-yttGGb-Jn0Dpjznq84QfNy5rAsKwOuqBwW+qqj2wsUQumoCgqCl5oOK856vBplT5MYfbAnwhCAIGpx1WGgKCMz7PwUidiAoUi4BWFgHGoPQGAHCgDQwAAeV2gV8AwxwXJ-L5EB+P44GimBg7AABFEx1BtFBaBJWlrHpKln6jpLP7xp1BBwEkeg6qBQIOBGq4EOLRzNn7eoXBGiYEwD3PuMAB5D3YiPMeRwJ6cmnrgOefwF5L3fEcVe69N472+vvMWMAj6-giufAEbdQRb2kBOHQn9X7kkpIyABH4-6fyAVwMh6ht671dMsAgcc4iwIOHkIwmh7SeCFBI5OkdwKsi7p2N+JBWCaCgCo8CMiaHhVPpFGA1hbD2EcIwgWCAwguDcB4LwqRfL8kbq1Fu5dbETg7tKbuep6GwAsXYBwF9QhXzbvAexrh3CeCpMeaJji4lJxLs3Mu41vHJGZDAY8HoN4iKTgGIMIZUihQABT72vlzacQ50n8z3NrKIiTYleBlMMAAlDoUYUQ8mbxKIE8xNgQnWMvhzKJDiWnxKaRMpxjgDIwFSW1YqrdMmQGybk+A+TsrzKKdWUpNcKnyiYShGpniMkNJDtMmJsz+pi2GP0AAjio6+d93gyH6CAZ5xzt6sOSJ0lA3TekiP6aY8+wSrFhJipEgAIuSHRejUgbK2YUysxTspoHKZU75EBErJW5o8r5qzXkPw+YSi5PzOb-MBZsvpCCBngtCXkWkApQRlAgPAKIZT2lHNsfAWFcjdFQBBWfIJQyIVMrACy8AbKOUJJmck+ZYzmmzOGGU5w1y4nymVXE7lETeXaq8N6K5SSvDDBKAmelYrGXMqmjKqIcqNXOPmYss59TJoTlVeqk1pgr4GvgLqpV8rDUOu9WahBKgx5QH5fC1AdquUlAjf8KINJ2WcoYJEQg7SE3JH+AAVRTRysphByiZs+Im2SaAo1wsFUWzIUA8CsEuPwUtygc0wHtKkaIRaJDSBkC28twBO25qLYYYw8AW1AA
 */

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
 * Unlike in `next-translate` we add passing some predefined arguments as
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

/**
 * By convention routes definitions are in the `~.json` file in the locales/{locale}/
 * root folder. This type represent every possibly name of the defined route's
 * localised pathname (even with dynamic portions).
 */
export type TranslatedRoute = TranslationsPaths<TranslationsDictionary["~"]>;

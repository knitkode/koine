/**
 * Types specifically related to `@koine/i18n` exposed on the global unique
 * namespace `Koine`. Most of the types here should be prefixed by `I18n`, e.g.
 * `I18nSomeFeature` accessible anywhere from `Koine.I18nSomeFeature`
 */
declare namespace I18n {
  /**
   * Translations dictionary extracted from JSON files.
   * You need to augment this type with something like:
   *
   * ```ts
   * declare namespace I18n {
   *   interface Translations {
   *     "~": typeof import("./locales/en/~.json");
   *     "_": typeof import("./locales/en/_.json");
   *     "$team": typeof import("./locales/en/$team.json");
   *     "home": typeof import("./locales/en/home.json");
   *     "Header": typeof import("./locales/en/Header.json");
   *   }
   * }
   * ```
   *
   * Best to follow a convention to name the files which become the namespaces:
   *
   * - `~`: for app wide **urls** translated definitions
   * - `_`: for app wide **common** translations
   * - `${data}`: dollar prefix for static **data** like arrays, objects, .etc
   * - `{route-name}`: lower cased for **route** specific data
   * - `{ComponentName}`: pascal cased for **components** specific data
   *
   * This works through using [type augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
   * and [merging interfaces](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces).
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Translations {
    toOverride: {};
  }
}

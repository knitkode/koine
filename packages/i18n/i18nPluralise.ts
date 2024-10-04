/**
 * @internal
 * @template {{ [pluralKey: string]: string | number | boolean }} T
 * @param {T} values
 * @param {number} count
 * @returns {T[keyof T]}
 */
export let i18nPluralise = <
  T extends { [pluralKey: string]: string | number | boolean },
>(
  values: T,
  count: number,
  locale?: string,
  pluralRules: Intl.PluralRules = new Intl.PluralRules(locale || "en"),
): T[keyof T] =>
  // @ts-expect-error nevermind
  values[count] ||
  values[pluralRules.select(count)] ||
  // @ts-expect-error nevermind
  (count === 0 ? values.zero : values["other"]);

export default i18nPluralise;

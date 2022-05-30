import type { TranslateLoose } from "../useT";
import type { Option } from "@koine/react";

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

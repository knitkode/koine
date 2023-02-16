import type { Option } from "../types";
import isString from "@koine/utils/isString";
import isArray from "@koine/utils/isArray";

export type AutocompleteValue =
  | null
  | undefined
  | (string | Option)[]
  | Option
  | string;

// export function normaliseAutocompleteValue(
//   value?: AutocompleteValue,
//   asArray?: true
// ): string[];

// export function normaliseAutocompleteValue(
//   value?: AutocompleteValue,
//   asArray?: false
// ): string;

// export function normaliseAutocompleteValue(
//   value?: AutocompleteValue,
//   asArray?: undefined
// ): string;

export function normaliseAutocompleteValue(
  value?: AutocompleteValue,
  asArray?: boolean
): any {
  if (!value) {
    return asArray ? [""] : "";
  }
  if (isString(value)) {
    return asArray ? [value] : value;
  }

  if (isArray(value)) {
    const values = value.map((valueItem) => {
      return isString(valueItem) ? valueItem : valueItem.value;
    });
    return asArray ? values : values.join(",");
  }

  return asArray ? [value.value] : value.value;
}

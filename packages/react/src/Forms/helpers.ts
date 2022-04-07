import type {
  ChangeEventHandler,
  ComponentPropsWithRef,
  ReactNode,
} from "react";
import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { isString, matchSorter } from "@koine/utils";
import type { Option } from "../types";

type FormControlNativeType = "input" | "select" | "textarea";

type FormControlFieldValues = Record<string, any>;

export type FormControlNative<T extends FormControlNativeType = "input"> = Omit<
  ComponentPropsWithRef<T>,
  "name"
>;

export type FormControlProps<T extends FormControlFieldValues = any> = {
  label?: ReactNode;
  name: string;
  control?: Control<T>;
  register?: UseFormRegister<T>;
  setValue?: UseFormSetValue<T>;
};

export type FormControl<
  TControlType extends FormControlNativeType = "input",
  TFieldValues extends FormControlFieldValues = any
> = FormControlNative<TControlType> & FormControlProps<TFieldValues>;

export const normaliseOptions = (options: (string | Option)[] = []) => {
  return options.map((option) => {
    return isString(option)
      ? {
          label: option,
          value: option,
        }
      : option;
  });
};

export function defaultOptionsFilterFn(options: Option[], inputValue?: string) {
  if (!inputValue) {
    return options;
  }
  return matchSorter(options, inputValue, { keys: ["value", "label"] });
}

/**
 * We are faking the native input `onChange` event
 */
export function triggerOnChange<T extends HTMLElement = HTMLInputElement>(
  onChange?: ChangeEventHandler<T>,
  name?: string,
  value?: any
) {
  // @ts-expect-error nevermind
  if (onChange) onChange({ target: { name, value } });
}

/**
 * @see https://hustle.bizongo.in/simulate-react-on-change-on-controlled-components-baa336920e04
 * @deprecated
 */
export function triggerChange(input: HTMLInputElement, value?: string) {
  const obj = window.Object;
  if (!obj) {
    // if (__DEV__) {
    //   console.warn("triggerChange: window.Object does not exists, bailing.");
    // }
    return;
  }
  // @ts-expect-error nevermind
  const nativeInputValueSetter = obj.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  // @ts-expect-error nevermind
  nativeInputValueSetter.call(input, value);

  const inputEvent = new Event("input", { bubbles: true });
  input.dispatchEvent(inputEvent);
}

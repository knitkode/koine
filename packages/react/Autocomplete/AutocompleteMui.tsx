import React, {
  // forwardRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import useAutocomplete from "@mui/base/useAutocomplete";
import isString from "@koine/utils/isString";
import type { Option } from "../types";
import {
  FormControl,
  // triggerOnChange,
  normaliseOptions,
} from "../Forms/helpers";
import { normaliseAutocompleteValue } from "./helpers";
import {
  AutocompleteRoot,
  AutocompleteLabel,
  AutocompleteWrap,
  AutocompleteInner,
  AutocompleteItem,
  AutocompleteItemLabel,
  AutocompleteItemRemove,
  // AutocompleteInputWrap,
  AutocompleteInput,
  AutocompleteInputArrow,
  AutocompleteMenu,
  AutocompleteMenuItem,
} from "./components";
import { InputProgress } from "../Forms/styles";

export type AutocompleteOption = Option | string;

export type AutocompleteValue<
  TMultiple extends boolean | undefined = undefined
> = TMultiple extends undefined
  ? null | Option[] | string[] | Option | string
  : TMultiple extends true
  ? Option[] | string[]
  : null | Option | string;

export type AutocompleteConfig<
  TOption extends AutocompleteOption,
  TValue extends AutocompleteValue
> = {
  creatable?: boolean;
  multiple?: boolean;
  autoComplete?: boolean;
  options?: TOption[];
  loadOptions?: (query?: string) => Promise<TOption[]>;
  onChange?: (value: TValue) => any;
  defaultValue?: TValue;
  value?: TValue;
  defaultInputValue?: string;
};

export type AutocompleteProps<
  TOption extends AutocompleteOption,
  TValue extends AutocompleteValue
> = Omit<FormControl, keyof AutocompleteConfig<TOption, TValue>> &
  AutocompleteConfig<TOption, TValue> & {
    className?: string;
    style?: React.CSSProperties;
    $ref?: React.ForwardedRef<HTMLInputElement>;
  };

/**
 * Autocomplete/autocomplete component based on [`@mui useAutocomplete hook`](https://mui.com/components/autocomplete/#useautocomplete/useAutocomplete).
 *
 * This component is design to work out of the box with [`react-hook-form`](https://react-hook-form.com/)
 * and [`yup`](https://github.com/jquense/yup) alongside our custom `Field`
 * component.
 *
 * After a lot of tests and attempts with `downshift` and `@reach` this proved
 * the best headless hook, small in size and behaving correctly in all scenarios.
 * `downshift` had in fact problems treating the initial `defaultValue` which
 * here is elegantly managed by the `isOptionEqualToValue` option passed into
 * the `useAutocomplete` hoo/useAutocompletek.
 *
 *
 * Validation with `yup` and `react-hook-form` example:
 *
 * ```ts
 * const schema = object({
 *   // the value must be an array with at least one non-empty string
 *   test1: array(string().required()).required().min(1),
 *   // the value must be an array of strings or an empty array
 *   test2: array(string().required()).required(),
 * }).required();
 * ```
 */
// export const Autocomplete = <TOption, TValue>forwardRef<
//  HTMLInputElement,
//  PropsWithChildren<AutocompleteProps<TOption, TValue>
// >(function Autocomplete(
//  {
//    creatable,
//    multiple,
//    autoComplete,
//    loadOptions,
//    options: defaultOptions = [],
//    defaultValue = [],
//    label,
//    register,
//    setValue,
//    // trigger,
//    name,
//    onChange,
//    $ref,
//    children,
//    ...props
//  },
//  ref
// ) {
export const Autocomplete = <
  TOption extends AutocompleteOption = AutocompleteOption,
  TValue extends AutocompleteValue = AutocompleteValue
>({
  creatable,
  multiple,
  autoComplete,
  loadOptions,
  options: defaultOptions = [],
  defaultValue,
  value: controlledValue,
  defaultInputValue,
  label,
  placeholder,
  register,
  setValue,
  // trigger,
  name,
  onChange,
  $ref,
  children,
  ...props
}: AutocompleteProps<TOption, TValue>) => {
  const defaultOptionsMemo = useMemo(
    () => normaliseOptions(defaultOptions),
    [defaultOptions]
  );
  const [options, setOptions] = useState<TOption[]>(
    defaultOptionsMemo as TOption[]
  );
  const [loading, setLoading] = useState(false);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    getPopupIndicatorProps,
    groupedOptions,
    value: stateValue,
    setAnchorEl,
    popupOpen,
    focused,
  } = useAutocomplete<TOption, typeof multiple, false, typeof creatable>({
    id: "Autocomplete",
    multiple: multiple ? true : undefined,
    freeSolo: creatable ? true : undefined, // options?.length ? undefined : true,
    // autoComplete: autoComplete ? true : undefined,
    disableCloseOnSelect: true,
    openOnFocus: true,
    blurOnSelect: autoComplete && !multiple,
    selectOnFocus: creatable,
    // TODO: passing the defaultInputValue makes the input controlled, which is
    // not what I want, so we probably need to handle the input default value
    // ourselves
    // inputValue: defaultInputValue,
    // @ts-expect-error FIXME: how?
    defaultValue, // : defaultValue as TOption[],
    // @ts-expect-error FIXME: how?
    value: controlledValue,
    // defaultValue: useMemo(
    //   () => normaliseAutocompleteValue(defaultValue, multiple),
    //   [defaultValue]
    // ),
    options: useMemo(
      () => (loadOptions ? options : defaultOptions),
      [loadOptions, options, defaultOptions]
    ),

    // update input change only if we are searching as you type, @see
    // https://mui.com/components/autocomplete/#search-as-you-type
    onInputChange: useCallback(
      async (_event: React.SyntheticEvent<Element>, inputValue?: string) => {
        if (!loadOptions) {
          return;
        }
        if (inputValue) {
          setLoading(true);
          try {
            const newOptions = await loadOptions(inputValue);
            setOptions(newOptions);
          } catch (e) {
            console.warn(e);
          } finally {
            setLoading(false);
          }
        } else {
          setOptions(options);
          // TODO: clear like behaviour?
          // triggerChange({ value: "", label: "" });
        }
      },
      [loadOptions, options]
    ),
    // TODO: check if we need this, probably, and check how to structure the
    // callback, here we get the actual input event
    onChange: (event, newValue) => {
      const value = normaliseAutocompleteValue(newValue, multiple);
      // @ts-expect-error FIXME: how?
      if (onChange) onChange(newValue);
      if (setValue) setValue(name, value, { shouldValidate: true });
      // triggerOnChange(onChange, name, value);
    },
    // support both freeSolo free text and full option structure
    isOptionEqualToValue: (option, value) => {
      const optValue = isString(option) ? option : option.value;
      const valValue = isString(value) ? value : value.value;
      return optValue === valValue;
    },
    getOptionLabel: (option: AutocompleteOption): string => {
      // @ts-expect-error TODO: I don't get this error
      return isString(option) ? option : option.label || "";
    },
  });

  const value =
    typeof controlledValue !== "undefined" ? controlledValue : stateValue;

  const inputProps = () => {
    const autocompleteProps = getInputProps();
    // here we merge the mui's `useAutocomplete` props with the react-hook-form's
    // `register` props
    const registerProps = register
      ? register(name, {
          // @ts-expect-error FIXME: can't remember
          ref: autocompleteProps.ref.current,
          // this makes the validation works when a valid `defaultValue`
          // is provided
          value: normaliseAutocompleteValue(value, multiple),
        })
      : {};
    return {
      ...registerProps,
      ...autocompleteProps,
      // onChange: (event: FormEvent<HTMLInputElement>) => {
      //   registerProps.onChange(event);
      //   autocompleteProps?.onChange(event);
      // },
    };
  };

  // to focus the input on error this works too
  // @see https://react-hook-form.com/faqs#question12 but probably it is
  // better to do as now passing the input ref to the register options
  // useEffect(() => {
  //   if (errors[name]) {
  //     inputProps.ref.current.focus();
  //   }
  // }, [errors, name, inputProps.ref]);

  return (
    <AutocompleteRoot>
      {label && (
        <AutocompleteLabel {...getInputLabelProps()}>{label}</AutocompleteLabel>
      )}
      <AutocompleteWrap {...getRootProps()} data-focus={focused}>
        <AutocompleteInner ref={setAnchorEl}>
          {multiple &&
            (value as AutocompleteValue<true>).map(
              (valueItem, index: number) => {
                const { onDelete, key, ...tagProps } = getTagProps({ index });
                return (
                  <AutocompleteItem key={key} {...tagProps}>
                    <AutocompleteItemLabel>
                      {isString(valueItem)
                        ? valueItem
                        : valueItem.Label || valueItem.label}
                    </AutocompleteItemLabel>
                    <AutocompleteItemRemove onClick={onDelete}>
                      &#10005;
                    </AutocompleteItemRemove>
                  </AutocompleteItem>
                );
              }
            )}
          <AutocompleteInput {...inputProps()} placeholder={placeholder} />
        </AutocompleteInner>
        {!!options.length && (
          <AutocompleteInputArrow
            {...getPopupIndicatorProps()}
            isOpen={popupOpen}
          />
        )}
        {loading && <InputProgress />}
      </AutocompleteWrap>
      {groupedOptions.length ? (
        <AutocompleteMenu {...getListboxProps()}>
          {(groupedOptions as TOption[]).map((option, index) => (
            <AutocompleteMenuItem
              key={index}
              {...getOptionProps({ option, index })}
            >
              {isString(option) ? option : option.Label || option.label}
              {/* <CheckIcon fontSize="small" /> */}
            </AutocompleteMenuItem>
          ))}
        </AutocompleteMenu>
      ) : null}
      {/* TODO: make this behave correctly
      {!creatable && groupedOptions.length === 0 && popupOpen && (
        <AutocompleteMenu {...getListboxProps()}>
          <AutocompleteMenuItem disabled>No matches</AutocompleteMenuItem>
        </AutocompleteMenu>
      )} */}
      {children}
    </AutocompleteRoot>
  );
  // });
};

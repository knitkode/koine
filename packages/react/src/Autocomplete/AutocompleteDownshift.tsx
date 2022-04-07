// TODO: remove, just use mui version...
export const Autocomplete = null;

// import {
//   forwardRef,
//   useCallback,
//   useState,
//   ForwardedRef,
//   ReactNode,
//   ComponentPropsWithRef,
//   CSSProperties,
// } from "react";
// import { useCombobox } from "downshift";
// import { SetRequired } from "@koine/utils";
// // import debounce from "lodash.debounce";
// import {
//   AutocompleteRoot,
//   AutocompleteLabel,
//   AutocompleteInputWrap,
//   AutocompleteInput,
//   AutocompleteInputArrow,
//   AutocompleteMenu,
//   AutocompleteMenuItem,
// } from "./components";
// import { defaultOptionsFilterFn, triggerOnChange } from "../Forms/helpers";
// import { InputProgress } from "../Forms/styles";

// export type AutocompleteOption = Option;

// export type AutocompleteValue = null | AutocompleteOption;

// export type AutocompleteProps = SetRequired<
//   Omit<ComponentPropsWithRef<"input">, "onSelect">,
//   "onChange" | "name"
// > & {
//   freeSolo?: boolean;

//   onSelect?: (option?: AutocompleteValue) => any;
//   options?: AutocompleteOption[];
//   loadOptions: (query?: string) => Promise<AutocompleteOption[]>;
//   label?: string | ReactNode;
//   className?: string;
//   style?: CSSProperties;
//   $ref: ForwardedRef<HTMLInputElement>;
// };

// export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
//   function Autocomplete(
//     {
//       freeSolo,
//       onSelect,
//       options = [],
//       label,
//       name,
//       value,
//       onChange,
//       loadOptions,
//       className,
//       style,
//       $ref,
//       ...props
//     },
//     ref
//   ) {
//     const [items, setItems] = useState(options);
//     const [loading, setLoading] = useState(false);

//     const triggerChange = useCallback(
//       (selectedItem?: AutocompleteValue, inputValue?: string) => {
//         const value = freeSolo ? inputValue : selectedItem?.value;

//         triggerOnChange(onChange, name, value || "");
//         if (onSelect) onSelect(selectedItem);
//       },
//       [onChange, onSelect, name, freeSolo]
//     );

//     const handleInputValueChange = useCallback(
//       async ({ inputValue }) => {
//         if (inputValue) {
//           if (loadOptions) {
//             setLoading(true);
//             try {
//               const newOptions = await loadOptions(inputValue);
//               setItems(newOptions);
//             } catch (e) {}
//             setLoading(false);
//           } else {
//             setItems(defaultOptionsFilterFn(options, inputValue));
//           }
//         } else {
//           setItems(options);
//           // clear like behaviour
//           triggerChange({ value: "", label: "" });
//         }
//       },
//       [loadOptions, triggerChange]
//     );

//     const {
//       isOpen,
//       // selectedItem,
//       getToggleButtonProps,
//       getLabelProps,
//       getMenuProps,
//       getInputProps,
//       getComboboxProps,
//       highlightedIndex,
//       getItemProps,
//       openMenu,
//     } = useCombobox<null | AutocompleteOption>({
//       id: `Autocomplete-${name}`,
//       items,
//       // initialInputValue: value,
//       onSelectedItemChange: ({ selectedItem, inputValue }) => {
//         triggerChange(selectedItem, inputValue);
//       },
//       // itemToString: (item) => (item ? item.label || item.value : ""),
//       onInputValueChange: handleInputValueChange,
//     });

//     // const debouncedInputValueChangeHandler = useCallback(
//     //   debounce(handleInputValueChange, 200),
//     //   [handleInputValueChange]
//     // );

//     return (
//       <AutocompleteRoot className={className} style={style}>
//         {label && (
//           <AutocompleteLabel {...getLabelProps()}>{label}</AutocompleteLabel>
//         )}
//         <AutocompleteInputWrap {...getComboboxProps()}>
//           <AutocompleteInput
//             {...getInputProps({
//               onFocus: openMenu,
//               onClick: openMenu,
//               ref: $ref || ref,
//               // itemRef: ref,
//             })}
//             {...props}
//           />
//           {!!items.length && (
//             <AutocompleteInputArrow
//               {...getToggleButtonProps()}
//               aria-label={"toggle menu"}
//             />
//           )}
//           {loading && <InputProgress />}
//         </AutocompleteInputWrap>
//         <AutocompleteMenu {...getMenuProps()}>
//           {isOpen &&
//             items
//               // .filter(item => !inputValue || item.includes(inputValue))
//               .map(
//                 (item, index) =>
//                   item && (
//                     <AutocompleteMenuItem
//                       $active={highlightedIndex === index}
//                       key={`${item.value}${index}`}
//                       {...getItemProps({ item, index })}
//                     >
//                       {item.label}
//                     </AutocompleteMenuItem>
//                   )
//               )}
//         </AutocompleteMenu>
//       </AutocompleteRoot>
//     );
//   }
// );

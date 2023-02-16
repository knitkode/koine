// TODO: remove, just use mui version...
export const Autocomplete = null;

// import {
//   forwardRef,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   ForwardedRef,
//   ReactNode,
//   ComponentPropsWithRef,
//   CSSProperties,
// } from "react";
// import type { SetRequired } from "@koine/utils";
// import {
//   useCombobox,
//   useMultipleSelection,
//   UseMultipleSelectionProps,
//   UseMultipleSelectionStateChange,
//   UseMultipleSelectionReturnValue,
// } from "downshift";
// import { usePopper } from "react-popper"; // imports from downshift demo
// // import { useDeepCompareEffect } from "react-use"; // imports from downshift demo
// import type { Option } from "../types";
// import {
//   normaliseOptions,
//   defaultOptionsFilterFn,
//   triggerOnChange,
// } from "../Forms/helpers";
// import {
//   AutocompleteRoot,
//   AutocompleteLabel,
//   AutocompleteWrap,
//   AutocompleteInner,
//   AutocompleteItem,
//   AutocompleteItemLabel,
//   AutocompleteItemRemove,
//   AutocompleteInputWrap,
//   AutocompleteInput,
//   AutocompleteInputArrow,
//   AutocompleteMenu,
//   AutocompleteMenuItem,
// } from "./components";

// const USE_POPPER = false;

// export type AutocompleteItem = Option;

// export type AutocompleteValue = AutocompleteItem[];

// export type AutocompleteProps = SetRequired<
//   Omit<ComponentPropsWithRef<"input">, "defaultValue" | "onSelect">,
//   "onChange" | "name"
// > & {
//   selectedItems: UseMultipleSelectionReturnValue<AutocompleteItem>["selectedItems"];
//   onSelectedItemsChange: UseMultipleSelectionProps<AutocompleteItem>["onSelectedItemsChange"];
//   onCreateItem: (item?: AutocompleteItem) => any;
//   creatable?: boolean;
//   onSelect?: (value?: AutocompleteValue) => any;
//   options?: AutocompleteItem[];
//   loadOptions?: (query?: string) => Promise<AutocompleteItem[]>;
//   label?: string | ReactNode;
//   defaultValue?: AutocompleteValue | string[];
//   className?: string;
//   style?: CSSProperties;
//   $ref?: ForwardedRef<HTMLInputElement>;
// };

// /**
//  * @see https://www.downshift-js.com/use-multiple-selection
//  * @see https://codesandbox.io/s/y34o5l3p61?file=/src/hooks/useMultipleSelection/combobox.js
//  * @see https://codesandbox.io/s/y34o5l3p61?file=/src/downshift/ordered-examples/05-multi-create.js
//  */
// export const _Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
//   function _Autocomplete(
//     {
//       selectedItems,
//       onSelectedItemsChange,
//       onCreateItem,
//       creatable,
//       onSelect,
//       options = [],
//       label,
//       loadOptions,
//       $ref,
//       className,
//       style,
//       ...props
//     },
//     ref
//   ) {
//     options = normaliseOptions(options);
//     const [isCreating, setIsCreating] = useState(false);
//     const [filteredOptions, setFilteredOptions] = useState(options);
//     const disclosureRef = useRef(null);
//     const popoverRef = useRef(null);
//     const { styles, attributes } = USE_POPPER
//       ? usePopper(disclosureRef.current, popoverRef.current, {
//           placement: "bottom-start",
//         })
//       : { styles: {}, attributes: {} };

//     const {
//       getSelectedItemProps,
//       getDropdownProps,
//       addSelectedItem,
//       removeSelectedItem,
//       // selectedItems,
//       activeIndex,
//     } = useMultipleSelection<AutocompleteItem>({
//       selectedItems,
//       onSelectedItemsChange,
//       // onSelectedItemsChange: ({ selectedItems = [] }) => {
//       //   triggerChange(selectedItems);
//       // },
//       // initialSelectedItems: normaliseOptions(defaultValue),
//       stateReducer: (_, actionAndChanges) => {
//         const { type, changes } = actionAndChanges;
//         switch (type) {
//           case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
//             return {
//               ...changes,
//               activeIndex: undefined,
//             };
//           default:
//             return changes;
//         }
//       },
//     });
//     const selectedItemsValues = selectedItems.map((item) => item.value);

//     const {
//       isOpen,
//       getToggleButtonProps,
//       getLabelProps,
//       getMenuProps,
//       getInputProps,
//       getComboboxProps,
//       highlightedIndex,
//       getItemProps,
//       openMenu,
//       selectItem,
//       setHighlightedIndex,
//       inputValue,
//     } = useCombobox<null | AutocompleteItem>({
//       selectedItem: null,
//       items: filteredOptions,
//       onInputValueChange: ({ inputValue }) => {
//         // perhaps allows the optionsFilterFn as prop
//         const filteredItems = defaultOptionsFilterFn(options, inputValue);

//         if (creatable && isCreating && filteredItems.length > 0) {
//           setIsCreating(false);
//         }

//         setFilteredOptions(filteredItems);
//       },
//       stateReducer: (state, actionAndChanges) => {
//         const { changes, type } = actionAndChanges;
//         switch (type) {
//           case useCombobox.stateChangeTypes.InputBlur:
//             return {
//               ...changes,
//               highlightedIndex: state.highlightedIndex,
//               // clear input on blur to avoid have "pending" uncompleted behaviours
//               inputValue: "",
//             };
//           case useCombobox.stateChangeTypes.InputKeyDownEnter:
//           case useCombobox.stateChangeTypes.ItemClick:
//             return {
//               ...changes,
//               highlightedIndex: state.highlightedIndex,
//               isOpen: true,
//               inputValue: "",
//             };
//           default:
//             return changes;
//         }
//       },
//       onStateChange: ({ type, selectedItem }) => {
//         switch (type) {
//           case useCombobox.stateChangeTypes.InputKeyDownEnter:
//           case useCombobox.stateChangeTypes.ItemClick:
//             if (selectedItem) {
//               if (selectedItemsValues.includes(selectedItem.value)) {
//                 removeSelectedItem(selectedItem);
//               } else {
//                 if (creatable && onCreateItem) {
//                   onCreateItem(selectedItem);
//                 }
//                 addSelectedItem(selectedItem);

//                 if (isCreating) {
//                   setIsCreating(false);
//                   setFilteredOptions(options);
//                 }
//               }

//               selectItem(null);
//             }
//             break;
//           default:
//             break;
//         }
//       },
//     });

//     useEffect(() => {
//       if (
//         creatable &&
//         filteredOptions.length === 0 &&
//         activeIndex === -1 &&
//         inputValue.length > 0
//       ) {
//         setIsCreating(true);
//         setFilteredOptions(normaliseOptions([inputValue]));
//         setHighlightedIndex(0);
//       }
//     }, [
//       creatable,
//       filteredOptions,
//       setIsCreating,
//       setHighlightedIndex,
//       inputValue,
//       activeIndex,
//     ]);

//     // useEffect(() => {
//     //   setSelectedItems(normaliseOptions(defaultValue));
//     // }, [defaultValue]);

//     // useDeepCompareEffect(() => {
//     //   setFilteredOptions(options);
//     // }, [options]);

//     // useDeepCompareEffect(() => {
//     //   triggerChange(values);
//     // }, [values]);

//     return (
//       <AutocompleteRoot>
//         {label && (
//           <AutocompleteLabel {...getLabelProps()}>{label}</AutocompleteLabel>
//         )}
//         <AutocompleteWrap
//           {...getComboboxProps({
//             ref: disclosureRef,
//           })}
//         >
//           <AutocompleteInner>
//             {selectedItems.map((selectedItem, index) => (
//               <AutocompleteItem
//                 key={`selected-item-${index}`}
//                 {...getSelectedItemProps({ selectedItem, index })}
//               >
//                 <AutocompleteItemLabel>
//                   {selectedItem?.label || selectedItem}
//                 </AutocompleteItemLabel>
//                 <AutocompleteItemRemove
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     removeSelectedItem(selectedItem);
//                   }}
//                 >
//                   &#10005;
//                 </AutocompleteItemRemove>
//               </AutocompleteItem>
//             ))}
//             <AutocompleteInputWrap>
//               <AutocompleteInput
//                 {...getInputProps({
//                   ...getDropdownProps({
//                     // this option used in the official example prevents the
//                     // backspace key to behave correctly
//                     // preventKeyAction: isOpen,
//                     onClick: isOpen ? () => {} : openMenu,
//                     onFocus: isOpen ? () => {} : openMenu,
//                     ref: $ref || ref,
//                     // ref: disclosureRef,
//                   }),
//                   // ref: $ref || ref,
//                 })}
//                 {...props}
//               />
//             </AutocompleteInputWrap>
//           </AutocompleteInner>
//           {!!filteredOptions.length && (
//             <AutocompleteInputArrow
//               {...getToggleButtonProps()}
//               aria-label={"toggle menu"}
//               isOpen={isOpen}
//             />
//           )}
//         </AutocompleteWrap>
//         <AutocompleteMenu
//           style={styles.popper}
//           {...attributes.popper}
//           {...getMenuProps({ ref: popoverRef })}
//         >
//           {isOpen &&
//             filteredOptions.map((item, index) => (
//               <AutocompleteMenuItem
//                 $active={highlightedIndex === index}
//                 key={`${item.value}${index}`}
//                 {...getItemProps({ item, index })}
//               >
//                 {isCreating ? (
//                   <>
//                     <span>+</span> <strong>{item.label}</strong>
//                   </>
//                 ) : (
//                   <>
//                     {/* {selectedItemsValues.includes(item.value) && (
//                       <CheckboxToggle />
//                     )} */}
//                     {item.label}
//                   </>
//                 )}
//               </AutocompleteMenuItem>
//             ))}
//         </AutocompleteMenu>
//       </AutocompleteRoot>
//     );
//   }
// );

// /**
//  * @see https://www.downshift-js.com/use-multiple-selection
//  * @see https://codesandbox.io/s/y34o5l3p61?file=/src/hooks/useMultipleSelection/combobox.js
//  * @see https://codesandbox.io/s/y34o5l3p61?file=/src/downshift/ordered-examples/05-multi-create.js
//  */
// export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
//   function Autocomplete(
//     { defaultValue = [], onChange, onSelect, name, ...props },
//     ref
//   ) {
//     const [selectedItems, setSelectedItems] = useState(
//       normaliseOptions(defaultValue)
//     );

//     const triggerChange = useCallback(
//       (values: AutocompleteValue) => {
//         triggerOnChange(
//           onChange,
//           name,
//           values.map((item) => item.value || item)
//         );
//         if (onSelect) onSelect(values);
//       },
//       [onChange, onSelect, name]
//     );

//     const handleCreateItem = (item?: AutocompleteItem) => {
//       // setSelectedItems((curr) => [...curr, item]);
//     };

//     const handleSelectedItemsChange = ({
//       selectedItems = [],
//     }: UseMultipleSelectionStateChange<AutocompleteItem>) => {
//       setSelectedItems(selectedItems);
//       triggerChange(selectedItems);
//     };

//     return (
//       <_Autocomplete
//         {...props}
//         selectedItems={selectedItems}
//         onSelectedItemsChange={handleSelectedItemsChange}
//         onCreateItem={handleCreateItem}
//         $ref={ref}
//       />
//     );
//   }
// );

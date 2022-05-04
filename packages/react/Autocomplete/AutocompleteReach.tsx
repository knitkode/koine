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
//   ChangeEventHandler,
// } from "react";
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxPopover,
//   ComboboxList,
//   ComboboxOption,
//   ComboboxOptionText,
// } from "@reach/combobox";
// import {
//   AutocompleteRoot,
//   AutocompleteInput,
//   AutocompleteLabel,
// } from "./components.js";
// import type { Option } from "../types.js";

// import { SetRequired } from "@koine/utils";

// export type AutocompleteOption =
//   | null
//   | (Option & {
//       key: string;
//     });

// export type AutocompleteProps = SetRequired<
//   ComponentPropsWithRef<"input">,
//   "onChange" | "name"
// > & {
//   onSelect?: (option?: AutocompleteOption) => any;
//   options: AutocompleteOption[];
//   loadOptions: (query?: string) => Promise<AutocompleteOption[]>;
//   label?: string | ReactNode;
//   className?: string;
//   style?: CSSProperties;

//   $ref: ForwardedRef<HTMLInputElement>;
// };

// export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
//   function Autocomplete(
//     {
//       options = [],
//       label,
//       name,
//       value,
//       onChange,
//       loadOptions,
//       $ref,
//       className,
//       style,
//       ...props
//     },
//     ref
//   ) {
//     const [items, setItems] = useState(options);
//     const [loading, setLoading] = useState(false);

//     const handleInputValueChange: ChangeEventHandler<HTMLInputElement> =
//       useCallback(
//         async (event) => {
//           const inputValue = event.target.value;

//           if (loadOptions) {
//             setLoading(true);
//             try {
//               const newOptions = await loadOptions(inputValue);
//               setItems(newOptions);
//             } catch (e) {}
//             setLoading(false);
//           }
//         },
//         [loadOptions]
//       );

//     return (
//       <AutocompleteRoot>
//         {label && <AutocompleteLabel>{label}</AutocompleteLabel>}
//         <Combobox aria-label="choose a fruit" openOnFocus={true}>
//           <AutocompleteInput
//             forwardedAs={ComboboxInput}
//             ref={$ref}
//             onChange={handleInputValueChange}
//             selectOnClick={true}
//             autocomplete={false}
//           />
//           {(!!items.length || loading) && (
//             <ComboboxPopover>
//               <ComboboxList persistSelection>
//                 {items
//                   // .filter(item => !inputValue || item.includes(inputValue))
//                   .map(
//                     (item, index) =>
//                       item && (
//                         <ComboboxOption
//                           key={`${item.value}${index}`}
//                           value={item.label}
//                         >
//                           <ComboboxOptionText />
//                         </ComboboxOption>
//                       )
//                   )}
//               </ComboboxList>
//             </ComboboxPopover>
//           )}
//         </Combobox>
//       </AutocompleteRoot>
//     );
//   }
// );

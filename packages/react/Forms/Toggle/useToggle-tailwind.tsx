// import React, { useCallback, useId, useMemo } from "react";
// import type { Option } from "@koine/react";
// import type { FormControlElementProps } from "../FormControl";

// export type UseToggleProps = FormControlElementProps<React.FC> & {
//   // defaultChecked?: boolean;
//   value?: boolean;
//   valueTrue?: string;
//   valueFalse?: string;
//   options?: Option[];
// };

// /**
//  * This hook is meant to power Checkboxes, Switches and checkbox-like Radios
//  * components, it works in fact in two modes:
//  *
//  * 1: behaviour as standard checkbox
//  * yup validation would simply look like:
//  *
//  * ```ts
//  * privacy:  boolean().required(),
//  * ```
//  *
//  * 1b: to make the checkbox required (either with `true` or `false`):
//  * ```
//  * privacy: boolean().oneOf([true]).required()
//  * ```
//  *
//  * 2: beahviour as two radio for checkbox with custom true/false values as
//  * strings yup validation would look like:
//  *
//  * ```ts
//  * newsletter: string().oneOf(["yes", "no"]).required(),
//  * // add `.nullable()` if you do not provide a string `defaultValue`
//  *
//  * // to do not make it required and avoid triggering an error when the input is
//  * // untouched you need to set the default value of the input in the form
//  * // initialization's `defaultValues` as such:
//  *
//  * useForm({ defaultValues: { newsletter: "no" }})
//  * ```
//  *
//  * To enable this mode either pass the props `valueTrue` and `valueFalse` or
//  * an array of options with the shape of `Option`
//  */
// export function useToggle(
//   props: UseToggleProps,
//   ref: React.ForwardedRef<HTMLInputElement>
// ) {
//   const {
//     actions,
//     form: { watch, register },
//     name,
//     state,
//     strings: { label },
//     options,
//     value: propValue,
//     ...restProps
//   } = props;
//   let {
//     valueTrue,
//     valueFalse,
//     // defaultChecked,
//     // defaultValue,
//     // eslint-disable-next-line prefer-const
//     // ...remainingInputProps
//   } = restProps;
//   // use options data convention to pass on the true/false values
//   if (options) {
//     valueTrue = options
//       .filter((opt) => opt.value === "true")[0]
//       .label.toString();
//     valueFalse = options
//       .filter((opt) => opt.value === "false")[0]
//       .label.toString();
//   }
//   const id = useId();
//   const idTrue = `${id}-true`;
//   const idFalse = `${id}-false`;
//   const isRadio = !!(valueTrue && valueFalse);

//   // // manage default values for both toggle modes
//   // defaultChecked = isUndefined(defaultChecked) ? false : defaultChecked;
//   // // TODO: maybe throw an error if the defaultValue that arrives here is not
//   // // a valid value
//   // defaultValue =
//   //   defaultValue === valueTrue || defaultValue === valueFalse
//   //     ? defaultValue
//   //     : valueFalse;

//   // get the value either from the uncontrolled watched input or from the given
//   // prop to control the component
//   let value = watch(name);
//   if (propValue) {
//     value = propValue;
//   }

//   /**
//    * Accessibility.
//    *
//    * Fake the spacebar keyboard behaviour on the radio mode of the checkbox.
//    * Without this *only* the arrow keys would change the checkbox state
//    */
//   const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> =
//     useCallback(
//       (event) => {
//         if (event.key === " ") {
//           event.preventDefault();
//           event.stopPropagation();

//           const firstInput = event.target as HTMLInputElement;
//           const next = firstInput.nextElementSibling as HTMLInputElement;
//           const prev = firstInput.previousElementSibling as HTMLInputElement;
//           const secondInput = next?.tagName === "INPUT" ? next : prev;
//           let target = firstInput;

//           if (firstInput.checked) {
//             target = secondInput;
//           } else {
//             if (!secondInput.checked) {
//               target =
//                 firstInput.value === valueTrue ? firstInput : secondInput;
//             }
//           }

//           if (target) target.click();
//         }
//       },
//       [valueTrue]
//     );

//   // collect all the return values that are dependent on the current value
//   // of the input
//   const valueDependentProps = useMemo(
//     () => ({
//       rootProps: {
//         htmlFor: isRadio
//           ? !value || value === valueFalse
//             ? idTrue
//             : idFalse
//           : id,
//       },
//       label: label ? label : value,
//       value,
//     }),
//     [value, valueFalse, isRadio, id, idTrue, idFalse, label]
//   );

//   const Inputs = useMemo(
//     () =>
//       isRadio ? (
//         <>
//           <input
//             className="peer sr-only"
//             id={idFalse}
//             {...register(name, {
//               onBlur: () => actions.setFocused(false),
//             })}
//             onFocus={() => actions.setFocused(true)}
//             // {...remainingInputProps}
//             onKeyDown={handleKeyDown}
//             type="radio"
//             value={valueFalse}
//             // defaultChecked={defaultValue === valueFalse}
//           />
//           <input
//             className="peer sr-only"
//             id={idTrue}
//             {...register(name, {
//               onBlur: () => actions.setFocused(false),
//             })}
//             onFocus={() => actions.setFocused(true)}
//             // {...remainingInputProps}
//             onKeyDown={handleKeyDown}
//             type="radio"
//             value={valueTrue}
//             // defaultChecked={defaultValue === valueTrue}
//           />
//         </>
//       ) : (
//         <input
//           className="peer sr-only"
//           id={id}
//           type="checkbox"
//           {...register(name, { onBlur: () => actions.setFocused(false) })}
//           onFocus={() => actions.setFocused(true)}
//           // {...remainingInputProps}
//           // defaultChecked={defaultChecked}
//         />
//       ),
//     [
//       name,
//       actions,
//       // remainingInputProps,
//       handleKeyDown,
//       isRadio,
//       idFalse,
//       idTrue,
//       valueFalse,
//       valueTrue,
//       id,
//       // defaultChecked,
//       // defaultValue,
//     ]
//   );

//   // console.log("useToggle: render", value);

//   return {
//     ...valueDependentProps,
//     Inputs,
//   };
// }

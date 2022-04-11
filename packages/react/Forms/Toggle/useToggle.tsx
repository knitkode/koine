import { useCallback, useMemo } from "react";
import { useWatch } from "react-hook-form";
import type { Option } from "../../types";
import { InputInvisible } from "../styles";
import { FormControl } from "../helpers";

export type UseToggleProps = Omit<FormControl, "value"> & {
  // defaultChecked?: boolean;
  value?: boolean;
  valueTrue?: string;
  valueFalse?: string;
  options?: Option[];
};

/**
 * This hook is meant to powere Checkboxes, Switches and checkbox-like Radios
 * components, it works in fact in two modes:
 *
 * 1: behaviour as standard checkbox
 * yup validation would simply look like:
 *
 * ```ts
 * privacy:  boolean().required(),
 * // add `.nullable()` if you do not provide a boolean `defaultValue`
 * ```
 *
 * 2: beahviour as two radio for checkbox with custom true/false values as
 * strings yup validation would look like:
 *
 * ```ts
 * newsletter: string().oneOf(["yes", "no"]).required(),
 * // add `.nullable()` if you do not provide a string `defaultValue`
 *
 * // to do not make it required and avoid triggering an error when the input is
 * // untouched you need to set the default value of the input in the form
 * // initialization's `defaultValues` as such:
 *
 * useForm({ defaultValues: { newsletter: "no" }})
 * ```
 *
 * To enable this mode either pass the props `valueTrue` and `valueFalse` or
 * an array of options with the shape of `Option`
 */
export function useToggle(
  props: UseToggleProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const {
    name,
    control,
    register,
    label,
    options,
    value: propValue,
    ...restProps
  } = props;
  let {
    id,
    valueTrue,
    valueFalse,
    // defaultChecked,
    // defaultValue,
    // eslint-disable-next-line prefer-const
    ...remainingInputProps
  } = restProps;
  // use options data convention to pass on the true/false values
  if (options) {
    valueTrue = options
      .filter((opt) => opt.value === "true")[0]
      .label.toString();
    valueFalse = options
      .filter((opt) => opt.value === "false")[0]
      .label.toString();
  }
  id = `switch-${name}`;
  const idTrue = `${id}-true`;
  const idFalse = `${id}-false`;
  const isRadio = !!(valueTrue && valueFalse);

  // // manage default values for both toggle modes
  // defaultChecked = isUndefined(defaultChecked) ? false : defaultChecked;
  // // TODO: maybe throw an error if the defaultValue that arrives here is not
  // // a valid value
  // defaultValue =
  //   defaultValue === valueTrue || defaultValue === valueFalse
  //     ? defaultValue
  //     : valueFalse;

  // get the value either from the uncontrolled watched input or from the given
  // prop to control the component
  let value = useWatch({
    name,
    control,
    // defaultValue: isRadio ? defaultValue : defaultChecked,
  });
  if (propValue) {
    value = propValue;
  }

  // get the input props needed by react-hook-form, first check if we have
  // a `register` function, then check if we have a `control` object or just
  // rely on the `name` prop and `ref`, they probably would be passed alongside
  // an `onChange` prop that is spreaded on the inputs
  const inputProps = useMemo(() => {
    return register
      ? register(name)
      : control
      ? control.register(name)
      : {
          name,
          ref,
        };
  }, [register, control, name, ref]);

  /**
   * Accessibility.
   *
   * Fake the spacebar keyboard behaviour on the radio mode of the checkbox.
   * Without this *only* the arrow keys would change the checkbox state
   */
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.stopPropagation();

          const firstInput = event.target as HTMLInputElement;
          const next = firstInput.nextElementSibling as HTMLInputElement;
          const prev = firstInput.previousElementSibling as HTMLInputElement;
          const secondInput = next?.tagName === "INPUT" ? next : prev;
          let target = firstInput;

          if (firstInput.checked) {
            target = secondInput;
          } else {
            if (!secondInput.checked) {
              target =
                firstInput.value === valueTrue ? firstInput : secondInput;
            }
          }

          if (target) target.click();
        }
      },
      [valueTrue]
    );

  // collect all the return values that are dependent on the current value
  // of the input
  const valueDependentProps = useMemo(
    () => ({
      rootProps: {
        htmlFor: isRadio
          ? !value || value === valueFalse
            ? idTrue
            : idFalse
          : id,
      },
      label: label ? label : value,
      value,
    }),
    [value, valueFalse, isRadio, id, idTrue, idFalse, label]
  );

  const Inputs = useMemo(
    () =>
      isRadio ? (
        <>
          <InputInvisible
            id={idFalse}
            {...inputProps}
            {...remainingInputProps}
            onKeyDown={handleKeyDown}
            type="radio"
            value={valueFalse}
            // defaultChecked={defaultValue === valueFalse}
          />
          <InputInvisible
            id={idTrue}
            {...inputProps}
            {...remainingInputProps}
            onKeyDown={handleKeyDown}
            type="radio"
            value={valueTrue}
            // defaultChecked={defaultValue === valueTrue}
          />
        </>
      ) : (
        <InputInvisible
          id={id}
          type="checkbox"
          {...inputProps}
          {...remainingInputProps}
          // defaultChecked={defaultChecked}
        />
      ),
    [
      inputProps,
      remainingInputProps,
      handleKeyDown,
      isRadio,
      idFalse,
      idTrue,
      valueFalse,
      valueTrue,
      id,
      // defaultChecked,
      // defaultValue,
    ]
  );

  // console.log("useToggle: render", value);

  return {
    ...valueDependentProps,
    Inputs,
  };
}

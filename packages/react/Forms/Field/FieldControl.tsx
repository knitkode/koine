import { useMemo } from "react";
import { useFormState } from "react-hook-form";
import { decode } from "@koine/utils";
import type { Translate } from "../../types";
import type { FormControl } from "../helpers";
import { Field } from "./Field";
import { FieldHint } from "./FieldHint";
import { InputHoneypot } from "../styles";

type FieldControlRenderProps = Pick<
  FormControl,
  "control" | "register" | "setValue" | "name" | "label" | "placeholder"
>;

export type FieldControlProps = FieldControlRenderProps & {
  /** Render props pattern */
  children: (props: FieldControlRenderProps) => React.ReactNode;
  t: Translate;
  showError?: boolean;
  encode?: boolean;
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 *
 * - it expects the `field` object from our `useForm` wrapper around react-hook-form
 * - automatically get translated strings from the given `t` function` for the
 * field `label`, `placeholder` and `errors`. The .json expected by the `t` function
 * look like this:
 *
 * ```json
 * ```
 */
export const FieldControl = ({
  control,
  register,
  setValue,
  name: maybeEncodedName,
  label,
  placeholder,
  hint,
  t,
  showError = true,
  children,
  encode,
  ...props
}: FieldControlProps) => {
  const name = encode ? decode(maybeEncodedName) : maybeEncodedName;
  const { errors } = useFormState({ name, control });
  const error = showError && errors[name] ? errors[name] : null;

  const FormFieldContent = useMemo(
    () =>
      children({
        control,
        register,
        setValue,
        name: maybeEncodedName,
        // @see https://github.com/vinissimus/next-translate/pull/461
        // @see https://github.com/vinissimus/next-translate/issues/429
        label: label || t(`labels.${name}`, undefined, { default: "" }),
        placeholder:
          placeholder || t(`placeholders.${name}`, undefined, { fallback: "" }),
      }),
    [
      children,
      control,
      register,
      setValue,
      name,
      label,
      t,
      maybeEncodedName,
      placeholder,
    ]
  );

  return (
    <>
      <Field name={maybeEncodedName} t={t} error={error} {...props}>
        {FormFieldContent}
        {hint && <FieldHint>{hint}</FieldHint>}
      </Field>
      {encode && register && <InputHoneypot {...register(name)} />}
    </>
  );
};

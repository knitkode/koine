import type {
  FieldError as RHF_FieldError,
  FieldErrors as RHF_FieldErrors,
} from "react-hook-form";
import styled, { css } from "styled-components";
import type { Translate } from "../../types";
import { Feedback } from "../Feedback";

export const field = css`
  padding-bottom: 20px;
`;

export const FieldBase = styled.div`
  ${field}
`;

export const FieldRoot = styled(FieldBase)<{ $danger: boolean }>`
  ${(p) => {
    return (
      p.$danger &&
      `
    color: var(--danger);
    
    textarea,
    input,
    select {
      color: var(--danger);
    }
  `
    );
  }}
`;

/**
 * Yup's errors produce by these validations:
 *
 * ```
 * email: string().email().required(),
 * name: string().required()
 * ```
 *
 * determine the `error.type` of the `FieldError` to be "required" and "email".
 * We assume these as standard translations keys without needing to pass
 * a string into the validation, e.g. `required("mySpecialKey")`.
 */
type FieldErrorType = "required" | "email" | "plain" | string;

export type FieldError = {
  /**
   * use `type: "plain"` when the error message should not act as a translation
   * key, that is often the case with server side error messages from external
   * APIs.
   */
  type: FieldErrorType;
  message: string;
};

export type FieldProps = React.ComponentPropsWithoutRef<"div"> & {
  name?: string;
  t?: Translate;
  error?: null | RHF_FieldError;
  errors?: RHF_FieldErrors;
};

export const Field = ({
  name,
  t,
  error,
  errors,
  children,
  ...props
}: FieldProps) => {
  const err = (errors && name ? errors[name] : error) as FieldError;

  let msg = "";

  if (err) {
    if (name && t && err.type !== "plain") {
      msg = t(`errors.${name}.${err.type || err.message}`);
    } else {
      msg = err.message;
    }
  }

  // dynamic i18n namespace loading does not seem to work yet
  // const t = useT("core.Forms");
  // const { locale } = useRouter();
  // useEffect(() => {
  //   i18n.addResourceBundle(locale, "core.Forms", null);
  // }, []);

  return (
    <FieldRoot $danger={!!err} {...props}>
      {children}
      {msg && <Feedback $danger>{msg}</Feedback>}
    </FieldRoot>
  );
};

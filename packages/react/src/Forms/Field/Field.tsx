import type { FC, CSSProperties } from "react";
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
const YUP_ERROR_TYPES_AS_KEYS = {
  required: 1,
  email: 1,
} as const;

type FieldError = {
  /**
   * use `type: "plain"` when the error message should not act as a translation
   * key, that is often the case with server side error messages from external
   * APIs.
   */
  type?: keyof typeof YUP_ERROR_TYPES_AS_KEYS | "plain";
  message: string;
};

export type FieldProps = {
  name?: string;
  t?: Translate;
  error?: RHF_FieldError;
  errors?: RHF_FieldErrors;
  style?: CSSProperties;
};

export const Field: FC<FieldProps> = ({
  name,
  t,
  error,
  errors,
  children,
  ...props
}) => {
  const err: FieldError = errors && name ? errors[name] : error;

  let msg = "";

  if (err) {
    if (name && t && err.type !== "plain") {
      const translationKey =
        err.type && YUP_ERROR_TYPES_AS_KEYS[err.type] ? err.type : "";
      msg = t(`errors.${name}.${translationKey || err.message}`);
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

import styled from "styled-components";
import { stateFocus } from "../styles/styled.js";
import { ProgressLinear } from "../Progress/ProgressLinear.js";
import { invisible } from "../styles/styled.js";

export const InputInvisible = styled.input`
  ${invisible}
`;

export const InputHoneypot = styled(InputInvisible).attrs({
  type: "text",
  autoComplete: "new-password",
  tabIndex: -1,
})``;

export const InputProgress = styled((p: any) => (
  <ProgressLinear fg="var(--accent300)" bg="var(--accent400)" {...p} />
))`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

/**
 * Remove the default light blue background on autofilled inputs. To be used as
 * a function that outputs a CSS string.
 *
 * @see https://stackoverflow.com/a/62624824/1938970
 */
export const inputResetAutofill = `
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-background-clip: text;
  }
`;

/* FIXME: find a nice way to override this styling from implementation */
// border-bottom: 1px solid var(--forms-border-color);
// border: 0;
export const inputBorder = `
  border: 1px solid var(--forms-border-color);
`;

export const inputPadding = `
  padding: var(--forms-gutter-y) var(--forms-gutter-x);
`;

export const inputReset = `
  width: 100%;
  min-height: 44px;
  ${inputBorder}
  ${inputPadding}
`;

export const inputBase = `
  ${inputReset}
  ${inputResetAutofill}
  background: transparent;
`;

export const inputFocus = `
  &:focus {
    outline: 0px;
    appearance: none;
    ${stateFocus}
  }
`;

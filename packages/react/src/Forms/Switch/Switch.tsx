import { forwardRef } from "react";
import styled from "styled-components";
import { CheckboxRoot, CheckboxLabel } from "../Checkbox";
import { toggleBase } from "../Toggle";
import { useToggle, UseToggleProps } from "../Toggle/useToggle";
import { stateFocus } from "../../styles/styled";

const SWITCH_GUTTER = 0.25;
const SWITCH_HANDLE_SIZE = 1;

export const SwitchTrack = styled.span`
  position: relative;
  width: ${SWITCH_HANDLE_SIZE * 3}em;
  height: ${SWITCH_HANDLE_SIZE * 1.5}em;
  padding: ${SWITCH_GUTTER}em;
  border-radius: ${SWITCH_HANDLE_SIZE}em;
  ${toggleBase}

  input:focus ~ & {
    ${stateFocus}
  }

  input:disabled ~ & {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SwitchHandle = styled.span`
  position: absolute;
  width: ${SWITCH_HANDLE_SIZE}em;
  height: ${SWITCH_HANDLE_SIZE}em;
  left: ${SWITCH_GUTTER}em;
  margin-top: -1px;
  /* border: 1px solid currentColor; */
  background: currentColor;
  opacity: 0.5;
  border-radius: 100%;
  transition: all 0.18s ease-in-out;

  input:checked + ${SwitchTrack} & {
    opacity: 1;
    left: calc(100% - ${SWITCH_HANDLE_SIZE}em - ${SWITCH_GUTTER}em);
  }
`;

export type SwitchProps = UseToggleProps;

/**
 * All logic and invisible Inputs come from the `useToggle` hook
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  props,
  ref
) {
  const { rootProps, Inputs, label } = useToggle(props, ref);
  return (
    <CheckboxRoot {...rootProps}>
      {Inputs}
      <SwitchTrack>
        <SwitchHandle />
      </SwitchTrack>
      {label && <CheckboxLabel>{label}</CheckboxLabel>}
    </CheckboxRoot>
  );
});

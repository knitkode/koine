import { forwardRef } from "react";
import styled from "styled-components";
import { Toggle, ToggleLabel, ToggleIndicatorSquared } from "../Toggle";
import { useToggle, UseToggleProps } from "../Toggle/useToggle";

export const CheckboxRoot = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const CheckboxToggle = styled(Toggle)`
  pointer-events: none;
`;

export const CheckboxIndicator = styled(ToggleIndicatorSquared)``;

export const CheckboxLabel = styled(ToggleLabel)`
  font-size: 0.8em;
`;

export type CheckboxProps = UseToggleProps;

/**
 * All logic and invisible Inputs come from the `useToggle` hook
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { rootProps, Inputs, label } = useToggle(props, ref);

    return (
      <CheckboxRoot {...rootProps}>
        <CheckboxToggle>
          {Inputs}
          <CheckboxIndicator />
        </CheckboxToggle>
        {label && <CheckboxLabel>{label}</CheckboxLabel>}
      </CheckboxRoot>
    );
  }
);

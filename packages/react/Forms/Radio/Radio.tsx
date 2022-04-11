import { forwardRef } from "react";
import styled from "styled-components";
import type { Option } from "../../types";
import { label } from "../Label/Label";
import { Toggle, ToggleLabel, ToggleIndicatorSquared } from "../Toggle";
import { InputInvisible } from "../styles";
import { FormControl } from "../helpers";

const RadioRoot = styled.div``;

const RadioLabel = styled.div`
  ${label}
`;

const RadioOptionRoot = styled.label`
  display: flex;
  align-items: center;
  padding: 0.05em;
  cursor: pointer;
`;

const RadioToggle = styled(Toggle)``;

const RadioIndicator = styled(ToggleIndicatorSquared)``;

const RadioOptionLabel = styled(ToggleLabel)``;

type RadioOptionProps = Omit<FormControl, "value"> &
  Option & {
    $ref: React.ForwardedRef<HTMLInputElement>;
  };

const RadioOption = forwardRef<HTMLInputElement, RadioOptionProps>(
  function RadioOption({ register, name, label, $ref, ...props }, ref) {
    const inputProps = register ? register(name) : { name, ref: $ref || ref };
    return (
      <RadioOptionRoot>
        <RadioToggle>
          <InputInvisible type="radio" {...inputProps} {...props} />
          <RadioIndicator />
        </RadioToggle>
        <RadioOptionLabel>{label}</RadioOptionLabel>
      </RadioOptionRoot>
    );
  }
);

export type RadioProps = Omit<FormControl, "value"> & {
  value?: string;
  options?: Pick<RadioOptionProps, "label" | "value">[];
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, options, ...props },
  ref
) {
  if (!options) return null;

  return (
    <RadioRoot>
      {label && <RadioLabel>{label}</RadioLabel>}
      {options.map((option, idx) => (
        <RadioOption key={idx} {...option} {...props} $ref={ref} />
      ))}
    </RadioRoot>
  );
});

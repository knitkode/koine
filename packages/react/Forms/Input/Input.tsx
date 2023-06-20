import { forwardRef } from "react";
import styled from "styled-components";
import { Label } from "../Label/Label";
import type { FormControl } from "../helpers";
import { inputBase, inputFocus } from "../styles";

export const InputWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InputMain = styled.div`
  flex: 1;
`;

export const InputPre = styled.div``;

export const InputPost = styled.div``;

export const InputNative = styled.input`
  ${inputBase}
  ${inputFocus}
`;

export type InputProps = FormControl;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { register, name, label, ...props },
  ref
) {
  // console.log("Input: render");
  return (
    <>
      {label && <Label>{label}</Label>}
      <InputNative
        {...(register ? register(name) : { name, ref })}
        {...props}
      />
    </>
  );
});

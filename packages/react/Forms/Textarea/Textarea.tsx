import { forwardRef } from "react";
import styled from "styled-components";
import { Label } from "../Label/Label";
// import TextareaAutosize from "@mui/base/TextareaAutosize";
import { FormControl } from "../helpers";
import { inputBase, inputFocus } from "../styles";

export const TextareaNative = styled.textarea`
  ${inputBase}
  ${inputFocus}
  resize: vertical;
`;

export type TextareaProps = FormControl<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ register, name, label, ...props }, ref) {
    return (
      <>
        {label && <Label>{label}</Label>}
        <TextareaNative
          {...(register ? register(name) : { name, ref })}
          {...props}
        ></TextareaNative>
      </>
    );
  }
);

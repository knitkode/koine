import { forwardRef } from "react";
import styled from "styled-components";
// import TextareaAutosize from "@mui/base/TextareaAutosize/index.js";
import { FormControl } from "../helpers.js";
import { Label } from "../Label/Label.js";
import { inputBase, inputFocus } from "../styles.js";

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

import { forwardRef } from "react";
import styled from "styled-components";
// import TextareaAutosize from "@mui/base/TextareaAutosize/index.js";
import { Label } from "../Label/Label.js";
import { Editor } from "../../Editor/index.js";
import { FormControl, triggerOnChange } from "../helpers.js";

const Root = styled.div`
  .ProseMirror {
    max-height: 160px;
    overflow: auto;
  }
  .EditorContent {
    position: relative;
    &:after {
      position: absolute;
      content: "";
      bottom: 0;
      left: 0;
      right: 16px; /* scrollbar width? */
      height: 3em;
      background: linear-gradient(0deg, white, white 33%, transparent);
      pointer-events: none;
    }
  }
`;

export type TextareaRichProps = FormControl<"textarea"> & {
  defaultValue?: string;
};

export const TextareaRich = forwardRef<HTMLTextAreaElement, TextareaRichProps>(
  function TextareaRich(
    { register, setValue, name, label, defaultValue = "", onChange, ...props },
    ref
  ) {
    if (register) register(name);

    return (
      <Root>
        {label && <Label>{label}</Label>}
        <Editor
          options={{
            // element: <TextareaAutosize />,
            content: defaultValue,
            onUpdate:
              (onChange || setValue) && name
                ? ({ editor }) => {
                    const value = editor.getHTML();
                    if (setValue) setValue(name, value);
                    triggerOnChange<HTMLTextAreaElement>(onChange, name, value);
                  }
                : undefined,
          }}
          // {...register(name)}
          {...props}
        />
      </Root>
    );
  }
);

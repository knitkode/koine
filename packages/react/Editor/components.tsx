import styled, { createGlobalStyle } from "styled-components";
import { IconButton } from "../Buttons/IconButton.js";
import { inputPadding, inputBorder, inputFocus } from "../Forms/styles.js";

export {
  MdFormatBold as EditorIconBold,
  MdFormatItalic as EditorIconItalic,
} from "react-icons/md/index.js";

export const EditorRoot = styled.div`
  ${inputBorder}
  ${inputFocus}
`;

export const EditorBarRoot = styled.div`
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  /* background: var(--grey900); */
`;

export const EditorBarBtn = styled(IconButton)``;

export const EditorGlobalStyles = createGlobalStyle`
  .ProseMirror {
    ${inputPadding}
    
    &:focus {
      outline:none;
    }

    > *:first-child {
      margin-top: 0;
    }
  }
`;

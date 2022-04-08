import { useCallback } from "react";
import type { Editor as EditorType, EditorOptions } from "@tiptap/react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  EditorGlobalStyles,
  EditorRoot,
  EditorBarRoot,
  EditorBarBtn,
  EditorIconBold,
  EditorIconItalic,
} from "./components";

type EditorBarClickBtnType = "Bold" | "Italic";

export type EditorBarProps = {
  editor: null | EditorType;
};

export const EditorBar = ({ editor }: EditorBarProps) => {
  const handleClick = useCallback(
    (
      e: React.SyntheticEvent<HTMLButtonElement>,
      type: EditorBarClickBtnType
    ) => {
      e.preventDefault();
      editor?.chain().focus()[`toggle${type}`]().run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <EditorBarRoot>
      <EditorBarBtn
        onClick={(e: React.SyntheticEvent<HTMLButtonElement>) =>
          handleClick(e, "Bold")
        }
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <EditorIconBold />
      </EditorBarBtn>
      <EditorBarBtn
        onClick={(e: React.SyntheticEvent<HTMLButtonElement>) =>
          handleClick(e, "Italic")
        }
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <EditorIconItalic />
      </EditorBarBtn>
    </EditorBarRoot>
  );
};

export type EditorProps = {
  options?: Partial<EditorOptions>;
};

export const Editor = ({ options, ...props }: EditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    ...(options || {}),
  });

  return (
    <EditorRoot>
      <EditorGlobalStyles />
      <EditorBar editor={editor} />
      <EditorContent className="EditorContent" editor={editor} {...props} />
    </EditorRoot>
  );
};

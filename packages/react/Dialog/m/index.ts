import { KoineDialogProps } from "../DialogMui.js";

export const mRootStyle = (props: Pick<KoineDialogProps, "open" | "style">) =>
  ({
    pointerEvents: props.open ? "all" : "none",
    ...(props.style || {}),
  } as React.CSSProperties);

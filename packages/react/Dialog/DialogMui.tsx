import ModalUnstyled, {
  type ModalProps as ModalUnstyledProps,
} from "@mui/base/Modal";
import type { MotionProps } from "framer-motion";
import React, { forwardRef, useRef } from "react";
import { MdClear as IconClose } from "react-icons/md";
import type { Simplify } from "@koine/utils";
import { type WithComponents, extendComponent } from "../extendComponent";

type ReducedModalUnstyledProps = Omit<
  ModalUnstyledProps,
  | "onClose"
  | "BackdropComponent"
  // | "BackdropProps"
  | "classes"
  | "closeAfterTransition"
  | "component"
  | "components"
  | "componentsProps"
>;

export type OwnProps = React.PropsWithChildren<
  ReducedModalUnstyledProps & {
    onClose: (event: object, reason?: string) => any; // ModalUnstyledProps["onClose"] | React.MouseEventHandler;
    title?: string;
    /** @default true */
    /** @default false */
    $scrollPaper?: boolean;
    mBackdrop?: MotionProps;
    mPaper?: MotionProps;
  }
>;

export type Components = {
  Root: {
    type: typeof ModalUnstyled;
    props: React.PropsWithChildren<ReducedModalUnstyledProps>;
  };
  Backdrop: {
    type: "div";
    props: /* ModalUnstyledProps["componentsProps"]["backdrop"] & */ {
      open?: OwnProps["open"];
    };
    motionable: true;
  };
  Container: {
    type: "div";
    props: React.PropsWithChildren<Pick<OwnProps, "$scrollPaper">>;
  };
  Paper: {
    type: "div";
    props: React.PropsWithChildren<
      {
        "aria-label": string;
      } & Pick<OwnProps, "$scrollPaper">
    >;
    motionable: true;
  };
  Close: {
    type: "button";
    props: React.PropsWithChildren<{ onClick: OwnProps["onClose"] }>;
  };
  Header: {
    type: "div";
    props: React.PropsWithChildren<{}>;
  };
  Body: {
    type: "div";
    props: React.PropsWithChildren<{}>;
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

export type Props = Simplify<WithComponents<OwnProps, Components>>;

export type DialogProps = Props;

export type KoineDialogProps = Props;

export const Root = ModalUnstyled as unknown as Props["Root"];
export const Backdrop = "div" as unknown as Props["Backdrop"];
export const Container = "div" as unknown as Props["Container"];
export const Paper = "div" as unknown as Props["Paper"];
export const Close = "button" as unknown as Props["Close"];
export const Header = "div" as unknown as Props["Header"];
export const Body = "div" as unknown as Props["Body"];

// const Dialog = ({
//   children,
//   title,
//   $scrollPaper,
//   Root: _Root,
//   Backdrop: _Backdrop,
//   Container: _Container,
//   Paper: _Paper,
//   Close: _Close,
//   Header: _Header,
//   Body: _Body,
//   ...props
// }: KoineDialogProps) => (
//   <Root components={{ Backdrop }} onBackdropClick={props.onClose} {...props}>
//     <Container $scrollPaper={$scrollPaper}>
//       <Paper aria-label={title || ""} $scrollPaper={$scrollPaper}>
//         {title && <Header>{title}</Header>}
//         <Close onClick={props.onClose}>
//           <IconClose />
//         </Close>
//         <Body>{children}</Body>
//       </Paper>
//     </Container>
//   </Root>
// );

/**
 *
 * Main differences from [Mui Dialog](https://mui.com/material-ui/react-dialog):
 *
 * - By default uses `scroll="body"` instead of paper.
 * - Optionally uses `framer-motion` for animations
 * - Uses backdrop blur by default
 *
 * FIXME: it actually works even without forwardRef, check if we do need it
 */
const DialogWithRef = forwardRef<HTMLDivElement, KoineDialogProps>(
  function Dialog(
    {
      children,
      title,
      $scrollPaper,
      Root: _Root,
      Backdrop: _Backdrop,
      Container: _Container,
      Paper: _Paper,
      Close: _Close,
      Header: _Header,
      Body: _Body,
      onClose,
      ...props
    },
    ref,
  ) {
    // click handling is taken from
    // @see https://github.com/mui/material-ui/blob/c758b6c0b30f0831110458a746690b33147c45df/packages/mui-material/src/Dialog/Dialog.js#L205-L226
    const backdropClick = useRef<boolean | null>();
    const handleMouseDown: React.MouseEventHandler = (event) => {
      // We don't want to close the dialog when clicking the dialog content.
      // Make sure the event starts and ends on the same DOM element.
      backdropClick.current = event.target === event.currentTarget;
    };
    const handleBackdropClick: React.MouseEventHandler = (event) => {
      // Ignore the events not coming from the "backdrop".
      if (!backdropClick.current) {
        return;
      }
      backdropClick.current = null;
      // if (onBackdropClick) onBackdropClick(event);
      if (onClose) {
        onClose(event, "backdropClick");
      }
    };

    return (
      <Root
        slots={{ backdrop: Backdrop }}
        onClick={handleBackdropClick}
        onClose={onClose}
        ref={ref}
        {...props}
      >
        <Container $scrollPaper={$scrollPaper} onMouseDown={handleMouseDown}>
          <Paper aria-label={title || ""} $scrollPaper={$scrollPaper}>
            {title && <Header>{title}</Header>}
            <Close onClick={onClose}>
              <IconClose />
            </Close>
            <Body>{children}</Body>
          </Paper>
        </Container>
      </Root>
    );
  },
);

export const KoineDialog = extendComponent(DialogWithRef, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

// export default Dialog;

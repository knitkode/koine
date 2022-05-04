import React, { forwardRef } from "react";
import ModalUnstyled, {
  type ModalUnstyledProps,
} from "@mui/base/ModalUnstyled/index.js";
import { type MotionProps } from "framer-motion";
import { MdClear as IconClose } from "react-icons/md/index.js";
import {
  extendComponent,
  // type OverridableComponents,
  type WithComponents,
  type Simplify,
} from "../helpers/index.js";

// export const koineDialogBg = `
//   background: var(--bodyBg);
//   box-shadow: var(--shadow);
// `;

type ReducedModalUnstyledProps = Omit<
  ModalUnstyledProps,
  | "onClose"
  | "BackdropComponent"
  | "classes"
  | "closeAfterTransition"
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
    props: ModalUnstyledProps["BackdropProps"] & {
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
//   <Root BackdropComponent={Backdrop} {...props}>
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
      ...props
    },
    ref
  ) {
    return (
      <Root BackdropComponent={Backdrop} ref={ref} {...props}>
        <Container $scrollPaper={$scrollPaper}>
          <Paper aria-label={title || ""} $scrollPaper={$scrollPaper}>
            {title && <Header>{title}</Header>}
            <Close onClick={props.onClose}>
              <IconClose />
            </Close>
            <Body>{children}</Body>
          </Paper>
        </Container>
      </Root>
    );
  }
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

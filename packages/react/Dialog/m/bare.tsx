import { forwardRef, useMemo } from "react";
import { MdClear as IconClose } from "react-icons/md";
import { AnimatePresence, m } from "framer-motion";
import { extendComponent } from "../../helpers";
import type { KoineDialogProps } from "../DialogMui";
import { mRootStyle } from "./index";
import {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
} from "../DialogMui";
// import { KoineDialog as _ } from "../DialogMui";

export type { KoineDialogProps } from "../DialogMui";

/**
 * About nested `AnimatePresence` and animated dialogs with framer @see:
 *
 * - https://github.com/framer/motion/issues/478
 * - https://codesandbox.io/s/clever-banzai-7km49?file=/src/Modal.js
 */
const Dialog = forwardRef<HTMLDivElement, KoineDialogProps>(function Dialog(
  {
    children,
    title,
    $scrollPaper,
    Root,
    Backdrop,
    Container,
    Paper,
    Close,
    Header,
    Body,
    mBackdrop,
    mPaper,
    ...props
  },
  ref
) {
  const BackdropMotion: KoineDialogProps["Backdrop"] = useMemo(
    () => (props) =>
      (
        <AnimatePresence>
          {/* @ts-expect-error framer props collision... */}
          {props.open && <Backdrop {...mBackdrop} {...props} />}
        </AnimatePresence>
      ),
    [Backdrop, mBackdrop]
  );

  return (
    <Root
      keepMounted
      BackdropComponent={BackdropMotion}
      {...props}
      style={mRootStyle(props)}
    >
      <Container $scrollPaper={$scrollPaper}>
        <AnimatePresence>
          {props.open && (
            // @ts-expect-error framer props collision...
            <Paper
              {...mPaper}
              aria-label={title || ""}
              $scrollPaper={$scrollPaper}
            >
              {title && <Header>{title}</Header>}
              <Close onClick={props.onClose}>
                <IconClose />
              </Close>
              <Body>{children}</Body>
            </Paper>
          )}
        </AnimatePresence>
      </Container>
    </Root>
  );
});

export const KoineDialog = extendComponent(Dialog, {
  Root,
  Backdrop: m(Backdrop),
  Container,
  Paper: m(Paper),
  Close,
  Header,
  Body,
});

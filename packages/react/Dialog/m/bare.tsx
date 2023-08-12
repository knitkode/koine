// FIXME: cannot build this
import { extendComponent } from "../../extendComponent";

const Dialog = () => null;
export const KoineDialog = extendComponent(Dialog, {});

// import { AnimatePresence, m } from "framer-motion";
// import { forwardRef, useMemo, useRef } from "react";
// import { MdClear as IconClose } from "react-icons/md";
// import { extendComponent } from "../../extendComponent";
// import {
//   Backdrop,
//   Body,
//   Close,
//   Container,
//   Header,
//   type KoineDialogProps,
//   Paper,
//   Root,
// } from "../DialogMui";
// import { mRootStyle } from "./index";

// // import { KoineDialog as _ } from "../DialogMui";

// export type { KoineDialogProps } from "../DialogMui";

// /**
//  * About nested `AnimatePresence` and animated dialogs with framer @see:
//  *
//  * - https://github.com/framer/motion/issues/478
//  * - https://codesandbox.io/s/clever-banzai-7km49?file=/src/Modal.js
//  */
// const Dialog = forwardRef<HTMLDivElement, KoineDialogProps>(function Dialog(
//   {
//     children,
//     title,
//     $scrollPaper,
//     Root,
//     Backdrop,
//     Container,
//     Paper,
//     Close,
//     Header,
//     Body,
//     mBackdrop,
//     mPaper,
//     onClose,
//     ...props
//   },
//   ref
// ) {
//   const BackdropMotion: KoineDialogProps["Backdrop"] = useMemo(
//     () => (props) =>
//       (
//         <AnimatePresence>
//           {/* @ts-expect-error framer props collision... */}
//           {props.open && <Backdrop {...mBackdrop} {...props} />}
//         </AnimatePresence>
//       ),
//     [Backdrop, mBackdrop]
//   );

//   // FIXME: extract this logic either in a useDialog hook or in a useclickOutside hook
//   // click handling is taken from
//   // @see https://github.com/mui/material-ui/blob/c758b6c0b30f0831110458a746690b33147c45df/packages/mui-material/src/Dialog/Dialog.js#L205-L226
//   const backdropClick = useRef<boolean | null>();
//   const handleMouseDown: React.MouseEventHandler = (event) => {
//     // We don't want to close the dialog when clicking the dialog content.
//     // Make sure the event starts and ends on the same DOM element.
//     backdropClick.current = event.target === event.currentTarget;
//   };
//   const handleBackdropClick: React.MouseEventHandler = (event) => {
//     // Ignore the events not coming from the "backdrop".
//     if (!backdropClick.current) {
//       return;
//     }
//     backdropClick.current = null;
//     // if (onBackdropClick) onBackdropClick(event);
//     if (onClose) {
//       onClose(event, "backdropClick");
//     }
//   };

//   return (
//     <Root
//       keepMounted
//       slots={{ backdrop: BackdropMotion }}
//       onClick={handleBackdropClick}
//       onClose={onClose}
//       ref={ref}
//       {...props}
//       style={mRootStyle({ open: props.open, style: props.style })}
//     >
//       <Container $scrollPaper={$scrollPaper} onMouseDown={handleMouseDown}>
//         <AnimatePresence>
//           {props.open && (
//             // @ts-expect-error framer props collision...
//             <Paper
//               {...mPaper}
//               aria-label={title || ""}
//               $scrollPaper={$scrollPaper}
//             >
//               {title && <Header>{title}</Header>}
//               <Close onClick={onClose}>
//                 <IconClose />
//               </Close>
//               <Body>{children}</Body>
//             </Paper>
//           )}
//         </AnimatePresence>
//       </Container>
//     </Root>
//   );
// });

// export const KoineDialog = extendComponent(Dialog, {
//   Root,
//   Backdrop: m(Backdrop),
//   Container,
//   Paper: m(Paper),
//   Close,
//   Header,
//   Body,
// });

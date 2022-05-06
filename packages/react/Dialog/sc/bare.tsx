import styled from "styled-components";
import { extendComponent } from "../../helpers";
import { inset0 } from "../../styles/styled";
import { IconButton } from "../../Buttons";
import type { Components } from "../DialogMui";
import * as _ from "../DialogMui";

export type { KoineDialogProps } from "../DialogMui";

export const Root = styled(_.Root)`
  z-index: 1300;
  position: fixed;
  ${inset0}
`;

// export const Backdrop = (props) => {
//   return <div {...props} />;
// }

export const Backdrop = styled(_.Backdrop)`
  z-index: -1;
  position: fixed;
  ${inset0}
  backdrop-filter: blur(0px);
  -webkit-tap-highlight-color: transparent;
`;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js#L64-L85
 */
export const Container = styled(_.Container)<Components["Container"]["props"]>`
  height: 100%;
  outline: 0;
  ${(p) =>
    p.$scrollPaper
      ? "display: flex; justify-content: center; align-items: center;"
      : "overflow: hidden auto; text-align: center; &:after { content: ''; display: inline-block; vertical-align: middle; height: 100%; width: 0; }"}
`;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js#L104-L157
 */
export const Paper = styled(_.Paper)<Components["Paper"]["props"]>`
  position: relative;
  ${(p) =>
    p.$scrollPaper
      ? "display: flex; flex-direction: column; max-height: calc(100%-64px);"
      : "display: inline-block; vertical-align: middle; text-align: initial;"}
`;

export const Close = styled(IconButton)`
  position: absolute;
`;

export const Header = styled(_.Header)``;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/DialogContent/DialogContent.js#L29-L44
 */
export const Body = styled(_.Body)`
  flex: 1 1 auto;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  overflow: auto;
`;

export const KoineDialog = extendComponent(_.KoineDialog, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

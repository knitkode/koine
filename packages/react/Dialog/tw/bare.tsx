import { classed, extendComponent } from "../../helpers";
import type { ComponentsProps } from "../DialogMui";
import * as _ from "../DialogMui";

export type { KoineDialogProps } from "../DialogMui";

export const Root = classed(_.Root)`< class="dialog fixed z-[1300] inset-0`;

export const Backdrop = classed(
  _.Backdrop
)`< class="dialogBackdrop fixed -z-[1] inset-0 [-webkit-tap-highlight-color:transparent]`;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js#L64-L85
 */
export const Container = classed<ComponentsProps["Container"]>(
  _.Container
)`< class="dialogContainer h-full outline-0 ${(p) =>
  p.$scrollPaper
    ? "flex justify-center items-center"
    : "overflow-y-auto overflow-x-hidden text-center [after:content:''] after:inline-block after:align-middle after:h-full after:w-0"}`;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Dialog/Dialog.js#L104-L157
 */
export const Paper = classed<ComponentsProps["Paper"]>(
  _.Paper
)`< class="dialogPaper relative ${(p) =>
  p.$scrollPaper
    ? "flex flex-col max-h-[calc(100%-64px)]"
    : "inline-block align-middle [text-align:initial]"}`;

export const Close = classed(_.Close)`< class="dialogClose`;

export const Header = classed(_.Header)`< class="dialogHeader`;

/**
 * @see https://github.com/mui/material-ui/blob/master/packages/mui-material/src/DialogContent/DialogContent.js#L29-L44
 * The arbitrary rule webkit-overflow-scrolling is to add iOS momentum scrolling for iOS < 13.0,
 * this was removed from tailiwnd 2.0 on
 *
 * @see https://github.com/tailwindlabs/tailwindcss.com/issues/483
 * @see https://v2.tailwindcss.com/docs/upgrading-to-v2#the-scrolling-touch-and-scrolling-auto-utilities-have-been-removed
 */
export const Body = classed(
  _.Body
)`< class="dialogBody flex-1 basis-auto overflow-y-auto [-webkit-overflow-scrolling:touch]`;

export const KoineDialog = extendComponent(_.KoineDialog, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

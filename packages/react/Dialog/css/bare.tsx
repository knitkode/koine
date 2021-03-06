import { classed, extendComponent } from "../../helpers";
import * as _ from "../DialogMui";

// export type { KoineDialogProps } from "../DialogMui";

export const Root = classed(_.Root)`dialog`;

export const Backdrop = classed(_.Backdrop)`dialogBackdrop`;

export const Container = classed(_.Container)`dialogContainer`;

export const Paper = classed(_.Paper)`dialogPaper`;

export const Close = classed(_.Close)`"dialogClose`;

export const Header = classed(_.Header)`dialogHeader`;

export const Body = classed(_.Body)`dialogBody`;

export const KoineDialog = extendComponent(_.KoineDialog, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

import { classed, extendComponent } from "../../helpers";
import { KoineDialog as _ } from "./bare";

export { KoineDialogProps } from "./bare";

export const Root = classed(_.Root)``;

export const Backdrop = classed(
  _.Backdrop
)`< class="bg-white/[.5] backdrop-blur-sm`;

export const Container = classed(_.Container)``;

export const Paper = classed(
  _.Paper
)`< class="bg-white shadow-xl m-8 max-w-screen-sm border border-gray-400`;

export const Close = classed(
  _.Close
)`< class="absolute top-0 right-0 p-8 text-2xl opacity-20 hover:opacity-100 focus:opacity-100`;

export const Header = classed(_.Header)`< class="p-8 text-2xl bold italic`;

export const Body = classed(_.Body)`< class="p-8 pt-4`;

export const KoineDialog = extendComponent(_, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

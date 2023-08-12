import { classed } from "../../classed";
import { extendComponent } from "../../extendComponent";
import { KoineDialog as _ } from "./bare";

export type { KoineDialogProps } from "./bare";

export const Root = classed(_.Root)``;

export const Backdrop = classed(
  _.Backdrop,
)`< class="bg-black/[.5] backdrop-blur-sm`;

export const Container = classed(_.Container)``;

export const Paper = classed(
  _.Paper,
)`< class="rounded bg-white shadow-xl m-8 max-w-screen-sm`;

export const Close = classed(
  _.Close,
)`< class="absolute top-0 right-0 p-4 text-2xl opacity-50`;

export const Header = classed(_.Header)`< class="p-4 text-xl`;

export const Body = classed(_.Body)`< class="p-4 border-t border-gray-200`;

export const KoineDialog = extendComponent(_, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

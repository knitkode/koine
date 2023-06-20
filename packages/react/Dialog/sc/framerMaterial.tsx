import { m } from "framer-motion";
import { extendComponent } from "../../helpers";
import { KoineDialog as _ } from "../m/bare";
import { dialogBackdropMotion, dialogPaperMotion } from "../m/basic";
import {
  Backdrop,
  Body,
  Close,
  Container,
  Header,
  Paper,
  Root,
} from "./material";

export const KoineDialog = extendComponent(_, {
  Root,
  Backdrop: m(Backdrop),
  Container,
  Paper: m(Paper),
  Close,
  Header,
  Body,
  mBackdrop: dialogBackdropMotion,
  mPaper: dialogPaperMotion,
});

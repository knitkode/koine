import { m } from "framer-motion";
import { extendComponent } from "../../helpers";
import { dialogBackdropMotion, dialogPaperMotion } from "../m/basic";
import { KoineDialog as _ } from "../m/bare";
import {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
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

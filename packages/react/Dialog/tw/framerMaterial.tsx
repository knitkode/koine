import { m } from "framer-motion";
import { extendComponent } from "../../helpers/index.js";
import { dialogBackdropMotion, dialogPaperMotion } from "../m/basic.js";
import { KoineDialog as _ } from "../m/bare.js";
import {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
} from "./material.js";

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

import styled from "styled-components";
import { extendComponent } from "../../extendComponent";
import { KoineDialog as _ } from "./bare";

export type { KoineDialogProps } from "./bare";

export const Root = styled(_.Root)``;

export const Backdrop = styled(_.Backdrop)`
  background: rgba(0, 0, 0, 0.5);
  filter: backdrop-blur(4px);
`;

export const Container = styled(_.Container)``;

export const Paper = styled(_.Paper)`
  max-width: 640px;
  margin: 64px;
  border-radius: 4px;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
`;

export const Close = styled(_.Close)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  font-size: 2rem;
  opacity: 0.5;
`;

export const Header = styled(_.Header)`
  padding: 16px;
  font-size: 1.25rem;
`;

export const Body = styled(_.Body)`
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

export const KoineDialog = extendComponent(_, {
  Root,
  Backdrop,
  Container,
  Paper,
  Close,
  Header,
  Body,
});

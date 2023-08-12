import styled from "styled-components";
import { Alert } from "../../Alert";
import { Collapsable } from "../../Collapsable";
import { ProgressCircular } from "../../Progress";
import { extendComponent } from "../../extendComponent";
import { centered, overlay } from "../../styles/styled";
import * as _ from "../Form";

export type { KoineFormProps } from "../Form";

export const Root = styled(_.Root)`
  position: relative;
`;

export const Overlay = styled(_.Overlay)`
  z-index: 4;
  ${overlay}
  ${centered}
  background: rgba(var(--bodyBg--rgb),.8);
  pointer-events: none;
  backdrop-filter: blur(2px);
`;

export const Feedback = styled(Alert)`
  padding: 2em 0;
`;

export const KoineForm = extendComponent(_.KoineForm, {
  Root,
  Overlay,
  Progress: ProgressCircular,
  Collapsable,
  Ok: Feedback,
  Fail: Feedback,
});

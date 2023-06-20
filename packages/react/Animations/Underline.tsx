import { m } from "framer-motion";
import styled from "styled-components";

export const UnderlineSkewed = styled(m.i)`
  display: block;
  position: absolute;
  top: 50%;
  left: 15%;
  right: 15%;
  height: 20px;
  margin-top: -10px;
  z-index: 0;
  pointer-events: none;
  background: var(--accent400);
  transform: skewY(-5deg);
`;

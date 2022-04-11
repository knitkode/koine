import styled from "styled-components";
import { Breakpoint } from "../styles/theme";

export type HiddenProps = {
  $min?: Breakpoint;
  $max?: Breakpoint;
};

export const Hidden = styled.div<HiddenProps>`
  ${(p) =>
    `${
      p.$min
        ? `
  @media (min-width: ${p.theme.breakpoints[p.$min]}px) {
    display: none;
  }`
        : ""
    } ${
      p.$max
        ? `
  @media (max-width: ${p.theme.breakpoints[p.$max]}px) {
    display: none;
  }`
        : ""
    }`}
`;

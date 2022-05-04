import styled, { css } from "styled-components";
import {
  IconButton,
  IconButtonProps,
  IconButtonUiProps,
} from "./IconButton.js";

export const buttonFab = css`
  box-shadow: 3px 3px 6px -4px rgb(0, 0, 0, 0.5);
`;

export const IconButtonFab = styled(IconButton)<IconButtonUiProps>`
  ${buttonFab}
`;

export type IconButtonFabProps = IconButtonProps &
  React.ComponentPropsWithRef<"button">;

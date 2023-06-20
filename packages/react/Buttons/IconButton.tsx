import styled, { css } from "styled-components";
import {
  KoineButtonUiProps,
  btnStyleContained,
  btnStyleOutlined,
  btnStyleReset,
} from "./Button";

export const iconBtnStyleReset = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  ${btnStyleReset}
`;

export const iconBtnStyleBase = css`
  ${iconBtnStyleReset}
`;

export const IconButton = styled.button<IconButtonUiProps>`
  ${iconBtnStyleBase}
  ${(p) => p.$variant === "outlined" && btnStyleOutlined}
  ${(p) => p.$variant === "contained" && btnStyleContained}
`;

export type IconButtonUiProps = KoineButtonUiProps & {
  disabled?: boolean;
};

export type IconButtonProps = IconButtonUiProps &
  React.ComponentPropsWithRef<"button">;

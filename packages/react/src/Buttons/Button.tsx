import { ComponentPropsWithRef } from "react";
import styled, { css } from "styled-components";
import { stateFocus } from "../styles/styled";

/**
 * Prevent 300ms delay with `touch-action` performance optimization,
 * @see https://twitter.com/argyleink/status/1405881231695302659
 */
export const btnStyleUndo = css`
  appearance: none;
  -webkit-appearance: none;
  -webkit-touch-callout: none;
  user-select: none;
  touch-action: manipulation;
  outline: 0px;
  color: var(--bodyColor);
`;

export const btnStyleReset = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;
  cursor: pointer;
  ${btnStyleUndo}

  &[disabled] {
    cursor: default;
    opacity: 0.7;
  }
`;

export const btnStyleBase = css<KoineButtonUiProps>`
  ${btnStyleReset}

  min-width: ${(p) => (p.$noGutter ? "0" : "150px")};
  padding: ${(p) => (p.$noGutter ? "0" : "10px 30px")};
  border-radius: 0;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  ${(p) => p.$block && `width: 100%; display: flex;`}

  &:focus,
  &:active,
  &:visited {
    ${stateFocus}
  }

  /* This targets icons within a button */
  & svg {
    margin: 0 1em 0 0;
    font-size: 1.25em;
  }
`;

export const btnStyleContained = css`
  color: white;
  background: var(--accent200);
  border-color: var(--accent200);

  &:hover:not([disabled]) {
    background: var(--accent300);
    border-color: var(--accent300);
  }
`;

export const btnStyleOutlined = css`
  color: var(--accent200);
  border-color: var(--accent200);

  &:hover:not([disabled]) {
    background: var(--accent300);
    border-color: var(--accent300);
    color: white;
  }
`;

export const KoineButton = styled.button<KoineButtonUiProps>`
  ${btnStyleBase}
  ${(p) => p.$variant === "outlined" && btnStyleOutlined}
  ${(p) => p.$variant === "contained" && btnStyleContained}
`;

export type KoineButtonUiProps = {
  disabled?: boolean;
  $variant?: "contained" | "outlined";
  $noGutter?: boolean;
  $block?: boolean;
};

export type KoineButtonProps = KoineButtonUiProps &
  ComponentPropsWithRef<"button">;

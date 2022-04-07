import type { Theme } from "./theme";

export function colStretch(
  this: Theme,
  direction: "left" | "right",
  color: keyof Readonly<Theme> | string
) {
  // @ts-expect-error nevermind
  const bg = this?.[color] ? this[color] : color;
  return `
    background: ${bg};
    position: relative;

    &:before{
      z-index: -1;
      content: '';
      position: absolute;
      right: ${direction === "left" ? "100%" : "-100vw"};
      left: ${direction === "right" ? "100%" : "-100vw"};
      top: 0;
      bottom: 0;
      background: ${bg};
    }
  `;
}

/** @see https://caniuse.com/?search=inset */
export const inset0 = `top:0;left:0;right:0;bottom:0;`;

export const overlay = `position: absolute;${inset0}`;

export const centered = `display: flex;align-items: center;justify-content: center;`;

export const ellipsis = `overflow: hidden;text-overflow: ellipsis;white-space: nowrap;`;

/**
 * @see import("@mui/utils").visuallyHidden https://github.com/mui-org/material-ui/blob/master/packages/mui-utils/src/visuallyHidden.ts
 */
export const invisible = `border: 0;clip: rect(0 0 0 0);height: 1px;margin: -1px;overflow: hidden;padding: 0;position: absolute;white-space: nowrap;width: 1px;`;

export const stateFocus = `outline: 0px;box-shadow: 0 0 0 0.2rem rgba(200, 200, 200, 0.25);`;

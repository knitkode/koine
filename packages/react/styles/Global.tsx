import { createGlobalStyle } from "styled-components";

/**
 * App global style
 *
 * For examples of what to do here take a look at [Bootstrap's reset](https://github.com/twbs/bootstrap/blob/main/scss/_reboot.scss)
 * and similar.
 *
 * What we do here:
 * - set the base font family on all possible elements including placeholders prevent Chrome showing a standard font when using the autofill feature
 *  - @see https://stackoverflow.com/a/60987373/1938970
 * - set the base font size on all possible elements to prevent weird zooming on input fields on iPhone iOS devices.
 *  - @see https://www.warrenchandler.com/2019/04/02/stop-iphones-from-zooming-in-on-form-fields/
 *  - @see https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
 */
export const stylesGlobal = `
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  body,
  button,
  input,
  textarea,
  select,
  select:-webkit-autofill::first-line,
  input:-webkit-autofill::first-line {
    font-family: var(--font), -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    font-size: var(--fontSize);
  }

  html {
    box-sizing: border-box;
    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
    -webkit-tap-highlight-color: transparent;
  }
`;

export const StylesGlobal = createGlobalStyle`${stylesGlobal}`;

import "styled-components";
// import type {} from "styled-components/cssprop"; // for `css` prop

/**
 * Styled components utility types
 */
type Theme = import("./styles/theme").Theme;

declare module "styled-components" {
  // extends the global DefaultTheme with our ThemeType.
  export interface DefaultTheme extends Theme {
    maxWidth: number;
  }
}

/**
 * Types specifically related to `@koine/react` exposed on the global unique
 * namespace `Koine`. Most of the types here should be prefixed by `React`, e.g.
 * `ReactSomeFeature` accessible anywhere from `Koine.ReactSomeFeature`
 */
declare namespace Koine {}

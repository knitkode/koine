import { useState, useEffect } from "react";
import { useTheme, breakpoints, Breakpoint, Breakpoints } from "./theme";

export const { min, max, up, down, between, only } =
  generateMediaQueries(breakpoints);

export type MediaDirection = "min" | "max";

export type MediaQuery = `${MediaDirection}:${Breakpoint}`;

export type MediaQueryFunction = {
  [Breakpoint in keyof Breakpoints]: string;
} & {
  (breakpoint: Breakpoint): string;
};

export function useMedia(media: MediaQuery) {
  const { breakpoints } = useTheme();
  const [matches, setMatches] = useState(false);
  const [direction = "min", breakpoint] = media.split(":") as [
    MediaDirection,
    Breakpoint
  ];
  let px = breakpoints[breakpoint] as number;
  if (direction === "max") {
    px = px - 0.02;
  }
  const query = `(${direction}-width: ${px}px)`;

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mq.matches);

    // Safari < 14 can't use addEventListener on a MediaQueryList
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList#Browser_compatibility
    if (!mq.addEventListener) {
      // Update the state whenever the media query match state changes
      mq.addListener(handleChange);

      // Clean up on unmount and if the query changes
      return () => {
        mq.removeListener(handleChange);
      };
    }
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Generate media queries helpers
 *
 * Usage:
 * ```jsx
 * import { generateMediaQueries } from "@koine/react";
 *
 * export const breakpoints = {
 *   xs: 0,
 *   sm: 440,
 *   md: 768,
 *   lg: 1024,
 *   xl: 1368,
 *   xxl: 1690,
 * } as const;
 *
 * export const { min, max, up, down, between, only } = generateMediaQueries(breakpoints);
 * ```
 *
 * Consider the following syntaxes, using normal CSS is just slightly
 * longer but it aovid js imports, reduce the js overhead and improve CSS
 * highlighting in the editor.
 *
 * Even if we would reduce the function signature to the bare minimum the advantage
 * in terms of typing would not be much, also loosing in readability.
 *
 * ```css
 * // but unfortunately this does not work
 * @media (min-width: var(--b-sm)) {}
 * @media (min-width: 480px) {}
 *
 * ${media("min", "sm")} {}
 * ${mediaMin("sm")} {}
 * ${min.sm} {}
 * ${p => p.theme.min.sm}``
 * ```
 *
 * Related projects:
 * @see https://github.com/mg901/styled-breakpoints
 * @see https://github.com/morajabi/styled-media-query
 *
 * @see https://www.w3.org/TR/mediaqueries-5/#custom-mq The spec would allow for
 * something like this syntax
 *
 * ```css
 * @custom-media --narrow-window (max-width: 30em);
 * @media (--narrow-window) {}
 * ```
 */
export function generateMediaQueries(breakpoints: Breakpoints) {
  const temp: [Breakpoint, number][] = Object.keys(breakpoints).map((key) => {
    const br = key as keyof typeof breakpoints;
    return [br, breakpoints[br]];
  });

  const sortedKeys = temp.sort((a, b) => a[1] - b[1]).map((item) => item[0]);

  const getNext = (breakpoint: Breakpoint) => {
    const index = sortedKeys.indexOf(breakpoint);
    return sortedKeys[index + 1];
  };

  /**
   * It behaves the same as `@media (min-width: ${value}px)`
   * where value is the given breakpoint value.
   * For ease of use this can be used both as a function `min("md")` and as an
   * object literal `min.md`.
   */ // @ts-expect-error FIXME: at some point
  const min: MediaQueryFunction = (br: Breakpoint) =>
    `@media (min-width: ${breakpoints[br]}px)`;

  /**
   * It behaves the same as `@media (max-width: ${value}px)`
   * where value is the given breakpoint value.
   * For ease of use this can be used both as a function `max("md")` and as an
   * object literal `max.md`.
   */ // @ts-expect-error FIXME: at some point
  const max: MediaQueryFunction = (br: Breakpoint) =>
    `@media (max-width: ${breakpoints[br] - 0.02}px)`;

  for (const br in breakpoints) {
    const _br = br as Breakpoint;
    min[_br] = `@media (min-width: ${breakpoints[_br]}px)`;
    max[_br] = `@media (max-width: ${breakpoints[_br] - 0.02}px)`;
  }

  /**
   * It behaves the same as `min`
   * @inheritdoc {max}
   */
  const up = min;

  /**
   * It behaves similarly to `max` but you will use the "next" breakpoint,
   * specifying CSS that will apply from the given breakpoint and down.
   */
  const down = (br: Breakpoint) => {
    const brNext = getNext(br);
    // TODO: if br does not exists otherwise throw Error
    return brNext && `@media (max-width: ${breakpoints[brNext] - 0.02}px)`;
  };

  /**
   * Media query between the two given breakpoints
   */
  const between = (br1: Breakpoint, br2: Breakpoint) => {
    return `@media (min-width: ${breakpoints[br1]}px) and (max-width: ${
      breakpoints[br2] - 0.02
    }px)`;
  };

  /**
   * Media query to apply from the given breakpoint until the next, just for its
   * full range
   */
  const only = (br: Breakpoint) => {
    const brNext = getNext(br);
    return brNext ? between(br, brNext) : min(br);
  };

  return {
    min,
    max,
    up,
    down,
    between,
    only,
  };
}

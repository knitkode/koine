import styled, { StyledProps } from "styled-components";
import type { Theme, Breakpoint } from "../styles/theme";

export const GRID_COLUMNS = 12;

export const GRID_GUTTER_DEFAULT: keyof Theme["gutter"] = "half";

export type GridProps = {
  /**
   * @default "half"
   */
  $gutter?: keyof Theme["gutter"];
};

export type ContainerProps = GridProps & {
  size: Breakpoint;
  clamp?: boolean;
};

export const Container = styled.div<ContainerProps>`
  max-width: ${(p) => p.theme.breakpoints[p.size]}px;
  margin: 0 auto;
  padding: 0 ${(p) => p.theme.gutter[p.$gutter || GRID_GUTTER_DEFAULT]}px;
  ${(p) => (p.clamp ? "overflow: hidden;" : "")}
`;

export type ContainerFluidProps = GridProps & {
  size: Breakpoint;
};

export const ContainerFluid = styled.div<ContainerFluidProps>`
  padding: 0 ${(p) => p.theme.gutter[p.$gutter || GRID_GUTTER_DEFAULT]}px;
`;

type Direction = "min" | "max";

export type RowProps = GridProps & {
  $valign?: React.CSSProperties["alignItems"];
  $reverse?: `${Direction}:${Breakpoint}`;
  /**
   * It forces child columns to be on one line overflowing the content when it does not fit,
   * it is suggested to use with children having a minimum width not in percentage,
   * for things like sliders and carousels
   */
  $noWrap?: boolean;
};

export const Row = styled.div<RowProps>`
  margin: 0 -${(p) => p.theme.gutter[p.$gutter || GRID_GUTTER_DEFAULT]}px;
  display: flex;
  ${(p) => (p.$noWrap ? "overflow: auto;" : "flex-wrap: wrap;")}
  ${(p) => (p.$valign ? `align-items: ${p.$valign}` : "")};
  ${(p) =>
    p.$reverse &&
    `@media (${p.$reverse.split(":")[0] as Direction}-width: ${
      p.$reverse.split(":")[1] as Breakpoint
    }px) {
      flex-direction: row-reverse;
    }`}
`;

export type ColProps = GridProps &
  Partial<Record<Breakpoint, number>> & {
    $width?: number;
    $flex?: boolean;
    $valign?: React.CSSProperties["alignItems"];
    $auto?: boolean;
    $offset?: string;
  };

export const Col = styled.div<ColProps>`
  padding: 0 ${(p) => p.theme.gutter[p.$gutter || GRID_GUTTER_DEFAULT]}px;
  display: ${(p) => (p.$flex ? "flex" : "block")};
  ${(p) => (p.$valign ? "align-items: " + p.$valign : "")};
  ${(p) => getColCss(p)};
`;

function getColWidth(
  breakpoints: Theme["breakpoints"],
  breakpoint: Breakpoint,
  value: number
) {
  const breakpointValue = breakpoints[breakpoint] + "px";
  const width = (value * 100) / GRID_COLUMNS;
  const cssValue = `
    min-width: ${width}%;
    flex: 0 0 ${width}%;
`;

  if (breakpoint === Object.keys(breakpoints)[0]) {
    return cssValue;
  }
  return `
  @media (min-width: ${breakpointValue}){
    ${cssValue}
  }`;
}

function getColCss(props: StyledProps<ColProps>) {
  const { $auto, $offset, $width } = props;
  const { breakpoints } = props.theme;

  let css = "";
  if ($offset) {
    const offsets = $offset.split(",");
    for (let i = 0; i <= offsets.length; i++) {
      if (offsets[i]) {
        const [offsetBreakpoint, offsetSize] = offsets[i].split(":") as [
          Breakpoint,
          number
        ];
        css += ` 
          @media(min-width: ${breakpoints[offsetBreakpoint]}px){
            margin-left: ${(100 * offsetSize) / GRID_COLUMNS}%;
          }
        `;
      }
    }
  }

  if ($width) {
    // do nothing, width is set explicitly
  } else if ($auto) {
    css += `flex: 0 0 auto; width: auto; max-width: none;`;
  } else {
    for (const breakpoint in breakpoints) {
      const value = props[breakpoint as Breakpoint];
      if (typeof value !== "undefined") {
        css += getColWidth(breakpoints, breakpoint as Breakpoint, value);
      } else if (breakpoint === "xs") {
        css += getColWidth(breakpoints, breakpoint as Breakpoint, 12);
      }
    }
  }
  return css;
}

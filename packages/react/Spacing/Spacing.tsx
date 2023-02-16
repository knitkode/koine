import styled from "styled-components";
import isUndefined from "@koine/utils/isUndefined";
import {
  spacingTop,
  spacingBottom,
  SpacingSize,
  SpacingFactor,
  SpacingProperty,
  SpacingDirectionAxis,
  SpacingDevices,
} from "../styles/spacing";

const Root = styled.div<SpacingPropsStyled>`
  ${(p) => p.$top && spacingTop.call(p.theme, ...p.$top)}
  ${(p) => p.$bottom && spacingBottom.call(p.theme, ...p.$bottom)}
`;

export type SpacingPropsStyled = {
  $top?: SpacingFnArgs;
  $bottom?: SpacingFnArgs;
};

type SpacingFnArgs = [
  SpacingSize,
  SpacingFactor,
  SpacingProperty,
  SpacingDevices[]
];

type SpacingSyntaxFactor = string;

type SpacingSyntaxDevices =
  | `${SpacingDevices}`
  | `${SpacingDevices},${SpacingDevices}`
  | `${SpacingDevices},${SpacingDevices},${SpacingDevices}`;

type SpacingSyntax =
  | `${SpacingSize}`
  | `${SpacingSize}:${SpacingSyntaxFactor}`
  | `${SpacingSize}:${SpacingSyntaxFactor}:${SpacingProperty}`
  | `${SpacingSize}:${SpacingSyntaxFactor}:${SpacingProperty}:${SpacingSyntaxDevices}`;

export type SpacingProps = React.ComponentPropsWithoutRef<"div"> &
  Partial<Record<SpacingDirectionAxis, SpacingSyntax>>;

const extractDirectionArgs = (raw: SpacingSyntax) => {
  const [size, factor, property, devices] = raw.split(":");
  const factorArg = isUndefined(factor) ? undefined : parseFloat(factor);
  const devicesArg = devices?.split(",");

  return [size, factorArg, property, devicesArg] as SpacingFnArgs;
};

/**
 * Usage:
 *
 * ```jsx
 * <Spacing top="sm" />
 * <Spacing top="sm:1.5" />
 * <Spacing top="sm:1.5" bottom="lg" />
 * <Spacing vertical="sm:1.5:margin:mobile" />
 * <Spacing top="sm:1.5:padding:mobile" />
 * <Spacing top="sm:2:padding:tablet,desktop" />
 * ```
 */
export const Spacing = ({ top, bottom, vertical, ...props }: SpacingProps) => {
  let $top;
  let $bottom;

  if (top) {
    $top = extractDirectionArgs(top);
  }
  if (bottom) {
    $bottom = extractDirectionArgs(bottom);
  }
  if (vertical) {
    $top = extractDirectionArgs(vertical);
    $bottom = $top;
  }

  if (!$top && !$bottom && !vertical) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{props.children}</>;
  }

  return <Root $top={$top} $bottom={$bottom} {...props} />;
};

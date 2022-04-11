import styled from "styled-components";
import { overlay } from "../styles";
import { Container, ContainerProps } from "../Grid";

export const BgColor = styled.div<{
  $bg: BgContainerProps["color"];
}>`
  background: ${(p) => p.$bg};
`;

export const BgColorSkewed = styled.div<{
  $bg: BgContainerProps["color"];
  $transform: string;
}>`
  position: relative;
  /* overflow: hidden; */

  &:before {
    z-index: -1;
    content: "";
    ${(p) => `
      ${overlay}
      transform: ${p.$transform};
      background: ${p.$bg};
    `}
  }
`;

export type BgContainerProps = ContainerProps & {
  color: NonNullable<React.CSSProperties["background"]>;
  /**
   * In `deg` unit.
   * @default 0
   */
  skewY?: number;
  /**
   * In `deg` unit. Suggested `10` to `20`
   * @default 0
   */
  rotate?: number;
  /**
   * @default  1
   */
  scaleY?: number;
  /**
   * @default 1
   */
  scaleX?: number;
  /**
   * In `vw` unit
   * @default 0
   */
  perspective?: number;
};

export const BgContainer: React.FC<BgContainerProps> = ({
  color,
  skewY = 0,
  rotate = 0,
  scaleY = 1, // 0.85,
  scaleX = 1, // 4,
  perspective = 0, //100,
  ...containerProps
}) => {
  let $transform = "";

  if (skewY || rotate) {
    $transform = `perspective(${perspective}vw) rotateY(${rotate}deg) skewY(${skewY}deg) scaleY(${scaleY}) scaleX(${scaleX})`;
  }

  return $transform ? (
    <BgColorSkewed $bg={color} $transform={$transform}>
      <Container style={{ position: "relative" }} {...containerProps} />
    </BgColorSkewed>
  ) : (
    <BgColor $bg={color}>
      <Container {...containerProps} />
    </BgColor>
  );
};

import styled, { CSSProperties, keyframes } from "styled-components";
import type { Theme } from "../styles/theme";

const animationRotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const animationCircle = keyframes`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }
  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`;

const ProgressCircularSvg = styled.svg`
  animation: ${animationRotation} 1.5s linear infinite;
`;

const ProgressCircularCircle = styled.circle`
  animation: ${animationCircle} 1.5s linear infinite;
`;

export type ProgressCircularProps = {
  /** @default "1em" */
  size?: CSSProperties["width"];
  /** @default 1 */
  thickness: number;
  /** @default "currentColor" */
  color: keyof Theme | NonNullable<CSSProperties["color"]>;
};

/**
 * @see https://mui.com/components/progress/
 */
export const ProgressCircular = ({
  size = "1em",
  thickness = 1,
  color = "currentColor",
  ...props
}) => {
  return (
    <ProgressCircularSvg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 44 44"
      style={{ width: size, height: size }}
      {...props}
    >
      <ProgressCircularCircle
        cx="22"
        cy="22"
        r="20"
        fill="none"
        strokeWidth={thickness}
        style={{ stroke: color }}
      />
    </ProgressCircularSvg>
  );
};

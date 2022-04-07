import styled, { CSSProperties } from "styled-components";
import { m } from "framer-motion";
import type { Theme } from "../styles/theme";

const ProgressLinearBg = styled.span`
  position: relative;
  overflow: hidden;
  display: block;
  height: 4px;
`;

const ProgressLinearFg = styled(m.span)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export type ProgressLinearProps = {
  /** @default false */
  done?: boolean;
  /** @default "2px" */
  height?: CSSProperties["height"];
  /** @default "currentColor" */
  bg: keyof Theme | NonNullable<CSSProperties["color"]>;
  /** @default "currentColor" */
  fg: keyof Theme | NonNullable<CSSProperties["color"]>;
};

/**
 * @see https://mui.com/components/progress/#linear
 */
export const ProgressLinear = ({
  done = false,
  height = "2px",
  bg = "transparent",
  fg = "currentColor",
  ...props
}) => {
  return (
    <ProgressLinearBg style={{ height, background: bg }} {...props}>
      <ProgressLinearFg
        style={{ height, background: fg }}
        initial={{
          x: "-100%",
        }}
        animate={{
          x: done ? "-100%" : "0%",
        }}
        transition={
          done
            ? {}
            : {
                repeat: Infinity,
                repeatType: "reverse",
                duration: 2,
              }
        }
      />
    </ProgressLinearBg>
  );
};

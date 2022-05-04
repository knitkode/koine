import { useEffect } from "react";
import styled from "styled-components";
import { m } from "framer-motion";
import { ProgressCircular } from "./ProgressCircular.js";
import { ProgressLinear } from "./ProgressLinear.js";
import { useHeader } from "../Header/useHeader.js";

const ProgressOverlayWrap = styled(m.div)`
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  cursor: wait;
`;

const ProgressOverlayCenterer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--progress-overlay-bg);
`;

export type ProgressOverlayProps = {
  running?: boolean;
  // /** @default 0.3 */
  // startAt: number;
  // /** @default true */
  // showOnShallow: boolean;
  // /** @default 200 */
  // stopDelayMs: number;
};

export const ProgressOverlay = ({ running }: ProgressOverlayProps) => {
  const [, , headerHeight] = useHeader();
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.cursor = running ? "wait" : ".js";
  }, [running]);

  return (
    <ProgressOverlayWrap
      animate={{
        opacity: running ? 1 : 0,
      }}
      initial={{ opacity: 0 }}
      transition={{ type: "easeInOut" }}
    >
      <ProgressLinear
        bg="var(--accent400)"
        fg="var(--accent300)"
        done={!running}
      />
      <ProgressOverlayCenterer
        style={{
          top: headerHeight + "px",
        }}
      >
        <ProgressCircular size={"50px"} color="var(--accent300)" />
      </ProgressOverlayCenterer>
    </ProgressOverlayWrap>
  );
};

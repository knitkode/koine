/**
 * @file
 *
 * Simplified from https://github.com/luukdv/hamburger-react
 */
import styled from "styled-components";

const HamburgerLabel = styled.div<{ $toggled?: boolean }>`
  position: absolute;
  top: 30px;
  font-size: ${({ $toggled }) => ($toggled ? "0" : "9px")};
  text-transform: uppercase;
  left: 7px;
  letter-spacing: 3px;
`;

const area = 48;
const lines = 3;
const width = 32;
const room = Math.round((area - width) / 2);
const barHeightRaw = width / 12;
const barHeight = Math.round(barHeightRaw);
const space = 0.5;
const marginRaw = width / (lines * (space + (lines === 3 ? 1 : 1.25)));
const margin = Math.round(marginRaw);
const height = barHeight * lines + margin * (lines - 1);
const topOffset = Math.round((area - height) / 2);
const translate = 4.6325;
const deviation =
  (barHeightRaw - barHeight + (marginRaw - margin)) / (lines === 3 ? 1 : 2);
const move = parseFloat((width / translate - deviation / (4 / 3)).toFixed(2));
const time = 0.4;
const easing = "cubic-bezier(0, 0, 0, 1)";
const transition = `${time}s ${easing}`;

const burgerStyles: React.CSSProperties = {
  marginRight: "-8px", // -`${(area - width) / 2}px`,
  position: "relative",
  width: `${area}px`,
  height: `${area}px`,
  userSelect: "none",
  outline: "0px",
  cursor: "pointer",
  transition,
};

const barStyles: React.CSSProperties = {
  position: "absolute",
  width: `${width}px`,
  height: `${barHeight}px`,
  left: `${room}px`,
  background: "currentColor",
  transition,
};

export type HamburgerProps = React.ComponentProps<"div"> & {
  /** A way to provide your own state value. Can be used together with a state action (the `toggle` prop). */
  toggled?: boolean;
};

export const Hamburger = ({ toggled, ...props }: HamburgerProps) => {
  return (
    <div
      style={{
        ...burgerStyles,
        transform: `${toggled ? `rotate(90deg)` : "none"}`,
      }}
      tabIndex={0}
      {...props}
    >
      <div
        style={{
          ...barStyles,
          top: `${topOffset}px`,
          transform: `${
            toggled ? `rotate(-45deg) translate(0px, ${move}px)` : "none"
          }`,
        }}
      />
      <div
        style={{
          ...barStyles,
          top: `${topOffset + barHeight + margin}px`,
          transform: `${
            toggled ? `rotate(45deg) translate(0, -${move}px)` : "none"
          }`,
        }}
      />
      {/* <div
        style={{
          ...barStyles,
          top: `${topOffset + barHeight + margin + barHeight + margin}px`,
          transform: `${toggled ? `scaleX(0)` : "none"}`,
        }}
      /> */}
      <HamburgerLabel $toggled={toggled}>Menu</HamburgerLabel>
    </div>
  );
};

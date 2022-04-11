import styled from "styled-components";

const Root = styled.svg`
  position: fixed;
  z-index: -2;
  bottom: 0;
  transform: rotate(180deg);
  opacity: 0.9;
`;

export type BgSvgProps = {
  color: string;
};

/**
 * Centered triangle shape
 */
export const BgSvg = ({ color }: BgSvgProps) => {
  return (
    <Root
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path d="M1200 0L0 0 598.97 114.72 1200 0z" fill={color}></path>
    </Root>
  );
};

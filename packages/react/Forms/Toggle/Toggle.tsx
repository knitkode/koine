/**
 * @file
 *
 * About accessibility:
 * - minimum target size of 44px https://www.w3.org/TR/WCAG21/#target-size
 */
import styled from "styled-components";
import { stateFocus } from "../../styles/styled";
import { useId } from "../../hooks/useId";

export const toggleBase = `
  border: 1px solid var(--forms-border-color);
`;

export const toggleIndicatorBg = `
  display: inline-block;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
`;

export const toggleIndicatorBgShape = `
  ${toggleIndicatorBg}
  fill: none;
  stroke-width: 2px;
  stroke: var(--forms-border-color);
`;

export const toggleIndicatorFg = `
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  fill: currentcolor;
`;

export const Toggle = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  margin: 0 -0.3em; /* rtl */
  padding: 0.3em;
`;

export const ToggleLabel = styled.span`
  margin-left: 0.6em; /* rtl */
`;

export const ToggleLabelSub = styled.small`
  opacity: 0.7;
  font-size: 0.7em; ;
`;

export const ToggleIndicatorHolder = styled.span`
  position: relative;
  display: flex;

  input:focus ~ & {
    ${stateFocus}
  }
`;

export const ToggleIndicatorBgSquare = styled.svg`
  ${toggleIndicatorBgShape}
`;

export const ToggleIndicatorBgCircle = styled.svg`
  ${toggleIndicatorBgShape}
`;

export const ToggleIndicatorFg = styled.svg`
  ${toggleIndicatorFg}
  transform: scale(0);
  transition: transform 0.18s ease;

  input:checked + ${ToggleIndicatorHolder} & {
    transform: scale(1);
  }
`;

export type ToggleIndicatorProps = unknown;

export type ToggleIndicatorSquaredProps = ToggleIndicatorProps;

export const ToggleIndicatorSquared = (props: ToggleIndicatorSquaredProps) => {
  return (
    <ToggleIndicatorHolder>
      <ToggleIndicatorBgSquare viewBox="0 0 24 24">
        <rect width="24" height="24" />
      </ToggleIndicatorBgSquare>
      <ToggleIndicatorFg viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </ToggleIndicatorFg>
    </ToggleIndicatorHolder>
  );
};

export type ToggleIndicatorRoundedProps = ToggleIndicatorProps & {
  /** @default 6 */
  r?: number;
};

export const ToggleIndicatorRounded = ({
  r = 6,
}: ToggleIndicatorRoundedProps) => {
  const id = useId();

  return (
    <ToggleIndicatorHolder>
      <ToggleIndicatorBgCircle viewBox="0 0 24 24">
        <circle
          cy="12"
          cx="12"
          r="12"
          id={`r_${id}`}
          clipPath={`url(#c_${id})`}
        />
        <clipPath id={`c_${id}`}>
          <use xlinkHref={`#r_${id}`} />
        </clipPath>
      </ToggleIndicatorBgCircle>
      <ToggleIndicatorFg viewBox="0 0 24 24">
        <circle r={r} cx="12" cy="12" />
      </ToggleIndicatorFg>
    </ToggleIndicatorHolder>
  );
};

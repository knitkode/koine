import styled from "styled-components";

export type PillProps = object;

export const Pill = styled.div<PillProps>`
  display: inline-block;
  padding: 5px 10px;
  margin: 0 0.5em 0.5em 0;
  border-radius: 2px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
`;

export const PillGreyLight = styled(Pill)<PillProps>`
  background: var(--grey800);
  color: var(--grey100);

  &:hover {
    color: white;
    background: var(--grey300);
  }
`;

export const PillAccentLight = styled(Pill)<PillProps>`
  background: var(--accent400);
  color: var(--grey100);

  &:hover {
    color: #fff;
    background: var(--accent300);
  }
`;

export const PillAccentLightOutlined = styled(Pill)<PillProps>`
  border: 1px solid var(--accent300);
  color: var(--accent200);

  &:hover {
    color: #fff;
    background: var(--accent300);
  }
`;

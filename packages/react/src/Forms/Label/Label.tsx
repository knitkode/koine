import styled from "styled-components";

export const label = `
  display: flex;
  font-size: 13px;
  cursor: pointer;
`;

export const labelMaterial = `
  z-index: 2;
  position: relative;
  display: inline-block;
  padding: 0 5px;
  font-weight: 100;
  font-size: 10px;
  background: var(--bodyBg);
  transform: translateY(-0.3em) translateX(1em);
  cursor: pointer;

  + * {
    margin-top: -1em;
  }
`;

export const Label = styled.label`
  ${labelMaterial}
`;

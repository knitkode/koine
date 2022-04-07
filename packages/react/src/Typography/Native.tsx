import styled from "styled-components";
import { min } from "../styles/media";

export const p = `
  margin: 0 0 1em 0;
`;

export const h1 = `
  margin: 0 0 10px 0;
  font-size: 30px;
  font-weight: 800;
  line-height: var(--headingsLineHeight);
  ${min.md} {
    font-size: 50px;
  }
`;

export const h2 = `
  margin: 0 0 1em 0;
  font-size: 24px;
  font-weight: 800;
  line-height: var(--headingsLineHeight);
`;

export const h3 = `
  margin: 0 0 1em 0;
  font-size: 20px;
  font-weight: 600;
  line-height: var(--headingsLineHeight);
`;

export const h4 = `
  margin: 0 0 1em 0;
  font-size: 13px;
  font-weight: 600;
  line-height: var(--headingsLineHeight);
`;

export const P = styled.div`
  ${p}
`;

export const H1 = styled.div`
  ${h1}
`;

export const H2 = styled.div`
  ${h2}
`;

export const H3 = styled.div`
  ${h3}
`;

export const H4 = styled.div`
  ${h4}
`;

import styled from "styled-components";

export const BodyRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

/**
 * If you have background graphics to overlap you might need to add:
 *
 * ```css
 * z-index: 1;
 * position: relative;
 * ```
 */
export const BodyMain = styled.main`
  flex: 1;
`;

import styled from "styled-components";

export const MenuItem = styled.li<{ $active?: boolean; disabled?: boolean }>`
  padding: 8px 16px;

  &[aria-selected="true"] {
    background: var(--accent400);
  }

  /** DEP: this is just for MultiselectMui? */
  &.Mui-focused,
  &[data-focus="true"] {
    background: var(--accent300);
    color: white;
  }

  &:not([disabled]):hover {
    cursor: pointer;
    background: var(--accent300);
  }
`;

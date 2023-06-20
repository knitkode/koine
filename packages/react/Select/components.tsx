import { m } from "framer-motion";
import { forwardRef } from "react";
import { BsBoxArrowInDown as IconCollapse } from "react-icons/bs";
import styled from "styled-components";

export const SelectArrowStyled = styled(m.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2em;

  &:not([disabled]) {
    cursor: pointer;
  }
`;

export type SelectArrowProps = {
  isOpen?: boolean;
};

export const SelectArrow = forwardRef<HTMLSpanElement, SelectArrowProps>(
  function SelectArrow({ isOpen, ...props }, ref) {
    return (
      <SelectArrowStyled
        animate={{ rotate: isOpen ? 180 : 0 }}
        ref={ref}
        {...props}
      >
        <IconCollapse />
      </SelectArrowStyled>
    );
  }
);

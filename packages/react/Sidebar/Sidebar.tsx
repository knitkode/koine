import { useCallback, useState } from "react";
import styled from "styled-components";
import { GrFolderOpen as IconOpen } from "react-icons/gr";
import { CgCloseR as IconClose } from "react-icons/cg";
import { max, min } from "../styles/media";
import { IconButtonFab } from "../Buttons";
import { useHeader } from "../Header";

const SidebarWrapper = styled.div<{ $open: boolean; $top?: number }>`
  ${(p) =>
    `${max.md} {
      z-index: 20;
      display: flex;
      flex-direction: column;
      position: fixed;
      right: 0;
      left: var(--gutter-half);
      top: ${p.$top || 0}px;
      bottom: 0;
      padding: var(--gutter-half);
      transform: ${p.$open ? `translateX(0)` : `translateX(100%)`};
      transition: transform .18s ease-in-out, box-shadow .18s ease-in-out;
      background: white;
      box-shadow: ${
        p.$open ? `0 0 0 100vh rgba(0, 0, 0, .3)` : `0 0 100vh rgba(0, 0, 0, 0)`
      };
      will-change: transform, box-shadow;
      pointer-events: ${p.$open ? "all" : "none"}
    }`}
`;

const SidebarToggle = styled.span`
  z-index: 21;
  position: fixed;
  right: var(--gutter-half);
  bottom: var(--gutter-half);
  ${min.md} {
    display: none;
  }

  path {
    stroke: currentColor;
  }
`;

export type SidebarProps = React.PropsWithChildren<unknown>;

export const Sidebar = ({ children }: SidebarProps) => {
  const [open, setOpen] = useState(false);
  const [, , headerHeight] = useHeader();

  const handleClickToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  return (
    <>
      <SidebarToggle onClick={handleClickToggle}>
        <IconButtonFab $variant="contained">
          {open ? <IconClose /> : <IconOpen />}
        </IconButtonFab>
      </SidebarToggle>
      <SidebarWrapper $open={open} $top={headerHeight}>
        {children}
      </SidebarWrapper>
    </>
  );
};

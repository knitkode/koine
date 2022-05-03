/// <reference types="@reach/utils/dist/declarations/src/polymorphic" />

/**
 * @file
 *
 * Here we manage only "vertical" oriented tabs for now
 */
import styled from "styled-components";
import {
  Tabs as _Tabs,
  TabList as _TabList,
  Tab as _Tab,
  TabPanels as _TabPanels,
  TabPanel as _TabPanel,
  TabProps as _TabProps,
  TabsProps as _TabsProps,
  useTabsContext,
} from "@reach/tabs";
import { min } from "../styles/media";
import { UnderlineSkewed } from "../Animations/Underline";
import { btnStyleReset } from "../Buttons";

export const Tabs = styled(_Tabs)<TabsProps>`
  ${min.sm} {
    display: flex;
    ${(p) => p.$vertical && "flex-direction: column;"}
  }
`;

export type TabsProps = React.PropsWithChildren<_TabsProps> & {
  $vertical?: boolean;
};

export const TabList = styled(_TabList)`
  display: flex;
  flex-direction: column;
  ${min.sm} {
    border-right: 1px solid var(--grey800);
  }
`;

export const TabWrap = styled(_Tab)<TabProps & TabStyledProps>`
  ${btnStyleReset}
  position: relative;
  justify-content: flex-end;
  padding: 0.7em;
  margin-bottom: 1em;
  font-weight: bold;
  color: ${(p) => (p.$active ? "var(--accent200)" : "var(--grey300)")};
  ${min.sm} {
    padding-right: var(--gutter-half);
  }

  &:hover {
    color: ${(p) => (p.$active ? "var(--accent200)" : "var(--accent300)")};
  }
`;

export const TabText = styled.span<TabStyledProps>`
  position: relative;
  z-index: 1;
`;

export const TabUnderline = styled(UnderlineSkewed)<TabStyledProps>``;

export type TabStyledProps = {
  $active: boolean;
  $focused: boolean;
};

export type TabProps = _TabProps & {
  idx: number;
};

export const Tab = ({ children, ...props }: TabProps) => {
  const { selectedIndex, focusedIndex } = useTabsContext();
  const styledProps = {
    $active: props.idx === selectedIndex,
    $focused: props.idx === focusedIndex,
  };

  return (
    <TabWrap {...props} {...styledProps}>
      {styledProps.$active && (
        <TabUnderline {...styledProps} layoutId="Tab-underline" />
      )}
      <TabText {...styledProps}>{children}</TabText>
    </TabWrap>
  );
};

export const TabPanels = styled(_TabPanels)`
  flex: 1;
`;

export const TabPanel = styled(_TabPanel)`
  ${min.sm} {
    padding-left: var(--gutter-half);
  }
`;

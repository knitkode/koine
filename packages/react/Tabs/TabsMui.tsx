import { forwardRef } from "react";
import TabsUnstyled, { type TabsUnstyledProps } from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import { type MotionProps } from "framer-motion";
import {
  extendComponent,
  // type OverridableComponents,
  type WithComponents,
  type Simplify,
} from "../helpers";

type ReducedTabsUnstyledProps = Omit<
  TabsUnstyledProps,
  "components" | "componentsProps"
>;

export type OwnProps = React.PropsWithChildren<
  ReducedTabsUnstyledProps & {
    // mTab?: MotionProps;
  }
>;

export type Components = {
  Root: {
    type: typeof TabsUnstyled;
    props: React.PropsWithChildren<ReducedTabsUnstyledProps>;
  };
  List: {
    type: typeof TabsListUnstyled;
    props: React.PropsWithChildren<Pick<OwnProps, "onChange">>;
  };
  Tab: {
    type: typeof TabUnstyled;
    props: React.PropsWithChildren<
      {
        "aria-label": string;
      } & Pick<OwnProps, "onChange">
    >;
    motionable: true;
  };
  Panel: {
    type: typeof TabPanelUnstyled;
    props: React.PropsWithChildren<{ onClick: OwnProps["onChange"] }>;
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

export type Props = Simplify<WithComponents<OwnProps, Components>>;

export type TabsProps = Props;

export type KoineTabsProps = Props;

export const Root = "div" as unknown as Props["Root"];
export const List = "nav" as unknown as Props["List"];
export const Tab = "div" as unknown as Props["Tab"];
export const Panel = "div" as unknown as Props["Panel"];

/**
 *
 * Main differences from [Mui Tabs](https://mui.com/material-ui/react-dialog):
 *
 *
 * FIXME: it actually works even without forwardRef, check if we do need it
 */
const TabsWithRef = forwardRef<HTMLDivElement, KoineTabsProps>(function Tabs(
  {
    children,
    title,
    Root: _Root,
    List: _List,
    Tab: _Tab,
    Panel: _Panel,
    onChange,
    ...props
  },
  ref
) {
  return <Root>{children}</Root>;
});

export const KoineTabs = extendComponent(TabsWithRef, {
  Root,
  List,
  Tab,
  Panel,
});

// export default Tabs;

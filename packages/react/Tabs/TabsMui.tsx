import { forwardRef } from "react";
import TabsUnstyled, { type TabsUnstyledProps } from "@mui/base/TabsUnstyled";
import TabsListUnstyled, {
  TabsListUnstyledProps,
} from "@mui/base/TabsListUnstyled";
import TabUnstyled, { TabUnstyledProps, useTab } from "@mui/base/TabUnstyled";
import TabPanelUnstyled, {
  TabPanelUnstyledProps,
} from "@mui/base/TabPanelUnstyled";
import { type MotionProps } from "framer-motion";
import { type Simplify } from "@koine/utils";
import {
  extendComponent,
  // type OverridableComponents,
  type WithComponents,
} from "../helpers";

type ReducedTabsUnstyledProps = Omit<
  TabsUnstyledProps,
  "component" | "slots" | "slotProps"
>;

export type OwnProps = React.PropsWithChildren<
  ReducedTabsUnstyledProps & {
    mTab?: MotionProps;
  }
>;

export type Components = {
  Root: {
    type: typeof TabsUnstyled;
    props: React.PropsWithChildren<ReducedTabsUnstyledProps>;
  };
  List: {
    // type: "div";
    // props: React.PropsWithChildren<{}>;
    type: typeof TabsListUnstyled;
    props: TabsListUnstyledProps;
  };
  Tab: {
    type: typeof TabUnstyled;
    props: TabUnstyledProps & {
      Indicator?: Props["Indicator"];
    };
    motionable: true;
  };
  Indicator: {
    type: "span";
    props: React.PropsWithChildren<
      Pick<ReturnType<typeof useTab>, "active" | "disabled" | "selected">
    >;
    motionable: true;
  };
  Panel: {
    type: typeof TabPanelUnstyled;
    props: TabPanelUnstyledProps;
  };
};

export type ComponentsProps = {
  [Name in keyof Components]: Components[Name]["props"];
};

export type Props = Simplify<WithComponents<OwnProps, Components>>;

export type TabsProps = Props;

export type KoineTabsProps = Props;

export const Root = TabsUnstyled as unknown as Props["Root"];
export const List = TabsListUnstyled as unknown as Props["List"];
// export const Tab = TabUnstyled as unknown as Props["Tab"];
export const Indicator = "span" as unknown as Props["Indicator"];
export const Panel = TabPanelUnstyled as unknown as Props["Panel"];

export const Tab = forwardRef(function Tab(
  {
    children,
    component,
    slotProps,
    slots,
    Indicator,
    ...props
  }: Components["Tab"]["props"],
  ref
) {
  const { active, disabled, selected } = useTab({ ...props, ref });
  const indicatorProps = { active, disabled, selected };

  return (
    <TabUnstyled /* ref={ref}  */ {...props}>
      {children}
      {Indicator && <Indicator {...indicatorProps} />}
    </TabUnstyled>
  );
});

/**
 *
 * Main differences from [Mui Tabs](https://mui.com/material-ui/react-dialog):
 *
 * @resources
 * - [WAI-ARIA](https://www.w3.org/TR/wai-aria-practices/#tabpanel)
 * - [WAI-ARIA example](https://www.w3.org/TR/wai-aria-practices/examples/tabs/tabs-1/tabs.html)
 * - [[Proposal] New tags tabsection, tablist, tab, tabpanel](https://github.com/whatwg/html/issues/1809)
 * - [Native <tab> elements](https://github.com/w3c/html/issues/1704)
 * - [Let's talk about Native HTML Tabs](https://daverupert.com/2021/10/native-html-tabs/)
 *
 * @similar
 * - [Zertz/react-headless-tabs](https://github.com/Zertz/react-headless-tabs)
 *
 * FIXME: it actually works even without forwardRef, check if we do need it
 */
const TabsWithRef = forwardRef<HTMLDivElement, KoineTabsProps>(function Tabs(
  {
    Root: _Root,
    List: _List,
    Tab: _Tab,
    Indicator: _Indicator,
    Panel: _Panel,
    ...props
  },
  ref
) {
  return <Root {...props} ref={ref} />;
});

export const KoineTabs = extendComponent(TabsWithRef, {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
});

// export default Tabs;

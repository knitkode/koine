import { classed } from "../../classed";
import { extendComponent } from "../../extendComponent";
// import type { ComponentsProps } from "../TabsMui";
import * as _ from "../TabsMui";

export type { KoineTabsProps } from "../TabsMui";

export const Root = classed(_.Root)`< class="tabs`;

export const List = classed(_.List)`< class="tabsList flex`;

export const Tab = classed(
  _.Tab,
)`< class="tabsTab inline-flex items-center justify-center [-webkit-tap-highlight-color:transparent] appearance-none select-none`;

export const Indicator = classed(_.Indicator)`< class="tabsIndicator`;

export const Panel = classed(_.Panel)`< class="tabsPanel`;

export const KoineTabs = extendComponent(_.KoineTabs, {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
});

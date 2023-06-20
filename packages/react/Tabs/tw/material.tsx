import { classed, extendComponent } from "../../helpers";
import type { ComponentsProps } from "../TabsMui";
import { KoineTabs as _ } from "./bare";

export type { KoineTabsProps } from "./bare";

export const Root = classed(_.Root)`< class="`;

export const List = classed(
  _.List
)`< class="border-b-gray-200 border-b border-solid`;

export const Tab = classed<ComponentsProps["Tab"]>(
  _.Tab
)`< class="flex-col relative py-3 px-4 uppercase`; // ${p => p.selected ? "text-cyan-600" : ""}

export const Indicator = classed<ComponentsProps["Indicator"]>(
  _.Indicator
)`< class="absolute bottom-0 w-full h-[2px] ${(p) =>
  p.selected ? "bg-current" : ""}`;

export const Panel = classed(_.Panel)`< class="tabsPanel`;

export const KoineTabs = extendComponent(_, {
  Root,
  List,
  Tab,
  Indicator,
  Panel,
});

import { Story, Meta } from "@storybook/react";
import {
  StoryTabs,
  storyTabsMeta,
  storyTabsArgs,
  // decoratorFramer,
} from "@koine/stories";
import { KoineTabsProps } from "../TabsMui";
import { KoineTabs as bareComp } from "./bare";
import { KoineTabs as materialComp } from "./material";
import { classed } from "../../helpers";

export default {
  title: "Base/Tabs/Tailwind",
  ...storyTabsMeta,
} as Meta;

const bareTemplate: Story<KoineTabsProps> = (args) => {
  return <StoryTabs {...args} Tabs={bareComp} />;
};

export const bare = bareTemplate.bind({});

bare.args = storyTabsArgs;

const materialTemplate: Story<KoineTabsProps> = (args) => {
  return <StoryTabs {...args} Tabs={materialComp} />;
};

export const material = materialTemplate.bind({});

material.args = storyTabsArgs;

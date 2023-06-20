import { StoryTabs, storyTabsArgs, storyTabsMeta } from "@koine/stories";
import { Meta, Story } from "@storybook/react";
import { KoineTabs, TabsProps } from "./TabsMui";

export default {
  component: KoineTabs,
  title: "Base/Tabs",
  ...storyTabsMeta,
} as Meta;

const BareTemplate: Story<TabsProps> = (args) => {
  // return <StoryTabs {...args} Tabs={KoineTabs} />;
  return <StoryTabs {...args} Tabs={KoineTabs} />;
  // return <div><Tabs {...args} /></div>;
};

export const Bare = BareTemplate.bind({});

Bare.args = {
  ...storyTabsArgs,
};

import { Story, Meta } from "@storybook/react";
import { StoryTabs, LoremIpsum } from "@koine/stories";
import { KoineTabs, TabsProps } from "./TabsMui";

export default {
  component: KoineTabs,
  title: "Base/Tabs",
} as Meta;

const BareTemplate: Story<TabsProps> = (args) => {
  // return <StoryTabs {...args} Tabs={KoineTabs} />;
  return <StoryTabs {...args} Tabs={KoineTabs} />;
  // return <div><Tabs {...args} /></div>;
};

export const Bare = BareTemplate.bind({});

Bare.args = {
  title: "Tabs title",
  children: LoremIpsum,
};

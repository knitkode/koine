// import { Story, Meta } from "@storybook/react";
import React from "react";
import { LoremIpsum } from "./lorem";

type StoryTabsProps = {
  Tabs: any;
};

export const StoryTabs = ({ Tabs, ...props }: StoryTabsProps) => {
  return (
    <Tabs defaultValue={0} {...props}>
      <Tabs.List>
        <Tabs.Tab Indicator={Tabs.Indicator}>One</Tabs.Tab>
        <Tabs.Tab Indicator={Tabs.Indicator}>Two</Tabs.Tab>
        <Tabs.Tab Indicator={Tabs.Indicator}>Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value={0}>First content</Tabs.Panel>
      <Tabs.Panel value={1}>Second content</Tabs.Panel>
      <Tabs.Panel value={2}>Third content</Tabs.Panel>
    </Tabs>
  );
};

export const storyTabsMeta = {
  argTypes: {
    // value: {
    //   control: { type: "radio" },
    //   options: [1, 2, 3],
    //   mapping: {
    //     1: 0,
    //     2: 1,
    //     3: 2
    //   },
    // },
    children: {
      control: { type: "radio" },
      options: ["Long", "Medium", "Short"],
      mapping: {
        Long: (
          <>
            {LoremIpsum} {LoremIpsum} {LoremIpsum} {LoremIpsum} {LoremIpsum}
          </>
        ),
        Medium: LoremIpsum,
        Short: <>Just a short message</>,
      },
    },
  },
};

export const storyTabsArgs = {
  // value: 2
  // children: "Medium" as unknown as React.ReactElement,
};

// import { Story, Meta } from "@storybook/react";
import React from "react";
import { LoremIpsum } from "./lorem";

type StoryTabsProps = {
  Tabs: any;
};

export const StoryTabs = ({ Tabs, ...props }: StoryTabsProps) => {
  return (
    <>
      <h2>Tabs example</h2>
      <Tabs {...props}>
        <Tabs.List>
          <Tabs.Tab>One</Tabs.Tab>
          <Tabs.Tab>Two</Tabs.Tab>
          <Tabs.Tab>Three</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
};

export const storyTabsMeta = {
  argTypes: {
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
  title: "Tabs title",
  children: "Medium" as unknown as React.ReactElement,
  $scrollPaper: false,
};

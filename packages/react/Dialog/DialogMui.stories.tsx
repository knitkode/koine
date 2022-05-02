import { Story, Meta } from "@storybook/react";
import { StoryDialog, LoremIpsum } from "@koine/stories";
import { KoineDialog, DialogProps } from "./DialogMui";

export default {
  component: KoineDialog,
  title: "Base/Dialog",
} as Meta;

const BareTemplate: Story<DialogProps> = (args) => {
  // return <StoryDialog {...args} Dialog={KoineDialog} />;
  return <StoryDialog {...args} Dialog={KoineDialog} />;
  // return <div><Dialog {...args} /></div>;
};

export const Bare = BareTemplate.bind({});

Bare.args = {
  title: "Dialog title",
  children: LoremIpsum,
};

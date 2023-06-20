import { LoremIpsum, StoryDialog } from "@koine/stories";
import { Meta, Story } from "@storybook/react";
import { DialogProps, KoineDialog } from "./DialogMui";

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

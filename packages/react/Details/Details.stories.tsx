import { Story, Meta } from "@storybook/react";
import { StoryDetails, storyDetailsMeta } from "@koine/stories";
import { KoineDetails, DetailsProps } from "./Details";

export default {
  component: KoineDetails,
  title: "Base/Details",
  ...storyDetailsMeta,
} as Meta;

const BareTemplate: Story<DetailsProps> = (args) => {
  // return <StoryDetails {...args} Details={KoineDetails} />;
  return <StoryDetails {...args} Details={KoineDetails} />;
  // return <div><Details {...args} /></div>;
};

export const Bare = BareTemplate.bind({});

Bare.args = {
  summary: "Details summary",
  children: "Medium",
};

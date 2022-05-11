// import { Story, Meta } from "@storybook/react";
import React from "react";
import { LoremIpsum } from "./lorem";

type StoryDetailsProps = {
  Details: React.FC<any>;
};

export const StoryDetails = ({ Details, ...props }: StoryDetailsProps) => {
  return (
    <>
      <h2>Details examples</h2>
      <Details {...props} />
    </>
  );
};

export const storyDetailsMeta = {
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

export const storyDetailsArgs = {
  summary: "Details summary",
  children: "Medium" as unknown as React.ReactElement,
};

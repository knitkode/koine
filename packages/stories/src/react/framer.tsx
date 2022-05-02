import { PartialStoryFn } from "@storybook/csf";
import { ReactFramework, Args } from "@storybook/react";
import { LazyMotion, domAnimation } from "framer-motion";

export const decoratorFramer = (
  Story: PartialStoryFn<ReactFramework, Args | any>
) => (
  <LazyMotion features={domAnimation}>
    <Story />
  </LazyMotion>
);

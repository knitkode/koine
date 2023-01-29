import type { Args, StoryFn } from "@storybook/react";
import { LazyMotion, domAnimation } from "framer-motion";

export const decoratorFramer = (Story: StoryFn<Args | any>) => (
  <LazyMotion features={domAnimation}>
    <Story />
  </LazyMotion>
);

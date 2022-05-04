import { Story, Meta } from "@storybook/react";
import {
  StoryDialog,
  storyDialogMeta,
  storyDialogArgs,
  decoratorFramer,
} from "@koine/stories";
import { KoineDialogProps } from "../DialogMui.js";
import { KoineDialog as bareComp } from "./bare.js";
import { KoineDialog as materialComp } from "./material.js";
import { KoineDialog as framerComp } from "./framer.js";
import { KoineDialog as framerMaterialComp } from "./framerMaterial.js";

export default {
  title: "Base/Dialog/Styled Components",
  ...storyDialogMeta,
} as Meta;

const bareTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={bareComp} />;
};

export const bare = bareTemplate.bind({});

bare.args = storyDialogArgs;

const materialTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={materialComp} />;
};

export const material = materialTemplate.bind({});

material.args = storyDialogArgs;

const framerTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={framerComp} />;
};

export const framer = framerTemplate.bind({});

framer.decorators = [decoratorFramer];

framer.args = storyDialogArgs;

const framerMaterialTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={framerMaterialComp} />;
};

export const framerMaterial = framerMaterialTemplate.bind({});

framerMaterial.decorators = [decoratorFramer];

framerMaterial.args = storyDialogArgs;

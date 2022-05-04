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
// import { KoineDialog as elegantComp } from "./elegant.js";
import { classed } from "../..//helpers/index.js";

export default {
  title: "Base/Dialog/Tailwind",
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

const customisedTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={framerComp} />;
};

export const customised = customisedTemplate.bind({});

customised.decorators = [decoratorFramer];

customised.args = {
  ...storyDialogArgs,
  $scrollPaper: true,
  Backdrop: classed(framerComp.Backdrop)`< class="bg-sky-100/[.5]"`,
  Paper: classed(
    framerComp.Paper
  )`< class="shadow-2xl m-8 max-w-screen-sm bg-blue-500 text-white rounded-3xl"`,
  Close: classed(
    framerComp.Close
  )`< class="absolute lg:-right-8 lg:-top-8 p-4 text-4xl rounded-full bg-blue-300 hover:bg-blue-700 text-blue-800 hover:text-white"`,
  Header: classed(
    framerComp.Header
  )`< class="font-mono font-bold text-3xl p-12 pb-6`,
  Body: classed(framerComp.Body)`< class="px-12 pb-12 border-none"`,
  mPaper: {
    initial: {
      scale: 0.9,
      scaleX: 0,
    },
    animate: {
      scale: 1,
      scaleX: 1,
    },
    exit: {
      scale: 0.9,
      scaleX: 0,
    },
  },
};

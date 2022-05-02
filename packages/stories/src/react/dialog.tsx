// import { Story, Meta } from "@storybook/react";
import React, { useState } from "react";
import { LoremIpsum } from "./lorem";

type StoryDialogProps = {
  Dialog: React.FC<any>;
};

export const StoryDialog = ({ Dialog, ...props }: StoryDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-slate-600 hover:bg-slate-500 text-white py-1.5 px-6 rounded-sm"
        onClick={() => setOpen(true)}
      >
        Open
      </button>
      <Dialog {...props} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const storyDialogMeta = {
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

export const storyDialogArgs = {
  title: "Dialog title",
  children: "Medium" as unknown as React.ReactElement,
  $scrollPaper: false,
};

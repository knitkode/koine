import { StoryDialog, storyDialogArgs, storyDialogMeta } from "@koine/stories";
import { Meta, Story } from "@storybook/react";
import { KoineDialogProps } from "../DialogMui";
import { KoineDialog as bareComp } from "./bare";

export default {
  component: bareComp,
  title: "Base/Dialog/CSS",
  ...storyDialogMeta,
  decorators: [
    (Story) => (
      <>
        <style>{`
.dialog {
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.dialogRoot {
  z-index: 1300;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.dialogBackdrop {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  backdrop-filter: blur(0px);
}

.dialogContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dialogPaper {
  position: relative;
}

.dialogClose {
  position: absolute;
}

.dialogHeader {
}

.dialogBody {
}
`}</style>
        <Story />
      </>
    ),
  ],
} as Meta;

const bareTemplate: Story<KoineDialogProps> = (args) => {
  return <StoryDialog {...args} Dialog={bareComp} />;
};

export const bare = bareTemplate.bind({});

bare.args = storyDialogArgs;

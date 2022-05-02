import { Story, Meta } from "@storybook/react";
import { Alert, AlertProps } from "./Alert";

export default {
  component: Alert,
  title: "Base/Alert",
} as Meta;

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

export const bare = Template.bind({});

bare.args = {
  children: "An alert message",
};

export const danger = Template.bind({});

danger.args = {
  children: "A dangerous message",
  $danger: true,
};

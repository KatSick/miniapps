import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

import { MyButton } from "../my-button";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  argTypes: {},
  args: {
    children: "Primary",
    onClick: fn(),
  },
  component: MyButton,
  parameters: {},
  tags: ["autodocs"],
  title: "Example/Button",
} satisfies Meta<typeof MyButton>;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};

export default meta;

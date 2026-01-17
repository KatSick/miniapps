import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Input } from "./input";

test("Input renders input with surface background", async () => {
  const { getByRole } = await render(<Input placeholder="Enter text" />);
  const input = getByRole("textbox");
  await expect.element(input).toBeInTheDocument();
  await expect.element(input).toHaveClass("bg-surface");
});

test("Input applies focus styles", async () => {
  const { getByRole } = await render(<Input />);
  const input = getByRole("textbox");
  await expect.element(input).toHaveClass("focus:bg-surface-raised");
});

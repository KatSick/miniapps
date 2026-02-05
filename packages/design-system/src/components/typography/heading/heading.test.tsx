import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Heading } from "./heading";

test("Heading renders h1 with prompt prefix by default", async () => {
  const { getByRole } = await render(<Heading>Test Title</Heading>);
  const heading = getByRole("heading", { level: 1 });
  await expect.element(heading).toBeInTheDocument();
  await expect.element(heading).toHaveClass("font-mono");
});

test("Heading renders correct heading level", async () => {
  const { getByRole } = await render(<Heading level={2}>Section</Heading>);
  const heading = getByRole("heading", { level: 2 });
  await expect.element(heading).toBeInTheDocument();
});

test("Heading can hide prompt prefix", async () => {
  const { getByRole } = await render(<Heading showPrompt={false}>No Prompt</Heading>);
  const heading = getByRole("heading", { level: 1 });
  await expect.element(heading).not.toHaveClass("prompt-prefix");
});

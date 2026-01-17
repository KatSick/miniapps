import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Text } from "./text";

test("Text renders paragraph with sans font by default", async () => {
  const { getByText } = await render(<Text>Hello world</Text>);
  const text = getByText("Hello world");
  await expect.element(text).toBeInTheDocument();
  await expect.element(text).toHaveClass("font-sans");
});

test("Text renders muted variant", async () => {
  const { getByText } = await render(<Text variant="muted">Muted text</Text>);
  const text = getByText("Muted text");
  await expect.element(text).toHaveClass("text-text-muted");
});

test("Text renders small size", async () => {
  const { getByText } = await render(<Text size="small">Small text</Text>);
  const text = getByText("Small text");
  await expect.element(text).toHaveClass("text-sm");
});

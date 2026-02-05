import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Code, CodeBlock } from "./code";

test("Code renders inline code with mono font", async () => {
  const { getByText } = await render(<Code>const x = 1</Code>);
  const text = getByText("const x = 1");
  await expect.element(text).toBeInTheDocument();
  await expect.element(text).toHaveClass("font-mono");
});

test("CodeBlock renders code block with pre element", async () => {
  const { container } = await render(<CodeBlock>function test() {}</CodeBlock>);
  const pre = container.querySelector("pre");
  expect(pre).not.toBeNull();
});

test("CodeBlock shows filename when provided", async () => {
  const { getByText } = await render(<CodeBlock filename="test.ts">code</CodeBlock>);
  const filename = getByText("test.ts");
  await expect.element(filename).toBeInTheDocument();
});

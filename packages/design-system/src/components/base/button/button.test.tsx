import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from "./button";

test("button", async () => {
  const click = vi.fn();
  const { getByRole } = await render(<Button onClick={click}>Vitest</Button>);
  const buttonElement = getByRole("button");

  await buttonElement.click();

  expect(click).toHaveBeenCalled();
});

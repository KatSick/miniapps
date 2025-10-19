import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { MyButton } from "@/my-button";

test("button", async () => {
  const click = vi.fn();
  const { getByRole } = render(<MyButton onClick={click} />);
  const buttonElement = getByRole("button");

  await buttonElement.click();

  expect(click).toHaveBeenCalledOnce();
});

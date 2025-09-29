import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "@/App";

test("renders name", async () => {
  const { getByText } = render(<App />);

  await expect.element(getByText("Vite + React")).toBeInTheDocument();
});

import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "@/App";

test("renders name", async () => {
  const { getByText } = render(<App />);
  const element = await vi.waitFor(() => getByText("Vite + React"));
  expect(element).toMatchSnapshot();
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
  },
});

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: "playwright",
      instances: [{ browser: "chromium" }],
    },
  },
});

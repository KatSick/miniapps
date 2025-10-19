import { defineConfig } from "tsdown";

export default defineConfig([
  {
    copy: ["src/assets"],
    dts: true,
    entry: ["./src/index.ts"],
    platform: "browser",
  },
]);

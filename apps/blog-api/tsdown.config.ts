import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: false,
    entry: ["./src/main.ts"],
    platform: "node",
  },
]);

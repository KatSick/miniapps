import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: false,
    entry: ["./src/main.ts"],
    inlineOnly: false,
    noExternal: [/.*/],
    platform: "node",
  },
]);

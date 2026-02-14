import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: true,
    entry: ["./src/browser/index.ts", "./src/node/index.ts"],
  },
]);

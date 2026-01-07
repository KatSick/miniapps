import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {
      "/otlp": {
        rewrite: (path) => path.replace(/^\/otlp/, ""),
        target: "http://localhost:4318",
      },
    },
  },
});

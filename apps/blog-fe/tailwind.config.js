import { readFile } from "node:fs/promises";

const tsconfig = await readFile("./tsconfig.json");
const config = JSON.parse(tsconfig);

export default {
  content: config.references.map((ref) => `${ref.path}/**/*.{js,ts,jsx,tsx}`),
};

import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

import { MyApi } from "@miniapps/blog-shared";

const el = document.querySelector("#root");

// oxlint-disable-next-line no-console
console.log(MyApi);

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

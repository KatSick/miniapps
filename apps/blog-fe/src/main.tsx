import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { init } from "./web-vitals";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

// oxlint-disable-next-line no-floating-promises
init();

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

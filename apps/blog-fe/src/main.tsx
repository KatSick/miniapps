import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

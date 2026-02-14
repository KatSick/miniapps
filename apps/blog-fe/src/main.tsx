import "./index.css";

import { grabWebVitals } from "@miniapps/telemetry/browser";
import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { customRuntime } from "./runtime";

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

void customRuntime.runPromise(grabWebVitals());

createRoot(el).render(<App />);

import "./index.css";

import { initTracing } from "@miniapps/telemetry/browser";
import { createRoot } from "react-dom/client";

import { name, version } from "@/package.json";

import { App } from "./app-entry";

initTracing({ serviceName: name, serviceVersion: version });

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

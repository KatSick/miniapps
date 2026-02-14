import { initTracing } from "@miniapps/telemetry";
import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { name, version } from "@/package.json";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

initTracing({ serviceName: name, serviceVersion: version });

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

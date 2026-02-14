import { initTracing } from "@miniapps/telemetry";
import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { name, version } from "@/package.json";
// oxlint-disable-next-line import/no-unassigned-import -- main css import
import "./index.css";

// oxlint-disable-next-line no-unsafe-call -- cross-package type resolution
initTracing({ serviceName: name, serviceVersion: version });

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);

import type { TelemetryConfig } from "./tracing";

import { createWebSdkLayer } from "./tracing";
import { reportWebVitals } from "./web-vitals";

export const initTracing = (config: TelemetryConfig): void => {
  const layer = createWebSdkLayer(config);
  // oxlint-disable-next-line no-floating-promises
  reportWebVitals(layer);
};

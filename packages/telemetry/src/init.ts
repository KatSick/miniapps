import type { TelemetryConfig } from "./tracing";

import { reportWebVitals } from "./browser/web-vitals";
import { createWebSdkLayer } from "./tracing";

export const initTracing = (config: TelemetryConfig): void => {
  const layer = createWebSdkLayer(config);
  void reportWebVitals(layer);
};

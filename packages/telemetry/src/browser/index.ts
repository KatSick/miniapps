import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { WebSdk } from "@effect/opentelemetry";

import type { TelemetryConfig } from "@/config";

import { createOtlpConfig } from "@/config";

import { reportWebVitals } from "./web-vitals";

const createWebSdkLayer = (config: TelemetryConfig): Layer.Layer<Resource> =>
  WebSdk.layer(() => createOtlpConfig(config));

const initTracing = (config: TelemetryConfig): void => {
  const layer = createWebSdkLayer(config);
  void reportWebVitals(layer);
};

export { createWebSdkLayer, initTracing, type TelemetryConfig };

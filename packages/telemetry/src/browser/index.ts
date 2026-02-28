import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { WebSdk } from "@effect/opentelemetry";

import type { TelemetryConfig } from "@/config";

import { createOtlpConfig } from "@/config";

const createWebSdkLayer = (config: Readonly<TelemetryConfig>): Layer.Layer<Resource> =>
  WebSdk.layer(() => createOtlpConfig(config));

export { grabWebVitals } from "./web-vitals";
export { createWebSdkLayer, type TelemetryConfig };

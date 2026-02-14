import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { NodeSdk } from "@effect/opentelemetry";

import type { TelemetryConfig } from "@/config";

import { createOtlpConfig } from "@/config";

const createNodeSdkLayer = (config: TelemetryConfig): Layer.Layer<Resource> =>
  NodeSdk.layer(() => createOtlpConfig(config));

export { createNodeSdkLayer, type TelemetryConfig };

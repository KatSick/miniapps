import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { WebSdk } from "@effect/opentelemetry";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { Duration } from "effect";

const DEFAULT_ENDPOINT = "/otlp";
const DEFAULT_METRIC_INTERVAL_MS = Duration.toMillis(Duration.minutes(5));
const DEFAULT_ENVIRONMENT = "local";

export interface TelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  endpoint?: string;
  metricIntervalMs?: number;
  environment?: string;
}

export const createWebSdkLayer = (config: TelemetryConfig): Layer.Layer<Resource> => {
  const endpoint = config.endpoint ?? DEFAULT_ENDPOINT;
  const metricIntervalMs = config.metricIntervalMs ?? DEFAULT_METRIC_INTERVAL_MS;
  const environment = config.environment ?? DEFAULT_ENVIRONMENT;

  return WebSdk.layer(() => ({
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: `${endpoint}/v1/logs`,
      }),
    ),
    metricReader: new PeriodicExportingMetricReader({
      exportIntervalMillis: metricIntervalMs,
      exporter: new OTLPMetricExporter({
        url: `${endpoint}/v1/metrics`,
      }),
    }),
    resource: {
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
    },
    spanProcessor: new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: `${endpoint}/v1/traces`,
      }),
    ),
  }));
};

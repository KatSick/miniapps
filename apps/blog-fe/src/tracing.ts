import { WebSdk } from "@effect/opentelemetry";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from "@opentelemetry/semantic-conventions/incubating";
import { Duration } from "effect";

import { name, version } from "../package.json";

export const WebSdkLive = WebSdk.layer(() => ({
  logRecordProcessor: new BatchLogRecordProcessor(
    new OTLPLogExporter({
      url: "/otlp/v1/logs",
    }),
  ),
  metricReader: new PeriodicExportingMetricReader({
    exportIntervalMillis: Duration.minutes(5).pipe(Duration.toMillis),
    exporter: new OTLPMetricExporter({
      url: `/otlp/v1/metrics`,
    }),
  }),
  resource: {
    serviceName: name,
    serviceVersion: version,
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: "local",
  },
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: "/otlp/v1/traces",
    }),
  ),
}));

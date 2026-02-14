# Telemetry Multi-Platform Refactoring Design

## Goal

Refactor `@miniapps/telemetry` for multi-platform support (browser + Node.js) and integrate telemetry into `blog-api`.

## Decisions

- **Approach:** Shared config factory + platform-specific SDK wrappers (Approach A)
- **Node OTel SDK:** `@effect/opentelemetry` only — no `sdk-trace-node`. Effect handles context propagation via fibers.
- **Telemetry signals:** Traces, metrics, and logs — all wired through Effect's OpenTelemetry layers.
- **blog-api integration:** Effect Layer composition — provide telemetry layer at the top level. No explicit HTTP middleware.
- **Node API:** `createNodeSdkLayer(config)` returns an Effect `Layer`. Browser keeps imperative `initTracing()`.
- **Package structure:** Multiple entry points in one package via `package.json` exports. No separate packages.

## Package Structure

```
packages/telemetry/
  src/
    config.ts              # Shared TelemetryConfig type + createOtlpConfig()
    browser/
      index.ts             # createWebSdkLayer(), initTracing(), re-exports config type
      web-vitals.ts        # Web vitals collection (moved from src/web-vitals.ts)
    node/
      index.ts             # createNodeSdkLayer() — returns Effect Layer
  tests/
    config.test.ts         # createOtlpConfig returns expected shape
    browser.test.ts        # createWebSdkLayer returns Layer
    node.test.ts           # createNodeSdkLayer returns Layer
```

### Entry Points

```json
{
  "exports": {
    "./browser": "./dist/browser/index.js",
    "./node": "./dist/node/index.js"
  }
}
```

Bare `@miniapps/telemetry` import goes away. Consumers must pick a platform.

### tsdown.config.ts

- Entry points: `src/browser/index.ts`, `src/node/index.ts`
- Remove `platform: "browser"` — let it be neutral
- Keep `format: "esm"`, `dts: true`

## Shared Config (`src/config.ts`)

```typescript
export interface TelemetryConfig {
  serviceName: string;
  serviceVersion?: string;
  endpoint?: string; // default: "/otlp"
  metricIntervalMs?: number; // default: 300_000 (5 min)
  environment?: string; // default: "development"
}

export const createOtlpConfig = (config: TelemetryConfig) => {
  const endpoint = config.endpoint ?? "/otlp";
  const metricIntervalMs = config.metricIntervalMs ?? 300_000;
  const environment = config.environment ?? "development";

  return {
    spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter({ url: `${endpoint}/v1/traces` })),
    metricReader: new PeriodicExportingMetricReader({
      exportIntervalMillis: metricIntervalMs,
      exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
    }),
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({ url: `${endpoint}/v1/logs` }),
    ),
    resource: {
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
    },
  };
};
```

## Browser Entry Point (`src/browser/index.ts`)

```typescript
export const createWebSdkLayer = (config: TelemetryConfig) =>
  WebSdk.layer(() => createOtlpConfig(config));

export const initTracing = (config: TelemetryConfig): void => {
  const layer = createWebSdkLayer(config);
  void reportWebVitals(layer);
};
```

`web-vitals.ts` moves from `src/web-vitals.ts` unchanged.

## Node Entry Point (`src/node/index.ts`)

```typescript
export const createNodeSdkLayer = (config: TelemetryConfig) =>
  NodeSdk.layer(() => createOtlpConfig(config));
```

## Blog API Integration

**`apps/blog-api/package.json`:** Add `@miniapps/telemetry: workspace:*`.

**`apps/blog-api/src/main.ts`:**

```typescript
import { createNodeSdkLayer } from "@miniapps/telemetry/node";

const TelemetryLive = createNodeSdkLayer({
  serviceName: name,
  serviceVersion: version,
  endpoint: process.env["OTEL_ENDPOINT"] ?? "http://localhost:4318",
});

const ServerLive = BlogApiLive.pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
  Layer.provide(TelemetryLive),
);

Layer.launch(ServerLive).pipe(NodeRuntime.runMain);
```

## Blog FE Impact

Import path change only:

```diff
-import { initTracing } from "@miniapps/telemetry";
+import { initTracing } from "@miniapps/telemetry/browser";
```

## Files Deleted

| Old                 | New                                                 |
| ------------------- | --------------------------------------------------- |
| `src/index.ts`      | deleted                                             |
| `src/init.ts`       | deleted                                             |
| `src/tracing.ts`    | split into `src/config.ts` + `src/browser/index.ts` |
| `src/web-vitals.ts` | moved to `src/browser/web-vitals.ts`                |
| —                   | new `src/node/index.ts`                             |

## Dependencies

No new dependencies. Existing deps cover everything:

- `@effect/opentelemetry` (has both `NodeSdk` and `WebSdk`)
- `@opentelemetry/sdk-trace-base`, `sdk-metrics`, `sdk-logs`
- All three OTLP HTTP exporters
- `web-vitals` (only imported by browser entry point)

**blog-api** adds `@miniapps/telemetry: workspace:*`.

## Tests

Smoke tests verifying layer construction:

- `tests/config.test.ts` — `createOtlpConfig` returns expected shape
- `tests/browser.test.ts` — `createWebSdkLayer` returns an Effect Layer
- `tests/node.test.ts` — `createNodeSdkLayer` returns an Effect Layer

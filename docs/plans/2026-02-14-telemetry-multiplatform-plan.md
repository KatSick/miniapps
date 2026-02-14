# Telemetry Multi-Platform Refactoring Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor `@miniapps/telemetry` into multi-platform entry points (browser/node) and integrate telemetry into blog-api.

**Architecture:** Extract shared OTLP config factory from existing browser code. Create `./browser` and `./node` entry points that wrap `WebSdk.layer()` and `NodeSdk.layer()` respectively. Wire node telemetry into blog-api via Effect Layer composition.

**Tech Stack:** Effect, @effect/opentelemetry (WebSdk, NodeSdk), @opentelemetry/\* OTLP exporters, web-vitals, tsdown, Vitest

---

### Task 1: Create shared config module

**Files:**

- Create: `packages/telemetry/src/config.ts`

**Step 1: Write the failing test**

Create `packages/telemetry/tests/config.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import { createOtlpConfig } from "@/config";

describe("createOtlpConfig", () => {
  it("returns spanProcessor, metricReader, logRecordProcessor, and resource", () => {
    const config = createOtlpConfig({
      serviceName: "test-service",
      serviceVersion: "1.0.0",
    });

    expect(config).toHaveProperty("spanProcessor");
    expect(config).toHaveProperty("metricReader");
    expect(config).toHaveProperty("logRecordProcessor");
    expect(config).toHaveProperty("resource");
    expect(config.resource.serviceName).toBe("test-service");
    expect(config.resource.serviceVersion).toBe("1.0.0");
  });

  it("uses default endpoint /otlp when not specified", () => {
    const config = createOtlpConfig({
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(config.resource.serviceName).toBe("test");
  });

  it("uses custom endpoint when specified", () => {
    const config = createOtlpConfig({
      serviceName: "test",
      serviceVersion: "1.0.0",
      endpoint: "http://localhost:4318",
    });

    expect(config.resource.serviceName).toBe("test");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: FAIL — `createOtlpConfig` not found

**Step 3: Write the implementation**

Create `packages/telemetry/src/config.ts`:

```typescript
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

export const createOtlpConfig = (config: TelemetryConfig) => {
  const endpoint = config.endpoint ?? DEFAULT_ENDPOINT;
  const metricIntervalMs = config.metricIntervalMs ?? DEFAULT_METRIC_INTERVAL_MS;
  const environment = config.environment ?? DEFAULT_ENVIRONMENT;

  return {
    logRecordProcessor: new BatchLogRecordProcessor(
      new OTLPLogExporter({ url: `${endpoint}/v1/logs` }),
    ),
    metricReader: new PeriodicExportingMetricReader({
      exportIntervalMillis: metricIntervalMs,
      exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
    }),
    resource: {
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: environment,
    },
    spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter({ url: `${endpoint}/v1/traces` })),
  };
};
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: PASS

**Step 5: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add packages/telemetry/src/config.ts packages/telemetry/tests/config.test.ts
git commit -m "feat(telemetry): extract shared OTLP config module"
```

---

### Task 2: Create browser entry point

**Files:**

- Create: `packages/telemetry/src/browser/index.ts`
- Move: `packages/telemetry/src/web-vitals.ts` → `packages/telemetry/src/browser/web-vitals.ts`

**Step 1: Write the failing test**

Create `packages/telemetry/tests/browser.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import { createWebSdkLayer, initTracing } from "@/browser";

describe("browser entry point", () => {
  it("exports createWebSdkLayer", () => {
    expect(createWebSdkLayer).toBeTypeOf("function");
  });

  it("exports initTracing", () => {
    expect(initTracing).toBeTypeOf("function");
  });

  it("createWebSdkLayer returns an Effect Layer", () => {
    const layer = createWebSdkLayer({
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(layer).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: FAIL — `@/browser` module not found

**Step 3: Write the implementation**

Move web-vitals (content unchanged):

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
mkdir -p packages/telemetry/src/browser
git mv packages/telemetry/src/web-vitals.ts packages/telemetry/src/browser/web-vitals.ts
```

Create `packages/telemetry/src/browser/index.ts`:

```typescript
import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { WebSdk } from "@effect/opentelemetry";

import { createOtlpConfig } from "../config";
import { reportWebVitals } from "./web-vitals";

export type { TelemetryConfig } from "../config";

export const createWebSdkLayer = (
  config: Parameters<typeof createOtlpConfig>[0],
): Layer.Layer<Resource> => WebSdk.layer(() => createOtlpConfig(config));

export const initTracing = (config: Parameters<typeof createOtlpConfig>[0]): void => {
  const layer = createWebSdkLayer(config);
  void reportWebVitals(layer);
};
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: PASS

**Step 5: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add packages/telemetry/src/browser/index.ts packages/telemetry/src/browser/web-vitals.ts packages/telemetry/tests/browser.test.ts
git commit -m "feat(telemetry): add browser entry point"
```

---

### Task 3: Create node entry point

**Files:**

- Create: `packages/telemetry/src/node/index.ts`

**Step 1: Write the failing test**

Create `packages/telemetry/tests/node.test.ts`:

```typescript
import { describe, expect, it } from "vitest";

import { createNodeSdkLayer } from "@/node";

describe("node entry point", () => {
  it("exports createNodeSdkLayer", () => {
    expect(createNodeSdkLayer).toBeTypeOf("function");
  });

  it("createNodeSdkLayer returns an Effect Layer", () => {
    const layer = createNodeSdkLayer({
      serviceName: "test",
      serviceVersion: "1.0.0",
    });

    expect(layer).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: FAIL — `@/node` module not found

**Step 3: Write the implementation**

Create `packages/telemetry/src/node/index.ts`:

```typescript
import type { Resource } from "@effect/opentelemetry/Resource";
import type { Layer } from "effect";

import { NodeSdk } from "@effect/opentelemetry";

import { createOtlpConfig } from "../config";

export type { TelemetryConfig } from "../config";

export const createNodeSdkLayer = (
  config: Parameters<typeof createOtlpConfig>[0],
): Layer.Layer<Resource> => NodeSdk.layer(() => createOtlpConfig(config));
```

**Step 4: Run test to verify it passes**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: PASS

**Step 5: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add packages/telemetry/src/node/index.ts packages/telemetry/tests/node.test.ts
git commit -m "feat(telemetry): add node entry point"
```

---

### Task 4: Update package.json and tsdown config

**Files:**

- Modify: `packages/telemetry/package.json`
- Modify: `packages/telemetry/tsdown.config.ts`

**Step 1: Update tsdown.config.ts**

Replace the contents of `packages/telemetry/tsdown.config.ts` with:

```typescript
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: true,
    entry: ["./src/browser/index.ts", "./src/node/index.ts"],
  },
]);
```

Note: `platform` removed — no longer browser-only.

**Step 2: Update package.json exports**

Replace the `exports` field in `packages/telemetry/package.json`:

```json
{
  "exports": {
    "./browser": {
      "types": "./dist/browser/index.d.ts",
      "import": "./dist/browser/index.js"
    },
    "./node": {
      "types": "./dist/node/index.d.ts",
      "import": "./dist/node/index.js"
    },
    "./package.json": "./package.json"
  }
}
```

Remove the `"."` export — consumers must pick a platform.

Also remove `@opentelemetry/sdk-trace-web` from dependencies since it's no longer directly imported (WebSdk from @effect/opentelemetry handles it internally).

**Step 3: Run all telemetry tests**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: All PASS

**Step 4: Run build**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:build`
Expected: Build succeeds, produces `dist/browser/` and `dist/node/` directories

**Step 5: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add packages/telemetry/package.json packages/telemetry/tsdown.config.ts
git commit -m "feat(telemetry): configure multi-platform entry points"
```

---

### Task 5: Delete old source files

**Files:**

- Delete: `packages/telemetry/src/index.ts`
- Delete: `packages/telemetry/src/init.ts`
- Delete: `packages/telemetry/src/tracing.ts`

**Step 1: Delete the old files**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
rm packages/telemetry/src/index.ts packages/telemetry/src/init.ts packages/telemetry/src/tracing.ts
```

**Step 2: Run tests to verify nothing broke**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:test`
Expected: All PASS (tests import from `@/config`, `@/browser`, `@/node` — not old paths)

**Step 3: Run build to verify**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx telemetry:build`
Expected: PASS

**Step 4: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add packages/telemetry/src/index.ts packages/telemetry/src/init.ts packages/telemetry/src/tracing.ts
git commit -m "refactor(telemetry): remove old single-platform source files"
```

---

### Task 6: Update blog-fe import

**Files:**

- Modify: `apps/blog-fe/src/main.tsx`

**Step 1: Update the import**

In `apps/blog-fe/src/main.tsx`, change:

```typescript
import { initTracing } from "@miniapps/telemetry";
```

to:

```typescript
import { initTracing } from "@miniapps/telemetry/browser";
```

**Step 2: Run types to verify**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx blog-fe:types`
Expected: PASS

**Step 3: Run build to verify**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx blog-fe:build`
Expected: PASS

**Step 4: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add apps/blog-fe/src/main.tsx
git commit -m "refactor(blog-fe): update telemetry import to browser entry point"
```

---

### Task 7: Add telemetry to blog-api

**Files:**

- Modify: `apps/blog-api/package.json`
- Modify: `apps/blog-api/src/main.ts`

**Step 1: Add telemetry dependency**

Add `"@miniapps/telemetry": "workspace:*"` to `dependencies` in `apps/blog-api/package.json`.

**Step 2: Install dependencies**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && pnpm install`

**Step 3: Update main.ts**

Replace `apps/blog-api/src/main.ts` with:

```typescript
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { createNodeSdkLayer } from "@miniapps/telemetry/node";
import { Layer } from "effect";
import { createServer } from "node:http";

import { name, version } from "@/package.json";
import { BlogApiLive } from "@/server";

// oxlint-disable-next-line node/no-process-env -- Entry point reads PORT from environment
const port = Number(process.env["PORT"] ?? 3001);

// oxlint-disable-next-line node/no-process-env -- Entry point reads OTEL_ENDPOINT from environment
const otelEndpoint = process.env["OTEL_ENDPOINT"] ?? "http://localhost:4318";

const TelemetryLive = createNodeSdkLayer({
  serviceName: name,
  serviceVersion: version,
  endpoint: otelEndpoint,
});

const ServerLive = BlogApiLive.pipe(
  Layer.provide(NodeHttpServer.layer(createServer, { port })),
  Layer.provide(TelemetryLive),
);

Layer.launch(ServerLive).pipe(NodeRuntime.runMain);
```

**Step 4: Run types to verify**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx blog-api:types`
Expected: PASS

**Step 5: Run build to verify**

Run: `cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx blog-api:build`
Expected: PASS

**Step 6: Commit**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add apps/blog-api/package.json apps/blog-api/src/main.ts
git commit -m "feat(blog-api): integrate telemetry via node entry point"
```

---

### Task 8: Full verification

**Step 1: Run full CI checks**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api && moonx :test :lint :fmt :build :types
```

Expected: All PASS

**Step 2: Fix any issues found**

Address lint, format, type, or test failures.

**Step 3: Commit any fixes**

```bash
cd /Users/katsick/Projects/miniapps/.worktrees/blog-api
git add <fixed-files>
git commit -m "fix(telemetry): address CI feedback"
```

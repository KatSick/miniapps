# Codegen Templates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Moon codegen templates for apps and packages, extract `@miniapps/telemetry` from blog-fe, verify everything works.

**Architecture:** Three deliverables — (1) telemetry package extracted from blog-fe, (2) updated package template, (3) new app template. All leverage Moon's tag-based task inheritance so templates stay minimal. Tera templating only where variable interpolation is needed; static files elsewhere.

**Tech Stack:** Moon codegen (Tera templates), tsdown, Effect + OpenTelemetry, Vite + React, Vitest

**Worktree:** `/Users/katsick/Projects/miniapps/.worktrees/codegen-templates` (branch: `feat/codegen-templates`)

---

## Task 1: Enable Moon codegen templates path

**Files:**

- Modify: `.moon/workspace.yml`

**Step 1: Add generator.templates config**

Add to `.moon/workspace.yml` after the `$schema` line:

```yaml
generator:
  templates:
    - ./templates
```

**Step 2: Commit**

```bash
git add .moon/workspace.yml
git commit -m "chore: configure moon codegen templates path"
```

---

## Task 2: Create `@miniapps/telemetry` package — scaffold

**Files:**

- Create: `packages/telemetry/package.json`
- Create: `packages/telemetry/moon.yml`
- Create: `packages/telemetry/tsconfig.json`
- Create: `packages/telemetry/tsdown.config.ts`
- Create: `packages/telemetry/.oxlintrc.json`
- Create: `packages/telemetry/src/index.ts` (empty placeholder)

**Step 1: Create package.json**

```json
{
  "name": "@miniapps/telemetry",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./package.json": "./package.json"
  },
  "dependencies": {
    "@effect/opentelemetry": "catalog:",
    "@opentelemetry/exporter-logs-otlp-http": "catalog:",
    "@opentelemetry/exporter-metrics-otlp-http": "catalog:",
    "@opentelemetry/exporter-trace-otlp-http": "catalog:",
    "@opentelemetry/sdk-logs": "catalog:",
    "@opentelemetry/sdk-metrics": "catalog:",
    "@opentelemetry/sdk-trace-base": "catalog:",
    "@opentelemetry/sdk-trace-web": "catalog:",
    "@opentelemetry/semantic-conventions": "catalog:",
    "effect": "catalog:",
    "web-vitals": "catalog:"
  },
  "peerDependencies": {
    "effect": "catalog:"
  }
}
```

**Step 2: Create moon.yml**

```yaml
language: typescript
tags:
  - tsdown
layer: library
```

Note: No vitest tag yet — tests will be added in a later task if needed. The telemetry package is primarily configuration wiring, not logic-heavy code that benefits from unit tests.

**Step 3: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.options.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/package.json": ["./package.json"]
    },
    "noEmit": false,
    "outDir": "../../.moon/cache/types/packages/telemetry"
  },
  "include": ["src"]
}
```

**Step 4: Create tsdown.config.ts**

```ts
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: true,
    entry: ["./src/index.ts"],
    platform: "browser",
  },
]);
```

**Step 5: Create .oxlintrc.json**

```json
{
  "$schema": "../../node_modules/oxlint/configuration_schema.json",
  "extends": ["../../.oxlintrc.json"],
  "overrides": [
    {
      "files": ["src/**/*"],
      "env": {
        "browser": true
      }
    }
  ]
}
```

**Step 6: Create src/index.ts**

```ts
export {};
```

**Step 7: Run pnpm install and verify build**

```bash
pnpm install
moonx telemetry:build
```

Expected: Build succeeds, produces `dist/index.js` and `dist/index.d.ts`.

**Step 8: Commit**

```bash
git add packages/telemetry
git commit -m "feat: scaffold @miniapps/telemetry package"
```

---

## Task 3: Implement telemetry package — createWebSdkLayer

**Files:**

- Create: `packages/telemetry/src/tracing.ts`
- Modify: `packages/telemetry/src/index.ts`

**Step 1: Create src/tracing.ts**

This is extracted from `apps/blog-fe/src/tracing.ts` but parameterized:

```ts
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

export const createWebSdkLayer = (config: TelemetryConfig) => {
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
```

**Step 2: Update src/index.ts**

```ts
export { createWebSdkLayer } from "./tracing";
export type { TelemetryConfig } from "./tracing";
```

**Step 3: Verify build**

```bash
moonx telemetry:build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add packages/telemetry/src
git commit -m "feat(telemetry): implement createWebSdkLayer"
```

---

## Task 4: Implement telemetry package — reportWebVitals

**Files:**

- Create: `packages/telemetry/src/web-vitals.ts`
- Modify: `packages/telemetry/src/index.ts`

**Step 1: Create src/web-vitals.ts**

Extracted from `apps/blog-fe/src/web-vitals.ts` but parameterized to accept a layer:

```ts
// oxlint-disable no-magic-numbers
import type { Metric as WebVitalMetric } from "web-vitals";
import type { Layer } from "effect/Layer";

import { Effect, Fiber, Match, Metric, MetricBoundaries } from "effect";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

const lcpMetric = Metric.histogram("lcp", MetricBoundaries.fromIterable([0, 2500, 4000, 6000]));
const inpMetric = Metric.histogram("inp", MetricBoundaries.fromIterable([0, 200, 500, 1000]));
const ttfbMetric = Metric.histogram("ttfb", MetricBoundaries.fromIterable([0, 200, 500, 1000]));
const fcpMetric = Metric.histogram("fcp", MetricBoundaries.fromIterable([0, 1800, 3000, 5000]));

const clsMetric = Metric.gauge("cls");

const reportMetric = Effect.fn("reportMetric")(function* reportMetric(metric: WebVitalMetric) {
  yield* Match.value(metric.name).pipe(
    Match.when("LCP", () => lcpMetric(Effect.succeed(metric.value))),
    Match.when("INP", () => inpMetric(Effect.succeed(metric.value))),
    Match.when("TTFB", () => ttfbMetric(Effect.succeed(metric.value))),
    Match.when("FCP", () => fcpMetric(Effect.succeed(metric.value))),
    Match.when("CLS", () => clsMetric(Effect.succeed(metric.value))),
    Match.exhaustive,
  );
});

const createWebVitalEffect = (
  callback: (onReport: (metric: WebVitalMetric) => void) => void,
): Effect.Effect<void> =>
  Effect.async((resume) => {
    callback((value) => {
      resume(reportMetric(value));
    });
  });

const grabWebVitals = Effect.fn("grabWebVitals")(function* grabWebVitals() {
  yield* Effect.log("Grabbing web vitals");

  const metrics = [
    createWebVitalEffect(onCLS),
    createWebVitalEffect(onLCP),
    createWebVitalEffect(onINP),
    createWebVitalEffect(onTTFB),
    createWebVitalEffect(onFCP),
  ];

  const fiber = yield* Effect.forkAll(metrics);
  yield* Fiber.await(fiber);
  yield* Effect.log("Web vitals completed");
});

export const reportWebVitals = async (layer: Layer.Layer<never>): Promise<void> => {
  await Effect.runPromise(grabWebVitals().pipe(Effect.provide(layer)));
};
```

**Step 2: Update src/index.ts**

```ts
export { createWebSdkLayer } from "./tracing";
export type { TelemetryConfig } from "./tracing";
export { reportWebVitals } from "./web-vitals";
```

**Step 3: Verify build**

```bash
moonx telemetry:build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add packages/telemetry/src
git commit -m "feat(telemetry): implement reportWebVitals"
```

---

## Task 5: Implement telemetry package — initTracing

**Files:**

- Create: `packages/telemetry/src/init.ts`
- Modify: `packages/telemetry/src/index.ts`

**Step 1: Create src/init.ts**

The all-in-one convenience function:

```ts
import type { TelemetryConfig } from "./tracing";

import { createWebSdkLayer } from "./tracing";
import { reportWebVitals } from "./web-vitals";

export const initTracing = (config: TelemetryConfig): void => {
  const layer = createWebSdkLayer(config);
  // oxlint-disable-next-line no-floating-promises
  reportWebVitals(layer);
};
```

**Step 2: Update src/index.ts**

```ts
export { createWebSdkLayer } from "./tracing";
export type { TelemetryConfig } from "./tracing";
export { reportWebVitals } from "./web-vitals";
export { initTracing } from "./init";
```

**Step 3: Verify build**

```bash
moonx telemetry:build
```

Expected: Build succeeds.

**Step 4: Commit**

```bash
git add packages/telemetry/src
git commit -m "feat(telemetry): implement initTracing convenience function"
```

---

## Task 6: Refactor blog-fe to use @miniapps/telemetry

**Files:**

- Delete: `apps/blog-fe/src/tracing.ts`
- Delete: `apps/blog-fe/src/web-vitals.ts`
- Modify: `apps/blog-fe/src/main.tsx`
- Modify: `apps/blog-fe/package.json`
- Modify: `apps/blog-fe/moon.yml`
- Modify: `apps/blog-fe/tsconfig.json`

**Step 1: Update moon.yml — add telemetry dependency**

```yaml
language: typescript
tasks:
  preview:
    command: docker compose up --build
    preset: server
    deps:
      - build
      - traefik:infra
      - signoz:infra
tags:
  - vite
dependsOn:
  - design-system
  - telemetry
env:
  DOMAIN_NAME: blog-fe.localhost
layer: application
```

**Step 2: Update tsconfig.json — add telemetry reference**

```json
{
  "extends": "../../tsconfig.options.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/package.json": ["./package.json"]
    },
    "outDir": "../../.moon/cache/types/apps/blog-fe",
    "plugins": [
      {
        "name": "@effect/language-service"
      }
    ]
  },
  "include": ["src", "tests", "package.json"],
  "references": [
    {
      "path": "../../packages/design-system"
    },
    {
      "path": "../../packages/telemetry"
    }
  ]
}
```

**Step 3: Update package.json — swap OTel deps for telemetry**

Remove these dependencies:

- `@effect/opentelemetry`
- `@opentelemetry/exporter-logs-otlp-http`
- `@opentelemetry/exporter-metrics-otlp-http`
- `@opentelemetry/exporter-trace-otlp-http`
- `@opentelemetry/sdk-logs`
- `@opentelemetry/sdk-metrics`
- `@opentelemetry/sdk-trace-base`
- `@opentelemetry/sdk-trace-node`
- `@opentelemetry/sdk-trace-web`
- `@opentelemetry/semantic-conventions`
- `web-vitals`

Add:

- `@miniapps/telemetry: "workspace:*"`

Keep `effect` since `app-entry.tsx` uses it directly.

Result:

```json
{
  "name": "blog-fe",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "@miniapps/design-system": "workspace:*",
    "@miniapps/telemetry": "workspace:*",
    "@radix-ui/react-slot": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "effect": "catalog:",
    "lucide-react": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "tailwind-merge": "catalog:",
    "tailwindcss": "catalog:",
    "tw-animate-css": "catalog:"
  },
  "devDependencies": {
    "@effect/language-service": "catalog:"
  }
}
```

**Step 4: Delete src/tracing.ts and src/web-vitals.ts**

```bash
rm apps/blog-fe/src/tracing.ts apps/blog-fe/src/web-vitals.ts
```

**Step 5: Update src/main.tsx**

```tsx
import { initTracing } from "@miniapps/telemetry";
import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { name, version } from "@/package.json";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

initTracing({ serviceName: name, serviceVersion: version });

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);
```

**Step 6: Run pnpm install and full verification**

```bash
pnpm install
moonx :lint :fmt :types :build :test
```

Expected: All tasks pass. blog-fe tests still pass.

**Step 7: Commit**

```bash
git add -A
git commit -m "refactor(blog-fe): use @miniapps/telemetry package"
```

---

## Task 7: Update package template

**Files:**

- Modify: `templates/package/template.yml`
- Modify: `templates/package/package.json.tera`
- Create: `templates/package/moon.yml`
- Create: `templates/package/tsconfig.json.tera`
- Create: `templates/package/tsdown.config.ts`
- Create: `templates/package/vitest.config.ts`
- Create: `templates/package/.oxlintrc.json`
- Create: `templates/package/src/index.ts`
- Create: `templates/package/tests/index.test.ts`

**Step 1: Update template.yml**

```yaml
title: package
description: |
  Scaffolds a new library package with tsdown build,
  vitest browser tests, and standard project configuration.
destination: "packages/[name]"
variables:
  name:
    type: string
    default: ""
    required: true
    prompt: "Package name? (without @miniapps/ prefix)"
```

**Step 2: Update package.json.tera**

```json
{
  "name": "@miniapps/{{ name }}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./package.json": "./package.json"
  },
  "dependencies": {}
}
```

**Step 3: Create moon.yml**

```yaml
language: typescript
tags:
  - tsdown
  - vitest
layer: library
```

**Step 4: Create tsconfig.json.tera**

```json
{
  "extends": "../../tsconfig.options.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/package.json": ["./package.json"]
    },
    "noEmit": false,
    "outDir": "../../.moon/cache/types/packages/{{ name }}"
  },
  "include": ["src", "tests"]
}
```

**Step 5: Create tsdown.config.ts**

```ts
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    dts: true,
    entry: ["./src/index.ts"],
    platform: "browser",
  },
]);
```

**Step 6: Create vitest.config.ts**

```ts
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    browser: {
      enabled: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
      provider: playwright(),
    },
  },
});
```

**Step 7: Create .oxlintrc.json**

```json
{
  "$schema": "../../node_modules/oxlint/configuration_schema.json",
  "extends": ["../../.oxlintrc.json"],
  "overrides": [
    {
      "files": ["src/**/*"],
      "env": {
        "browser": true
      }
    },
    {
      "files": ["tests/**/*"],
      "env": {
        "vitest": true
      }
    }
  ]
}
```

**Step 8: Create src/index.ts**

```ts
export {};
```

**Step 9: Create tests/index.test.ts**

```ts
import { expect, test } from "vitest";

test("placeholder", () => {
  expect(true).toBe(true);
});
```

**Step 10: Commit**

```bash
git add templates/package
git commit -m "feat: update package template with full library scaffold"
```

---

## Task 8: Create app template — templated files

**Files:**

- Create: `templates/app/template.yml`
- Create: `templates/app/moon.yml.tera`
- Create: `templates/app/package.json.tera`
- Create: `templates/app/tsconfig.json.tera`
- Create: `templates/app/index.html.tera`
- Create: `templates/app/compose.yml.tera`

**Step 1: Create template.yml**

```yaml
title: app
description: |
  Scaffolds a new Vite + React application with Tailwind CSS,
  design system integration, telemetry, and deployment setup.
destination: "apps/[name]"
variables:
  name:
    type: string
    default: ""
    required: true
    prompt: "App name? (e.g. dashboard-fe)"
  title:
    type: string
    default: ""
    required: true
    prompt: "App title? (e.g. Dashboard, used in HTML <title>)"
  domain:
    type: string
    default: ""
    required: true
    prompt: "Domain prefix? (e.g. dashboard, for dashboard.localhost)"
```

**Step 2: Create moon.yml.tera**

```yaml
language: typescript
tasks:
  preview:
    command: docker compose up --build
    preset: server
    deps:
      - build
      - traefik:infra
      - signoz:infra
tags:
  - vite
dependsOn:
  - design-system
  - telemetry
env:
  DOMAIN_NAME: {{ name }}.localhost
layer: application
```

**Step 3: Create package.json.tera**

```json
{
  "name": "{{ name }}",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "@miniapps/design-system": "workspace:*",
    "@miniapps/telemetry": "workspace:*",
    "@radix-ui/react-slot": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "effect": "catalog:",
    "lucide-react": "catalog:",
    "react": "catalog:",
    "react-dom": "catalog:",
    "tailwind-merge": "catalog:",
    "tailwindcss": "catalog:",
    "tw-animate-css": "catalog:"
  },
  "devDependencies": {
    "@effect/language-service": "catalog:"
  }
}
```

**Step 4: Create tsconfig.json.tera**

```json
{
  "extends": "../../tsconfig.options.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/package.json": ["./package.json"]
    },
    "outDir": "../../.moon/cache/types/apps/{{ name }}",
    "plugins": [
      {
        "name": "@effect/language-service"
      }
    ]
  },
  "include": ["src", "tests", "package.json"],
  "references": [
    {
      "path": "../../packages/design-system"
    },
    {
      "path": "../../packages/telemetry"
    }
  ]
}
```

**Step 5: Create index.html.tera**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <title>{{ title }} - MiniApps</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```

**Step 6: Create compose.yml.tera**

```yaml
services:
  { { name } }:
    build:
      context: .
      dockerfile: Dockerfile
    networks:
      - traefik-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.{{ name }}.rule=Host(`{{ domain }}.localhost`)"
      - "traefik.http.routers.{{ name }}.entrypoints=web"

networks:
  traefik-network:
    external: true
```

**Step 7: Commit**

```bash
git add templates/app/template.yml templates/app/moon.yml.tera templates/app/package.json.tera templates/app/tsconfig.json.tera templates/app/index.html.tera templates/app/compose.yml.tera
git commit -m "feat: add app template — templated files"
```

---

## Task 9: Create app template — static files

**Files:**

- Create: `templates/app/vite.config.ts`
- Create: `templates/app/vitest.browser.config.ts`
- Create: `templates/app/tailwind.config.js`
- Create: `templates/app/Caddyfile.local.raw` (`.raw` to bypass Tera)
- Create: `templates/app/Caddyfile.raw` (`.raw` to bypass Tera)
- Create: `templates/app/Dockerfile`
- Create: `templates/app/.oxlintrc.json`
- Create: `templates/app/src/main.tsx`
- Create: `templates/app/src/app-entry.tsx`
- Create: `templates/app/src/index.css`
- Create: `templates/app/src/vite-env.d.ts`
- Create: `templates/app/tests/app.test.tsx`
- Copy: `templates/app/public/vite.svg` (from `apps/blog-fe/public/vite.svg`)

**Step 1: Create vite.config.ts**

```ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [tailwindcss(), tsconfigPaths()],
});
```

**Step 2: Create vitest.browser.config.ts**

```ts
import { playwright } from "@vitest/browser-playwright";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
      provider: playwright(),
    },
  },
});
```

**Step 3: Create tailwind.config.js**

```js
import { readFile } from "node:fs/promises";

const tsconfig = await readFile("./tsconfig.json");
const config = JSON.parse(tsconfig);

export default {
  content: config.references.map((ref) => `${ref.path}/**/*.{js,ts,jsx,tsx}`),
};
```

**Step 4: Create Caddyfile.local.raw**

Note: Uses `.raw` extension because Caddyfile uses `{$VAR}` syntax that conflicts with Tera. The `.raw` extension is stripped during generation.

```
{
  auto_https off
  # debug
}

{$DOMAIN_NAME} {
  tls localhost.pem localhost.key
  reverse_proxy /otlp* http://http-otel.localhost
  reverse_proxy http://localhost:5173
}
```

**Step 5: Create Caddyfile.raw**

```
{
  auto_https off
}

:80 {
  reverse_proxy /otlp* http://http-otel.localhost

  root * /srv
  try_files {path} /index.html
  file_server
}
```

**Step 6: Create Dockerfile**

```dockerfile
from caddy:latest

copy Caddyfile /etc/caddy/Caddyfile
copy dist /srv

expose 80

cmd ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
```

**Step 7: Create .oxlintrc.json**

```json
{
  "$schema": "../../node_modules/oxlint/configuration_schema.json",
  "extends": ["../../.oxlintrc.json"],
  "overrides": [
    {
      "files": ["src/**/*"],
      "env": {
        "browser": true
      }
    },
    {
      "files": ["tests/**/*"],
      "env": {
        "vitest": true
      }
    }
  ]
}
```

**Step 8: Create src/main.tsx**

```tsx
import { initTracing } from "@miniapps/telemetry";
import { createRoot } from "react-dom/client";

import { App } from "./app-entry";
import { name, version } from "@/package.json";
// eslint-disable-next-line import/no-unassigned-import main css import
import "./index.css";

initTracing({ serviceName: name, serviceVersion: version });

const el = document.querySelector("#root");

if (!el) {
  throw new Error("No root");
}

createRoot(el).render(<App />);
```

**Step 9: Create src/app-entry.tsx**

```tsx
import { Heading } from "@miniapps/design-system";

export const App: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <Heading level={1}>Hello World</Heading>
  </div>
);
```

**Step 10: Create src/index.css**

```css
@config "../tailwind.config.js";
@import "@miniapps/design-system/assets/tailwind.css";
```

**Step 11: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

**Step 12: Create tests/app.test.tsx**

```tsx
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { App } from "@/app-entry";

test("renders", async () => {
  const { getByText } = await render(<App />);

  await expect.element(getByText("Hello World")).toBeInTheDocument();
});
```

**Step 13: Copy vite.svg**

```bash
mkdir -p templates/app/public
cp apps/blog-fe/public/vite.svg templates/app/public/vite.svg
```

**Step 14: Commit**

```bash
git add templates/app
git commit -m "feat: add app template — static files"
```

---

## Task 10: Verify — generate a test app

**Step 1: Generate test app**

```bash
moon generate app -- --name test-app-fe --title "Test App" --domain test-app
```

**Step 2: Run pnpm install**

```bash
pnpm install
```

**Step 3: Verify all commands pass**

```bash
moonx :lint :fmt :types :build :test
```

Expected: All tasks pass including the new test-app-fe project.

**Step 4: Verify generated file structure**

```bash
ls -la apps/test-app-fe/
cat apps/test-app-fe/moon.yml
cat apps/test-app-fe/package.json
cat apps/test-app-fe/index.html
cat apps/test-app-fe/compose.yml
```

Verify:

- `moon.yml` has `DOMAIN_NAME: test-app-fe.localhost`
- `package.json` has `"name": "test-app-fe"`
- `index.html` has `<title>Test App - MiniApps</title>`
- `compose.yml` has `Host(\`test-app.localhost\`)`
- `Caddyfile.local` and `Caddyfile` exist (without `.raw` extension)

**Step 5: Clean up test app**

```bash
rm -rf apps/test-app-fe
pnpm install
```

**Step 6: Commit (if any fixes were needed)**

If fixes were made to templates, commit them. Otherwise skip.

---

## Task 11: Verify — generate a test package

**Step 1: Generate test package**

```bash
moon generate package -- --name test-pkg
```

**Step 2: Run pnpm install**

```bash
pnpm install
```

**Step 3: Verify all commands pass**

```bash
moonx :lint :fmt :types :build :test
```

Expected: All tasks pass including the new test-pkg project.

**Step 4: Verify generated file structure**

```bash
cat packages/test-pkg/package.json
cat packages/test-pkg/tsconfig.json
cat packages/test-pkg/moon.yml
```

Verify:

- `package.json` has `"name": "@miniapps/test-pkg"`
- `tsconfig.json` has `outDir` pointing to `../../.moon/cache/types/packages/test-pkg`

**Step 5: Clean up test package**

```bash
rm -rf packages/test-pkg
pnpm install
```

**Step 6: Commit (if any fixes were needed)**

If fixes were made to templates, commit them. Otherwise skip.

---

## Task 12: Final full verification

**Step 1: Run complete verification**

```bash
moonx :lint :fmt :types :build :test
```

Expected: All tasks pass — blog-fe (refactored), design-system, telemetry.

**Step 2: Review git log**

```bash
git log --oneline
```

Verify clean commit history.

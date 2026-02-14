# Moon Codegen Templates Design

## Summary

Implement Moon codegen templates for scaffolding new apps and packages, extract a shared `@miniapps/telemetry` package from blog-fe, and verify all commands work end-to-end.

## 1. `@miniapps/telemetry` Package

Extract blog-fe's Effect-based OpenTelemetry setup into `packages/telemetry`.

### Exports

- `initTracing(config)` — all-in-one: sets up traces, metrics, logs, web-vitals
- `createWebSdkLayer(config)` — just the OTel SDK layer (traces, metrics, logs)
- `reportWebVitals(layer)` — just web-vitals collection + reporting

### Config

```ts
interface TelemetryConfig {
  serviceName: string;
  serviceVersion: string;
  endpoint?: string; // default "/otlp"
  metricIntervalMs?: number; // default 5 minutes
  environment?: string; // default "local"
}
```

### moon.yml

```yaml
language: typescript
tags: [tsdown, vitest]
layer: library
```

### Dependencies

All `@opentelemetry/*`, `@effect/opentelemetry`, `effect`, `web-vitals` move from blog-fe to this package.

## 2. App Template (`templates/app/`)

### Variables

- `name` (string, required) — e.g. "dashboard-fe"
- `title` (string, required) — e.g. "Dashboard" for HTML title
- `domain` (string, required) — e.g. "dashboard" for Traefik host rule

### Destination

`apps/[name]`

### File Structure

**Templated (.tera):**

| File                 | Variables            |
| -------------------- | -------------------- |
| `moon.yml.tera`      | `name` (DOMAIN_NAME) |
| `package.json.tera`  | `name`               |
| `tsconfig.json.tera` | `name` (outDir)      |
| `index.html.tera`    | `title`              |
| `compose.yml.tera`   | `name`, `domain`     |

**Static (no interpolation):**

- `vite.config.ts` — tailwindcss + tsconfigPaths
- `vitest.browser.config.ts` — playwright browser config
- `tailwind.config.js` — reads tsconfig refs dynamically
- `Caddyfile.local` — dev reverse proxy (uses `.raw` to avoid Tera conflicts)
- `Caddyfile` — production SPA serving (uses `.raw`)
- `Dockerfile` — caddy container
- `.oxlintrc.json` — extends root, browser+vitest env
- `src/main.tsx` — telemetry init + App + css
- `src/app-entry.tsx` — minimal component using design-system
- `src/index.css` — tailwind config + design-system import
- `src/vite-env.d.ts` — vite types reference
- `tests/app.test.tsx` — basic render test
- `public/vite.svg` — default favicon

### Generated app depends on

- `@miniapps/design-system` (workspace)
- `@miniapps/telemetry` (workspace)

## 3. Package Template (`templates/package/`)

Updated from the existing minimal template.

### Variables

- `name` (string, required) — becomes `@miniapps/<name>`

### Destination

`packages/[name]`

### File Structure

**Templated (.tera):**

| File                 | Variables                  |
| -------------------- | -------------------------- |
| `package.json.tera`  | `name` (as @miniapps/name) |
| `tsconfig.json.tera` | `name` (outDir)            |

**Static:**

- `moon.yml` — tags: tsdown, vitest, layer: library
- `tsdown.config.ts` — basic tsdown with dts
- `vitest.config.ts` — browser tests with playwright
- `.oxlintrc.json` — extends root
- `src/index.ts` — empty export placeholder
- `tests/index.test.ts` — placeholder test

## 4. Integration Changes

### `.moon/workspace.yml`

Add `generator.templates` pointing to `./templates`.

### blog-fe refactor

- Remove `src/tracing.ts`, `src/web-vitals.ts`
- Update `src/main.tsx` to use `@miniapps/telemetry`
- Update `package.json` — remove direct OTel deps, add telemetry workspace dep
- Update `moon.yml` — add `telemetry` to `dependsOn`
- Update `tsconfig.json` — add telemetry to references

## 5. Verification

1. Generate a test app via `moon generate app`
2. Generate a test package via `moon generate package`
3. Run `moonx :lint :fmt :types :build :test` — all must pass
4. Verify blog-fe still works after telemetry extraction
5. Clean up test app/package after verification

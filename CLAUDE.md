# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript/React monorepo using:

- **pnpm** for package management with workspaces
- **Moon** as the build orchestrator and task runner
- **proto** for tool version management (auto-installs Node, pnpm, Moon)

### Structure

```
apps/
  blog-fe/           # React 19 + Vite frontend application
packages/
  design-system/     # React component library (tsdown build, Storybook docs)
```

The blog-fe app depends on the design-system package via `"@miniapps/design-system": "workspace:*"`.

## Commands

**Always use `moon ci` to verify changes before committing.**

### Development

```bash
pnpm install          # Install dependencies (required first)
moon :dev             # Run blog-fe dev server
moon design-system:watch  # Watch library changes during development
```

### Linting, Formatting, and Type Checking

```bash
moon :lint            # Lint all projects (oxlint)
moon :lint.fix        # Fix linting issues
moon :fmt             # Check formatting (oxfmt)
moon :fmt.fix         # Fix formatting
moon :types           # Type check
```

### Testing

```bash
moon :test            # Run tests (Vitest with headless browser)
moon :test.watch      # Run tests in watch mode
moon design-system:test   # Run specific project tests
```

### Building

```bash
moon :build           # Build all projects
moon blog-fe:build    # Build specific project
```

### CI & Maintenance

```bash
moon ci               # Full CI pipeline (lint, fmt, types, build, test)
make ci               # Clean install + moon ci
make up               # Update all dependencies interactively
```

### Task Syntax

Moon tasks follow `moon <project>:<task>` syntax. Use `:task` (without project) to run across all applicable projects.

## Architecture Notes

- **Formatting**: Uses oxfmt (not Prettier) - 100 char line width, 2-space indent
- **Linting**: Uses oxlint (not ESLint) with `--type-aware` flag
- **Testing**: Vitest with Playwright browser runner for component tests
- **Observability**: OpenTelemetry integration in blog-fe (traces, metrics, logs via effect-ts)
- **Component patterns**: Shadcn/ui-style components using class-variance-authority and Radix UI primitives

Design system exports: React components, utility functions, and Tailwind CSS via separate entry points.

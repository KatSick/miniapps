# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a monorepo using Moon (v2) as the build system, pnpm as the package manager, TypeScript as the primary language, and Vite for bundling. YAML is used extensively for Moon task/project configs.

## Project Overview

This is a TypeScript/React monorepo using:

- **Moon** as the build orchestrator and task runner (auto-executes pnpm install, etc)
- **proto** for tool version management (auto-installs Node, pnpm, Moon)

### Structure

```
apps/
  blog-fe/           # React 19 + Vite frontend application
packages/
  design-system/     # React component library (tsdown build, Storybook docs)
  telemetry/         # Shared OpenTelemetry + web vitals package (Effect-based)
templates/
  app/               # Moon codegen template for new Vite + React apps
  package/           # Moon codegen template for new tsdown library packages
```

The blog-fe app depends on the design-system and telemetry packages via `"workspace:*"`.

## Git Conventions

NEVER use `--no-verify` when committing. Always let pre-commit hooks run.

When using `git add` in worktrees, NEVER use `git add -A`. Always use `git add` with specific file paths to avoid accidentally staging deletions of files from other worktrees (e.g., pre-commit hooks).

When creating PRs, always use the worktree workflow: create a worktree for the branch, make changes there, commit, push, and open the PR. Do not commit directly to main.

### CI

Do not attempt to poll or wait for CI results. After pushing a branch and creating a PR, report the PR URL and let the user check CI status themselves.

## CLI & Shell Commands

For interactive CLI tools (e.g., `pnpm update`, `moonx migrate`), always use non-interactive/batch flags (e.g., `--yes`, `--latest`) instead of trying to pipe input or poll for interactive prompts.

## Commands

**Always use `moonx :test :lint :fmt :build :types` to verify changes before committing.**

### Development

```bash
moonx :dev             # Run blog-fe dev server
moonx design-system:watch  # Watch library changes during development
```

### Linting, Formatting, and Type Checking

```bash
moonx :lint            # Lint all projects (oxlint)
moonx :lint.fix        # Fix linting issues
moonx :fmt             # Check formatting (oxfmt)
moonx :fmt.fix         # Fix formatting
moonx :types           # Type check
```

### Testing

```bash
moonx :test            # Run tests (Vitest with headless browser)
moonx :test.watch      # Run tests in watch mode
moonx design-system:test   # Run specific project tests
```

### Building

```bash
moonx :build           # Build all projects
moonx blog-fe:build    # Build specific project
```

### Scaffolding

```bash
moonx generate app      # Scaffold a new Vite + React app (prompts for name, title, domain)
moonx generate package  # Scaffold a new tsdown library package (prompts for name)
```

### CI & Maintenance

```bash
moonx ci               # Full CI pipeline (lint, fmt, types, build, test)
make ci               # Clean install + moonx ci
make up               # Update all dependencies interactively
```

### Task Syntax

Moon tasks follow `moonx <project>:<task>` syntax. Use `moonx :task` (without project) to run across all applicable projects.

## Architecture Notes

- **Formatting**: Uses oxfmt (not Prettier) - 100 char line width, 2-space indent
- **Linting**: Uses oxlint (not ESLint) with `--type-aware` flag
- **Testing**: Vitest with Playwright browser runner for component tests
- **Observability**: `@miniapps/telemetry` package provides OpenTelemetry integration (traces, metrics, logs, web vitals via Effect)
- **Component patterns**: Shadcn/ui-style components using class-variance-authority and Radix UI primitives

Design system exports: React components, utility functions, and Tailwind CSS via separate entry points.

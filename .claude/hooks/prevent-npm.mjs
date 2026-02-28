#!/usr/bin/env node
// Block npm/npx calls and redirect to pnpm.
const data = JSON.parse(process.env.CLAUDE_TOOL_INPUT ?? "{}");
const cmd = data.command ?? "";

if (/(?:^|[\s;&|])(npm|npx)(?:[\s(]|$)/.test(cmd)) {
  console.log(
    JSON.stringify({
      decision: "block",
      reason:
        "Use pnpm instead of npm/npx. This project uses pnpm as its package manager. " +
        "Replace `npm install` → `pnpm add`, `npm run` → `pnpm run`, `npx` → `pnpm dlx`.",
    }),
  );
  process.exit(2);
}

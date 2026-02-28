#!/usr/bin/env node
// Block dangerous git commands as per CLAUDE.md git conventions.
import { execFileSync } from "node:child_process";

const data = JSON.parse(process.env.CLAUDE_TOOL_INPUT ?? "{}");
const cmd = data.command ?? "";

function block(reason) {
  console.log(JSON.stringify({ decision: "block", reason }));
  process.exit(2);
}

// Block --no-verify on git commit (CLAUDE.md: "NEVER use --no-verify when committing")
if (/\bgit\s+commit\b.*--no-verify/.test(cmd)) {
  block("CLAUDE.md: Never use --no-verify when committing. Always let pre-commit hooks run.");
}

// Block git add -A / --all / . (CLAUDE.md: "NEVER use git add -A" in worktrees)
if (/\bgit\s+add\s+(-A|--all|\.)(?:\s|$|&&|;|\|)/.test(cmd)) {
  block(
    "CLAUDE.md: Never use 'git add -A', 'git add --all', or 'git add .' in worktrees. " +
      "Always stage specific file paths — bulk add can accidentally include deletions of files from other worktrees.",
  );
}

// Block git commit or git push while on main (CLAUDE.md: "Do not commit directly to main")
if (/\bgit\s+(commit|push)\b/.test(cmd)) {
  try {
    const branch = execFileSync("git", ["branch", "--show-current"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (branch === "main") {
      block(
        "CLAUDE.md: Do not commit or push directly to 'main'. " +
          "Create a worktree for a feature branch first (moonx generate or git worktree add), " +
          "then commit and push from there.",
      );
    }
  } catch {
    // git not available or not in a repo — allow
  }
}

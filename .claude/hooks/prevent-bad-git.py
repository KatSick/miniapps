#!/usr/bin/env python3
"""Block dangerous git commands as per CLAUDE.md git conventions."""
import json
import os
import re
import subprocess
import sys

data = json.loads(os.environ.get("CLAUDE_TOOL_INPUT", "{}"))
cmd = data.get("command", "")


def block(reason: str) -> None:
    print(json.dumps({"decision": "block", "reason": reason}))
    sys.exit(2)


# Block --no-verify on git commit (CLAUDE.md: "NEVER use --no-verify when committing")
if re.search(r"\bgit\s+commit\b.*--no-verify", cmd):
    block(
        "CLAUDE.md: Never use --no-verify when committing. Always let pre-commit hooks run."
    )

# Block git add -A / --all / . (CLAUDE.md: "NEVER use git add -A" in worktrees)
if re.search(r"\bgit\s+add\s+(-A|--all|\.)(?:\s|$|&&|;|\|)", cmd):
    block(
        "CLAUDE.md: Never use 'git add -A', 'git add --all', or 'git add .' in worktrees. "
        "Always stage specific file paths — bulk add can accidentally include deletions "
        "of files from other worktrees."
    )

# Block git commit or git push while on main (CLAUDE.md: "Do not commit directly to main")
if re.search(r"\bgit\s+(commit|push)\b", cmd):
    try:
        branch = subprocess.check_output(
            ["git", "branch", "--show-current"], stderr=subprocess.DEVNULL, text=True
        ).strip()
        if branch == "main":
            block(
                "CLAUDE.md: Do not commit or push directly to 'main'. "
                "Create a worktree for a feature branch first (moonx generate or git worktree add), "
                "then commit and push from there."
            )
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

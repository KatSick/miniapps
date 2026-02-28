#!/usr/bin/env python3
"""Block npm/npx calls and redirect to pnpm."""
import json
import os
import re
import sys

data = json.loads(os.environ.get("CLAUDE_TOOL_INPUT", "{}"))
cmd = data.get("command", "")

if re.search(r"(?:^|[\s;&|])(npm|npx)(?:[\s(]|$)", cmd):
    print(
        json.dumps(
            {
                "decision": "block",
                "reason": "Use pnpm instead of npm/npx. This project uses pnpm as its package manager. "
                "Replace `npm install` → `pnpm add`, `npm run` → `pnpm run`, `npx` → `pnpm dlx`.",
            }
        )
    )
    sys.exit(2)

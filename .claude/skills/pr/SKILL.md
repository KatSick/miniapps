## Create a PR from current changes

1. Create a new git worktree: `git worktree add ./worktrees/worktree-<branch> -b <branch>`
2. Copy changed files to the worktree (use specific paths, NEVER `git add -A`)
3. Commit with meaningful message (NEVER use --no-verify)
4. Push the branch
5. Create a PR with gh cli
6. Report the PR URL — do NOT poll for CI results

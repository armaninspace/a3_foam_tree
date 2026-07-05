#!/usr/bin/env bash
set -euo pipefail

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Not on a branch; checkout a branch before pushing." >&2
  exit 1
fi

if ! git diff --cached --quiet; then
  echo "Index has staged changes. Commit before pushing." >&2
  exit 1
fi

if ! git diff --quiet; then
  echo "Worktree has unstaged changes. Commit or stash before pushing." >&2
  exit 1
fi

git push -u origin "$branch"
